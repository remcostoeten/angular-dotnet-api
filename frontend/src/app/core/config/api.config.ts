import { InjectionToken } from '@angular/core';

export interface IApiConfig{
  readonly assessmentApiBaseUrl: string;
  readonly coinGeckoApiBaseUrl: string;
}

// needs to exist at runtime so provide a name
export const API_CONFIG = new InjectionToken<Readonly<IApiConfig>>('api.config');

// values could be loaded from a constants.ts if app grows
export const apiConfig: Readonly<IApiConfig> = {
  assessmentApiBaseUrl: 'https://localhost:7044',
  coinGeckoApiBaseUrl: 'https://api.coingecko.com/api/v3'
};
