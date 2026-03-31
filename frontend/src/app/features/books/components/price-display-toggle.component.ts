import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { BitcoinPriceService } from '../api/bitcoin-price.service';
import { PriceDisplayModeService } from '../state/price-display-mode.service';

// could get currency from the service but this will do

@Component({
  selector: 'app-price-display-toggle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-2">
      <p class="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">Display</p>

      <div
        class="inline-flex rounded-md border border-neutral-800 bg-neutral-900 p-1"
      >
        <button
          type="button"
          class="rounded-sm px-3 py-2 text-sm font-medium transition-colors"
          [class.bg-white]="priceDisplayMode.mode() === 'btc'"
          [class.text-black]="priceDisplayMode.mode() === 'btc'"
          [class.text-neutral-400]="priceDisplayMode.mode() !== 'btc'"
          (click)="priceDisplayMode.setMode('btc')"
        >
          BTC
        </button>

        <button
          type="button"
          class="rounded-sm px-3 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40"
          [class.bg-white]="priceDisplayMode.mode() === 'eur'"
          [class.text-black]="priceDisplayMode.mode() === 'eur'"
          [class.text-neutral-400]="priceDisplayMode.mode() !== 'eur'"
          [disabled]="!canDisplayEur()"
          (click)="priceDisplayMode.setMode('eur')"
        >
          EUR
        </button>
      </div>
    </div>
  `
})

export class PriceDisplayToggleComponent {
  protected readonly priceDisplayMode = inject(PriceDisplayModeService);
  private readonly bitcoinPrice = inject(BitcoinPriceService);

  protected readonly canDisplayEur = computed(() => this.bitcoinPrice.eurPerBitcoin.hasValue());
}
