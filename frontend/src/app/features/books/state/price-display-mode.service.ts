import { Injectable, signal } from '@angular/core';

export type PriceDisplayMode = 'btc' | 'eur';

@Injectable({ providedIn: 'root' })
export class PriceDisplayModeService {
  readonly mode = signal<PriceDisplayMode>('btc');

  setMode(mode: PriceDisplayMode): void {
    this.mode.set(mode);
  }
}
