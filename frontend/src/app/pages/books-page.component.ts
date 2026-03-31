import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PageLayoutComponent } from '../layout/page-layout.component';

@Component({
  selector: 'app-books-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, PageLayoutComponent],
  template: `
    <app-page-layout
      title="Books"
      subheading="Catalog"
    >
      <p>This is the books page. Go back <a routerLink="/">home</a>.</p>
    </app-page-layout>
  `
})
export class BooksPageComponent {}
