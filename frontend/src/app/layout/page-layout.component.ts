import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-page-layout',
  standalone: true,
  template: `
    <section class="py-6 sm:py-10">
      <header class="mb-12">
        @if (subheading) {
          <p class="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
            {{ subheading }}
          </p>
        }
        <h1 class="text-4xl font-bold tracking-tight text-white sm:text-5xl">
          {{ title }}
        </h1>
        @if (description) {
          <p class="mt-4 max-w-3xl text-lg leading-relaxed text-neutral-400">
            {{ description }}
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
  @Input({ required: true }) title!: string;
  @Input() subheading?: string;
  @Input() description?: string;
}
