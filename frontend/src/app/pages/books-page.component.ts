import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, computed, effect, inject, signal, viewChild } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { BitcoinPriceService } from '../features/books/api/bitcoin-price.service';
import { BooksApiService } from '../features/books/api/books-api.service';
import type { IBookDto, ICreateBookPayload } from '../features/books/api/books.models';
import { AddBookFormComponent } from '../features/books/components/add-book-form.component';
import { BookPriceLabelComponent } from '../features/books/components/book-price-label.component';
import { PriceDisplayToggleComponent } from '../features/books/components/price-display-toggle.component';
import { PageLayoutComponent } from '../components/page-layout.component';

@Component({
  selector: 'app-books-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DecimalPipe,
    PageLayoutComponent,
    AddBookFormComponent,
    PriceDisplayToggleComponent,
    BookPriceLabelComponent
  ],
  template: `
    <app-page-layout
      title="Books"
    >
      <div class="grid gap-6 xl:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] xl:items-start">
        <section class="xl:sticky xl:top-28">
          <div class="rounded-md border border-neutral-800 bg-neutral-900 p-6">
            <div class="mb-6">
              <h2 class="text-lg font-semibold text-white">Add a book</h2>
            </div>

            <app-add-book-form [isSubmitting]="isCreating()" (submitBook)="onCreateBook($event)" />

            @if (createError()) {
              <p class="mt-4 text-sm text-red-400">
                {{ createError() }}
              </p>
            }
          </div>
        </section>

        <section class="space-y-4">
          <div class="flex flex-col gap-4 rounded-md border border-neutral-800 bg-neutral-900 p-6 md:flex-row md:items-center md:justify-between">
            <div class="space-y-1">
              <h2 class="text-lg font-semibold text-white">Books</h2>
              @if (searchTerm().trim()) {
                <p class="text-sm text-neutral-400">
                  {{ visibleBookCount() }} of {{ bookCount() }} {{ bookCount() === 1 ? 'item' : 'items' }}
                </p>
              } @else {
                <p class="text-sm text-neutral-400">{{ bookCount() }} {{ bookCount() === 1 ? 'item' : 'items' }}</p>
              }
              @if (hasLiveConversion()) {
                <p class="text-xs text-neutral-500">Current EUR/BTC: €{{ bitcoinPrice.eurPerBitcoin.value() | number: '1.2-2' }}</p>
                <p class="text-xs text-neutral-500">
                  @if (secondsUntilAutomaticRefresh() > 0) {
                    Cache refresh on post in {{ secondsUntilAutomaticRefresh() }}s
                  } @else {
                    Cache can refresh on the next post
                  }
                </p>
              }
            </div>
            <div class="flex flex-col gap-3 md:items-end">
              <div class="flex items-center gap-4">
                <app-price-display-toggle />
                <button
                  type="button"
                  class="rounded-md border border-neutral-700 px-3 py-2 text-xs font-medium text-white transition-colors hover:border-neutral-500 hover:bg-neutral-950 disabled:cursor-not-allowed disabled:opacity-50"
                  [disabled]="isRefreshingConversion()"
                  (click)="onRefreshBitcoinPrice()"
                >
                  {{ isRefreshingConversion() ? 'Refreshing...' : 'Refresh rate' }}
                </button>
                @if (!hasLiveConversion()) {
                  <p class="text-xs text-amber-300">EUR unavailable</p>
                }
              </div>

              <div class="flex min-h-11 w-full items-center gap-3 rounded-md border border-neutral-800 bg-neutral-950 px-3 md:w-72">
                <input
                  #searchField
                  type="search"
                  [value]="searchTerm()"
                  (input)="searchTerm.set(searchField.value)"
                  class="w-full border-0 bg-transparent py-2 text-sm text-white outline-none placeholder:text-neutral-500"
                  placeholder="Search title or author"
                />
              </div>
            </div>
          </div>

          @if (bitcoinPrice.eurPerBitcoin.isLoading()) {
            <p class="text-sm text-neutral-500">
              Loading BTC/EUR rate...
            </p>
          } @else if (bitcoinPrice.eurPerBitcoin.error()) {
            <p class="text-sm text-amber-300">
              BTC to EUR conversion is unavailable right now.
            </p>
          }

          @if (booksApi.books.isLoading()) {
            <p class="text-sm text-neutral-500">Loading books...</p>
          } @else if (booksApi.books.error()) {
            <div class="text-sm text-red-400">
              Failed to load books.
            </div>
          } @else if (bookCount() === 0) {
            <div class="rounded-md border border-neutral-800 bg-neutral-900 px-6 py-10 text-center text-neutral-400">
              No books found.
            </div>
          } @else if (visibleBookCount() === 0) {
            <div class="rounded-md border border-neutral-800 bg-neutral-900 px-6 py-10 text-center text-neutral-400">
              No books match "{{ searchTerm() }}".
            </div>
          } @else {
            <div class="grid gap-4 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)]">
              <div class="rounded-md border border-neutral-800 bg-neutral-900 p-2">
                <ul class="space-y-2">
                  @for (book of filteredBooks(); track book.id; let index = $index) {
                    <li>
                      <button
                        type="button"
                        class="flex w-full items-center justify-between gap-3 rounded-md border px-4 py-3 text-left transition-colors"
                        [class.border-white]="selectedBookId() === book.id"
                        [class.bg-neutral-950]="selectedBookId() === book.id"
                        [class.border-neutral-800]="selectedBookId() !== book.id"
                        [class.bg-neutral-900]="selectedBookId() !== book.id"
                        (click)="onSelectBook(book.id)"
                      >
                        <div class="min-w-0">
                          <p class="text-xs uppercase tracking-[0.2em] text-neutral-500">#{{ index + 1 }}</p>
                          <p class="mt-1 truncate text-sm font-semibold text-white">{{ book.title || 'Untitled' }}</p>
                          <p class="mt-1 truncate text-xs text-neutral-400">{{ book.authorName || 'Unknown author' }}</p>
                        </div>

                        <div class="shrink-0 text-xs text-neutral-500">
                          View
                        </div>
                      </button>
                    </li>
                  }
                </ul>
              </div>

              <div class="rounded-md border border-neutral-800 bg-neutral-900 p-6">
                @if (booksApi.selectedBook.isLoading()) {
                  <p class="text-sm text-neutral-500">Loading book...</p>
                } @else if (booksApi.selectedBook.error()) {
                  <p class="text-sm text-red-400">Failed to load the selected book.</p>
                } @else if (booksApi.selectedBook.hasValue()) {
                  <article class="space-y-6">
                    <div class="flex items-start justify-between gap-4">
                      <div class="min-w-0">
                        <p class="text-xs uppercase tracking-[0.2em] text-neutral-500">Selected book</p>
                        <h3 class="mt-2 text-2xl font-semibold text-white">{{ booksApi.selectedBook.value().title || 'Untitled' }}</h3>
                        <p class="mt-2 text-sm text-neutral-400">{{ booksApi.selectedBook.value().authorName || 'Unknown author' }}</p>
                      </div>

                      <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-neutral-800 bg-neutral-950 text-sm font-semibold text-white">
                        {{ booksApi.selectedBook.value().title?.slice(0, 1) || 'B' }}
                      </div>
                    </div>

                    <div class="rounded-md border border-neutral-800 bg-neutral-950 p-4">
                      <div class="flex items-end justify-between gap-4">
                        <div>
                          <p class="text-xs uppercase tracking-[0.2em] text-neutral-500">Price</p>
                          <p class="mt-2 text-sm text-neutral-400">Loaded from the detail endpoint.</p>
                        </div>

                        @if (booksApi.selectedBook.value().price; as btcPrice) {
                          <app-book-price-label [btcPrice]="btcPrice" />
                        }
                      </div>
                    </div>
                  </article>
                } @else {
                  <p class="text-sm text-neutral-400">Select a book to load its details.</p>
                }
              </div>
            </div>
          }
        </section>
      </div>
    </app-page-layout>
  `
})
export class BooksPageComponent {
  protected readonly isCreating = signal(false);
  protected readonly booksApi = inject(BooksApiService);
  protected readonly bitcoinPrice = inject(BitcoinPriceService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly addBookForm = viewChild(AddBookFormComponent);
  protected readonly searchTerm = signal('');
  private readonly now = signal(Date.now());
  protected readonly selectedBookId = this.booksApi.selectedBookId;

  protected readonly books = computed<readonly IBookDto[]>(() => this.booksApi.books.hasValue() ? this.booksApi.books.value() : []);
  protected readonly filteredBooks = computed(() => {
    const searchTerm = this.searchTerm().trim().toLowerCase();

    if (searchTerm === '') {
      return this.books();
    }

    return this.books().filter((book) => {
      const title = (book.title ?? '').toLowerCase();
      const author = (book.authorName ?? '').toLowerCase();

      return title.includes(searchTerm) || author.includes(searchTerm);
    });
  });
  protected readonly bookCount = computed(() => this.books().length);
  protected readonly visibleBookCount = computed(() => this.filteredBooks().length);
  protected readonly hasLiveConversion = computed(() => this.bitcoinPrice.eurPerBitcoin.hasValue());
  protected readonly isRefreshingConversion = computed(() => {
    const status = this.bitcoinPrice.eurPerBitcoin.status();

    return status === 'loading' || status === 'reloading';
  });
  protected readonly secondsUntilAutomaticRefresh = computed(() =>
    Math.ceil(this.bitcoinPrice.getRemainingCacheMs(this.now()) / 1_000)
  );
  protected readonly createError = signal<string | null>(null);

  constructor() {
    this.bitcoinPrice.ensureFresh();
    const timer = window.setInterval(() => this.now.set(Date.now()), 1_000);

    this.destroyRef.onDestroy(() => window.clearInterval(timer));

    effect(() => {
      const books = this.books();

      if (books.length === 0) {
        this.selectedBookId.set(null);
        return;
      }

      const selectedBookId = this.selectedBookId();
      const selectedStillExists = selectedBookId !== null && books.some((book) => book.id === selectedBookId);

      if (!selectedStillExists) {
        this.booksApi.selectBook(books[0].id);
      }
    });
  }

  async onCreateBook(payload: ICreateBookPayload): Promise<void> {
    this.createError.set(null);
    this.isCreating.set(true);

    try {
      this.bitcoinPrice.ensureFresh();
      await firstValueFrom(this.booksApi.addBook(payload));
      this.addBookForm()?.reset();
      this.booksApi.books.reload();
      this.isCreating.set(false);
    } catch {
      this.createError.set('Failed to add book.');
      this.isCreating.set(false);
    }
  }

  onSelectBook(id: string): void {
    this.booksApi.selectBook(id);
  }

  onRefreshBitcoinPrice(): void {
    this.bitcoinPrice.forceRefresh();
  }
}
