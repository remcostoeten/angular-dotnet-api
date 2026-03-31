import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home-page.component').then((m) => m.HomeComponent)
  },
  {
    path: 'books',
    loadComponent: () =>
      import('./pages/books-page.component').then((m) => m.BooksPageComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
