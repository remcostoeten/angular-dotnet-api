import { httpResource } from '@angular/common/http';
import { effect, inject, Injectable } from '@angular/core';

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
  private lastLoadedAt: number | null = null;

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
      this.lastLoadedAt = Date.now();
    }
  });

  // this is called on each post to  get a fresh price which is sufficient for  rate limiting
  ensureFresh(): void {
    const status = this.eurPerBitcoin.status();

    // provided by httpResource
    if (status === 'idle' || status === 'loading' || status === 'reloading') {
      return;
    }

    if (this.lastLoadedAt !== null && Date.now() - this.lastLoadedAt < BITCOIN_PRICE_CACHE_TTL_MS) {
      return;
    }

    this.eurPerBitcoin.reload();
  }
}
