import { InjectionToken } from '@angular/core';

export interface IApiConfig {
  readonly assessmentApiBaseUrl: string;
  readonly coinGeckoApiBaseUrl: string;
}

// needs to exist at runtime so provide a name for di
export const API_CONFIG = new InjectionToken<Readonly<IApiConfig>>('api.config');

// In production, prefer environment-specific configuration or startup-injected config and a constants/environment.ts
export const apiConfig: Readonly<IApiConfig> = {
  assessmentApiBaseUrl: 'https://localhost:/7044',
  coinGeckoApiBaseUrl: 'https://api.coingecko.com/api/v3'
};