import { httpResource } from '@angular/common/http';
import { effect, inject, Injectable, signal } from '@angular/core';

import { API_CONFIG } from '../../../core/config/api.config';

const BITCOIN_PRICE_CACHE_TTL_MS = 60_000;

interface IResponse {
  readonly bitcoin: {
    readonly eur: number;
  };
}

function parseBitcoinPriceResponse(response: IResponse): number {
  return response.bitcoin.eur;
}

@Injectable({ providedIn: 'root' })
export class BitcoinPriceService {
  private readonly apiConfig = inject(API_CONFIG);
  private readonly lastLoadedAt = signal<number | null>(null);

  readonly eurPerBitcoin = httpResource<number>(
    () => ({
      url: `${this.apiConfig.coinGeckoApiBaseUrl}/simple/price`,
      params: {
        ids: 'bitcoin',
        vs_currencies: 'eur'
      }
    }),
    {
      parse: (response: unknown) => parseBitcoinPriceResponse(response as IResponse)
    }
  );

  private readonly trackResolvedPrice = effect(() => {
    if (this.eurPerBitcoin.status() === 'resolved') {
      this.lastLoadedAt.set(Date.now());
    }
  });

  readonly cacheTtlMs = BITCOIN_PRICE_CACHE_TTL_MS;

  // this is called on each post to  get a fresh price which is sufficient for  rate limiting
  ensureFresh(): void {
    const status = this.eurPerBitcoin.status();

    // provided by httpResource
    if (status === 'idle' || status === 'loading' || status === 'reloading') {
      return;
    }

    const lastLoadedAt = this.lastLoadedAt();

    if (lastLoadedAt !== null && Date.now() - lastLoadedAt < BITCOIN_PRICE_CACHE_TTL_MS) {
      return;
    }

    this.eurPerBitcoin.reload();
  }

  forceRefresh(): void {
    const status = this.eurPerBitcoin.status();

    if (status === 'loading' || status === 'reloading') {
      return;
    }

    this.eurPerBitcoin.reload();
  }

  getRemainingCacheMs(now = Date.now()): number {
    const lastLoadedAt = this.lastLoadedAt();

    if (lastLoadedAt === null) {
      return 0;
    }

    return Math.max(0, BITCOIN_PRICE_CACHE_TTL_MS - (now - lastLoadedAt));
  }
}
