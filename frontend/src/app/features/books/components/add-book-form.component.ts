import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { form, FormField, required, validate } from '@angular/forms/signals';

import { BitcoinPriceService } from '../api/bitcoin-price.service';
import type { ICreateBookPayload } from '../api/books.models';

@Component({
  selector: 'app-add-book-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DecimalPipe, FormField],
  template: `
    <form (submit)="onSubmit($event)" class="space-y-6">
      <div class="space-y-2">
        <label class="block text-sm font-medium text-neutral-400" for="title">Title</label>
        <div class="flex min-h-12 items-center gap-3 rounded-md border border-neutral-800 bg-neutral-900 px-3 focus-within:border-neutral-600">
          <input
            id="title"
            type="text"
            [formField]="bookForm.title"
            class="w-full border-0 bg-transparent py-3 text-sm text-white outline-none placeholder:text-neutral-500"
            placeholder="Enter book title"
          />
        </div>

        @if (bookForm.title().touched() && bookForm.title().invalid()) {
          <p class="text-xs text-red-400">{{ bookForm.title().errors()[0].message }}</p>
        }
      </div>

      <div class="space-y-2">
        <label class="block text-sm font-medium text-neutral-400" for="authorName">Author</label>
        <div class="flex min-h-12 items-center gap-3 rounded-md border border-neutral-800 bg-neutral-900 px-3 focus-within:border-neutral-600">
          <input
            id="authorName"
            type="text"
            [formField]="bookForm.authorName"
            class="w-full border-0 bg-transparent py-3 text-sm text-white outline-none placeholder:text-neutral-500"
            placeholder="Enter author name"
          />
        </div>

        @if (bookForm.authorName().touched() && bookForm.authorName().invalid()) {
          <p class="text-xs text-red-400">{{ bookForm.authorName().errors()[0].message }}</p>
        }
      </div>

      <section class="space-y-4 rounded-md border border-neutral-800 bg-neutral-950/60 p-4">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="space-y-2">
            <p class="text-sm font-medium text-white">Price</p>
            <div class="inline-flex rounded-md border border-neutral-800 bg-neutral-900 p-1">
              <button
                type="button"
                class="rounded-sm px-3 py-2 text-sm font-medium transition-colors"
                [class.bg-white]="priceEntryMode() === 'btc'"
                [class.text-black]="priceEntryMode() === 'btc'"
                [class.text-neutral-400]="priceEntryMode() !== 'btc'"
                [disabled]="isSubmitting()"
                (click)="priceEntryMode.set('btc')"
              >
                BTC first
              </button>

              <button
                type="button"
                class="rounded-sm px-3 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                [class.bg-white]="priceEntryMode() === 'eur'"
                [class.text-black]="priceEntryMode() === 'eur'"
                [class.text-neutral-400]="priceEntryMode() !== 'eur'"
                [disabled]="isSubmitting()"
                (click)="priceEntryMode.set('eur')"
              >
                EUR first
              </button>
            </div>
          </div>

          @if (currentEurPerBitcoin() !== null) {
            <p class="text-sm text-neutral-400">Current EUR/BTC: €{{ currentEurPerBitcoin() | number: '1.2-2' }}</p>
          } @else {
            <p class="text-sm text-amber-300">EUR conversion unavailable.</p>
          }
        </div>

        @if (priceEntryMode() === 'eur') {
          <div class="grid gap-4 md:grid-cols-2">
            <div class="space-y-2">
              <label class="block text-sm font-medium text-neutral-400" for="priceEur">Price (EUR)</label>
              <div class="flex min-h-12 items-center gap-3 rounded-md border border-neutral-800 bg-neutral-900 px-3 focus-within:border-neutral-600">
                <input
                  #priceEurField
                  id="priceEur"
                  type="number"
                  step="0.01"
                  [value]="eurPriceInput()"
                  [disabled]="isSubmitting() || !canConvertPrice()"
                  (input)="onEurPriceInput(priceEurField.value)"
                  (blur)="onEurPriceBlur(priceEurField.value)"
                  class="w-full border-0 bg-transparent py-3 text-sm text-white outline-none placeholder:text-neutral-500 disabled:cursor-not-allowed"
                  placeholder="EUR equivalent"
                />
              </div>
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-neutral-400" for="priceBtc">Price (BTC)</label>
              <div class="flex min-h-12 items-center gap-3 rounded-md border border-neutral-800 bg-neutral-900 px-3 focus-within:border-neutral-600">
                <input
                  #priceBtcField
                  id="priceBtc"
                  type="number"
                  step="any"
                  [value]="btcPriceInput()"
                  [disabled]="isSubmitting()"
                  (input)="onBtcPriceInput(priceBtcField.value)"
                  (blur)="onBtcPriceBlur(priceBtcField.value)"
                  class="w-full border-0 bg-transparent py-3 text-sm text-white outline-none placeholder:text-neutral-500"
                  placeholder="0.001"
                />
              </div>
            </div>
          </div>
        } @else {
          <div class="grid gap-4 md:grid-cols-2">
            <div class="space-y-2">
              <label class="block text-sm font-medium text-neutral-400" for="priceBtc">Price (BTC)</label>
              <div class="flex min-h-12 items-center gap-3 rounded-md border border-neutral-800 bg-neutral-900 px-3 focus-within:border-neutral-600">
                <input
                  #priceBtcField
                  id="priceBtc"
                  type="number"
                  step="any"
                  [value]="btcPriceInput()"
                  [disabled]="isSubmitting()"
                  (input)="onBtcPriceInput(priceBtcField.value)"
                  (blur)="onBtcPriceBlur(priceBtcField.value)"
                  class="w-full border-0 bg-transparent py-3 text-sm text-white outline-none placeholder:text-neutral-500"
                  placeholder="0.001"
                />
              </div>
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-neutral-400" for="priceEur">Price (EUR)</label>
              <div class="flex min-h-12 items-center gap-3 rounded-md border border-neutral-800 bg-neutral-900 px-3 focus-within:border-neutral-600">
                <input
                  #priceEurField
                  id="priceEur"
                  type="number"
                  step="0.01"
                  [value]="eurPriceInput()"
                  [disabled]="isSubmitting() || !canConvertPrice()"
                  (input)="onEurPriceInput(priceEurField.value)"
                  (blur)="onEurPriceBlur(priceEurField.value)"
                  class="w-full border-0 bg-transparent py-3 text-sm text-white outline-none placeholder:text-neutral-500 disabled:cursor-not-allowed"
                  placeholder="EUR equivalent"
                />
              </div>
            </div>
          </div>
        }
        @if (storedBtcPrice() !== null) {
          <div class="rounded-md border border-neutral-800 bg-neutral-900 p-4">
            <p class="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">Stored value</p>
            <div class="mt-3 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p class="text-xl font-semibold text-white">₿{{ storedBtcPrice() | number: '1.4-8' }}</p>
              </div>

              @if (storedEurPrice() !== null) {
                <p class="text-sm text-neutral-400">
                  €{{ storedEurPrice() | number: '1.2-2' }}
                </p>
              }
            </div>
          </div>
        }
      </section>

      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          [disabled]="isSubmitting() || bookForm().invalid()"
          class="inline-flex min-w-[10rem] items-center justify-center rounded-md bg-white px-4 py-3 text-sm font-medium text-black transition-colors hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          @if (isSubmitting()) {
            Adding book...
          // kinda pointless as we post to memory which is near instant but showcases whats possible
            } @else {
            Add book
          }
        </button>
      </div>
    </form>
  `
})

export class AddBookFormComponent {
  readonly isSubmitting = input(false);
  readonly submitBook = output<ICreateBookPayload>();
  private readonly bitcoinPrice = inject(BitcoinPriceService);

  readonly bookModel = signal<ICreateBookPayload>({
    title: '',
    authorName: '',
    price: 0
  });
  readonly priceEntryMode = signal<'btc' | 'eur'>('btc');
  readonly btcPriceInput = signal('');
  readonly eurPriceInput = signal('');
  readonly lastEditedPriceField = signal<'btc' | 'eur'>('btc');
  protected readonly canConvertPrice = computed(() => this.bitcoinPrice.eurPerBitcoin.hasValue());
  protected readonly currentEurPerBitcoin = computed(() => this.bitcoinPrice.eurPerBitcoin.hasValue()
    ? this.bitcoinPrice.eurPerBitcoin.value()
    : null);
  protected readonly storedBtcPrice = computed(() => this.bookModel().price > 0 ? this.bookModel().price : null);
  protected readonly storedEurPrice = computed(() => {
    const btcPrice = this.storedBtcPrice();
    const eurPerBitcoin = this.currentEurPerBitcoin();

    if (btcPrice === null || eurPerBitcoin === null) {
      return null;
    }

    return btcPrice * eurPerBitcoin;
  });

  readonly bookForm = form(this.bookModel, (s) => {
    required(s.title, { message: 'Title is required' });
    required(s.authorName, { message: 'Author is required' });
    required(s.price, { message: 'Price is required' });
    validate(s.price, ({ value }) => {
      if (value() <= 0) {
        return {
          kind: 'positivePrice',
          message: 'Price must be greater than 0 BTC'
        };
      }

      return undefined;
    });
  });

  onSubmit(event: Event): void {
    event.preventDefault();

    if (this.lastEditedPriceField() === 'eur') {
      this.onEurPriceBlur(this.eurPriceInput());
    } else {
      this.onBtcPriceBlur(this.btcPriceInput());
    }

    if (this.bookForm().invalid()) {
      return;
    }

    this.submitBook.emit(this.bookForm().value());
  }

  onBtcPriceInput(rawValue: string): void {
    this.lastEditedPriceField.set('btc');
    this.btcPriceInput.set(rawValue);
  }

  onEurPriceInput(rawValue: string): void {
    this.lastEditedPriceField.set('eur');
    this.eurPriceInput.set(rawValue);
  }

  onBtcPriceBlur(rawValue: string): void {
    const btcPrice = Number(rawValue);
    const eurPerBitcoin = this.bitcoinPrice.eurPerBitcoin.hasValue()
      ? this.bitcoinPrice.eurPerBitcoin.value()
      : null;

    if (!Number.isFinite(btcPrice) || btcPrice <= 0) {
      this.bookModel.update((book) => ({
        ...book,
        price: 0
      }));
      this.btcPriceInput.set('');
      this.eurPriceInput.set('');
      return;
    }

    this.bookModel.update((book) => ({
      ...book,
      price: btcPrice
    }));
    this.btcPriceInput.set(String(btcPrice));

    if (eurPerBitcoin === null) {
      this.eurPriceInput.set('');
      return;
    }

    this.eurPriceInput.set((btcPrice * eurPerBitcoin).toFixed(2));
  }

  onEurPriceBlur(rawValue: string): void {
    const eurPrice = Number(rawValue);
    const eurPerBitcoin = this.bitcoinPrice.eurPerBitcoin.hasValue()
      ? this.bitcoinPrice.eurPerBitcoin.value()
      : null;

    if (eurPerBitcoin === null || !Number.isFinite(eurPrice) || eurPrice <= 0) {
      this.bookModel.update((book) => ({
        ...book,
        price: 0
      }));
      this.eurPriceInput.set('');
      return;
    }

    const btcPrice = eurPrice / eurPerBitcoin;

    this.bookModel.update((book) => ({
      ...book,
      price: btcPrice
    }));
    this.eurPriceInput.set(eurPrice.toFixed(2));
    this.btcPriceInput.set(String(btcPrice));
  }

  reset(): void {
    this.bookForm().reset({
      title: '',
      authorName: '',
      price: 0
    });
    this.btcPriceInput.set('');
    this.eurPriceInput.set('');
    this.lastEditedPriceField.set('btc');
  }
}
