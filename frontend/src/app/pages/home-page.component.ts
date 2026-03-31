import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PageLayoutComponent } from '../layout/page-layout.component';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, PageLayoutComponent],
  template: `
    <app-page-layout
      title="Homepage"
      subheading="Angular + .NET"
      description="Front-end assessment."
    >
      <p>index route.<a routerLink="/books">books page</a>.</p>
    </app-page-layout>
  `
})
export class HomeComponent {}
