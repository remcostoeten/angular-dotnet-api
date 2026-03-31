import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { BitcoinPriceService } from '../api/bitcoin-price.service';
import { PriceDisplayModeService } from '../state/price-display-mode.service';

@Component({
  selector: 'app-book-price-label',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DecimalPipe],
  template: `
    <div class="rounded-sm border border-neutral-800 bg-neutral-950 px-3 py-2 text-right">
      <p class="text-lg font-medium text-white">
        @if (showEurAsPrimary()) {
          €{{ eurPrice() | number: '1.2-2' }}
        } @else {
          ₿{{ btcPrice() | number: '1.4-8' }}
        }
      </p>

      @if (eurPrice() !== null) {
        <p class="mt-1 text-xs text-neutral-500">
          @if (showEurAsPrimary()) {
            / ₿{{ btcPrice() | number: '1.4-8' }}
          } @else {
            / €{{ eurPrice() | number: '1.2-2' }}
          }
        </p>
      }
    </div>
  `
})

export class BookPriceLabelComponent {
  readonly btcPrice = input.required<number>();

  protected readonly priceDisplayMode = inject(PriceDisplayModeService);
  private readonly bitcoinPrice = inject(BitcoinPriceService);
  protected readonly showEurAsPrimary = computed(() =>
    this.priceDisplayMode.mode() === 'eur' && this.eurPrice() !== null
  );

  protected readonly eurPrice = computed(() => {
    if (!this.bitcoinPrice.eurPerBitcoin.hasValue()) {
      return null;
    }

    return this.btcPrice() * this.bitcoinPrice.eurPerBitcoin.value();
  });
}
