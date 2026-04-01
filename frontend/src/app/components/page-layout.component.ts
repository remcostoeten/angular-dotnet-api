import { Component, input } from '@angular/core';

@Component({
  selector: 'app-page-layout',
  template: `
    <section class="py-6 sm:py-10">
      <header class="mb-10 max-w-4xl space-y-3">
        @if (subheading()) {
          <p class="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
            {{ subheading() }}
          </p>
        }

        <h1 class="text-4xl font-bold tracking-tight text-white sm:text-5xl">
          {{ title() }}
        </h1>

        @if (description()) {
          <p class="max-w-3xl text-lg leading-relaxed text-neutral-400">
            {{ description() }}
          </p>
        }
      </header>

      <div class="space-y-6">
        <ng-content></ng-content>
      </div>
    </section>
  `,
})
export class PageLayoutComponent {
  readonly title = input.required<string>();
  readonly subheading = input<string>();
  readonly description = input<string>();
}
