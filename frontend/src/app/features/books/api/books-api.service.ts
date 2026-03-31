import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

import { API_CONFIG } from '../../../core/config/api.config';
import type { IBookDto, ICreateBookPayload } from './books.models';

@Injectable({ providedIn: 'root' })
export class BooksApiService {
  private readonly http = inject(HttpClient);
  private readonly apiConfig = inject(API_CONFIG);
  readonly selectedBookId = signal<string | null>(null);

  // Use httpResource for reactive GET state in the UI. Keep mutations on HttpClient.

  //httpResource is experiemental, used for queries and httpClient for mutations

  // httpresource pairs with signals for reactive ui thus automatically updating ui on data change and also provides out of the box err and loading states
  // https://angular.dev/guide/http/http-resource

  readonly books = httpResource<readonly IBookDto[]>(() => ({
    url: `${this.apiConfig.assessmentApiBaseUrl}/Books`
  }));
  readonly selectedBook = httpResource<IBookDto>(() => {
    const id = this.selectedBookId();

    if (id === null) {
      return undefined;
    }

    return {
      url: `${this.apiConfig.assessmentApiBaseUrl}/Books/${id}`
    };
  });

  addBook(payload: ICreateBookPayload) {
    return this.http.post<void>(`${this.apiConfig.assessmentApiBaseUrl}/Books`, payload);
  }

  selectBook(id: string) {
    this.selectedBookId.set(id);
  }
}
