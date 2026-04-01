import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PageLayoutComponent } from '../components/page-layout.component';

interface IReviewPullRequest {
  readonly number: number;
  readonly title: string;
  readonly url: string;
  readonly mergedAt: string;
  readonly commitTitles: readonly string[];
  readonly files: readonly string[];
}

const REVIEW_PULL_REQUESTS: readonly IReviewPullRequest[] = [
  {
    number: 6,
    title: 'fix: handle books page selection and detail errors',
    url: 'https://github.com/remcostoeten/angular-dotnet-api/pull/6',
    mergedAt: '2026-03-31T23:37:56Z',
    commitTitles: [
      'feat: create ui, toggle currency, display prices and filter/search',
      'fix: handle books page selection and detail errors'
    ],
    files: [
      'frontend/src/app/features/books/components/add-book-form.component.ts',
      'frontend/src/app/features/books/components/book-price-label.component.ts',
      'frontend/src/app/features/books/components/price-display-toggle.component.ts',
      'frontend/src/app/layout/page-layout.component.ts',
      'frontend/src/app/pages/books-page.component.ts'
    ]
  },
  {
    number: 5,
    title: 'featl display {id} usage in service and currency switcher',
    url: 'https://github.com/remcostoeten/angular-dotnet-api/pull/5',
    mergedAt: '2026-03-31T23:11:16Z',
    commitTitles: [
      'featl display {id} usage in service and currency switcher'
    ],
    files: [
      'frontend/src/app/features/books/api/bitcoin-price.service.ts',
      'frontend/src/app/features/books/api/books-api.service.ts',
      'frontend/src/app/features/books/state/price-display-mode.service.ts'
    ]
  },
  {
    number: 4,
    title: 'feat: add services models and other logic',
    url: 'https://github.com/remcostoeten/angular-dotnet-api/pull/4',
    mergedAt: '2026-03-31T22:41:20Z',
    commitTitles: [
      'fix scripts and url',
      'feat: create books service, model and form to post',
      'btc service'
    ],
    files: [
      'frontend/src/app/core/config/api.config.ts',
      'frontend/src/app/features/books/api/bitcoin-price.service.ts',
      'frontend/src/app/features/books/api/books-api.service.ts',
      'frontend/src/app/features/books/api/books.models.ts',
      'frontend/src/app/features/books/components/add-book-form.component.ts',
      'run-api-and-app.sh',
      'seed-books.sh'
    ]
  },
  {
    number: 3,
    title: 'Setup api config',
    url: 'https://github.com/remcostoeten/angular-dotnet-api/pull/3',
    mergedAt: '2026-03-31T17:44:33Z',
    commitTitles: [
      'feat: add API configuration and HTTP client setup',
      'feat: update API configuration tests and fix assessmentApiBaseUrl'
    ],
    files: [
      'frontend/src/app/app.config.ts',
      'frontend/src/app/app.spec.ts',
      'frontend/src/app/core/config/api.config.ts'
    ]
  },
  {
    number: 2,
    title: 'feat: add routing and layout components for home and books pages',
    url: 'https://github.com/remcostoeten/angular-dotnet-api/pull/2',
    mergedAt: '2026-03-31T16:41:35Z',
    commitTitles: [
      'feat: add routing and layout components for home and books pages'
    ],
    files: [
      'frontend/package-lock.json',
      'frontend/src/app/app.html',
      'frontend/src/app/app.routes.ts',
      'frontend/src/app/app.ts',
      'frontend/src/app/components/header.component.ts',
      'frontend/src/app/layout/page-layout.component.ts',
      'frontend/src/app/pages/books-page.component.ts',
      'frontend/src/app/pages/home-page.component.ts',
      'frontend/src/index.html',
      'frontend/src/styles.css'
    ]
  },
  {
    number: 1,
    title: 'chore: generate angular app via ng-cli',
    url: 'https://github.com/remcostoeten/angular-dotnet-api/pull/1',
    mergedAt: '2026-03-30T21:17:17Z',
    commitTitles: [
      'chore: generate angular app via ng-cli'
    ],
    files: [
      'frontend/.editorconfig',
      'frontend/.gemini/GEMINI.md',
      'frontend/.github/copilot-instructions.md',
      'frontend/.gitignore',
      'frontend/.postcssrc.json',
      'frontend/.prettierrc',
      'frontend/.vscode/extensions.json',
      'frontend/.vscode/launch.json',
      'frontend/.vscode/mcp.json',
      'frontend/.vscode/tasks.json',
      'frontend/AGENTS.md',
      'frontend/README.md',
      'frontend/angular.json',
      'frontend/bun.lock',
      'frontend/package-lock.json',
      'frontend/package.json',
      'frontend/public/favicon.ico',
      'frontend/src/app/app.config.ts',
      'frontend/src/app/app.css',
      'frontend/src/app/app.html',
      'frontend/src/app/app.routes.ts',
      'frontend/src/app/app.spec.ts',
      'frontend/src/app/app.ts',
      'frontend/src/index.html',
      'frontend/src/main.ts',
      'frontend/src/styles.css',
      'frontend/tsconfig.app.json',
      'frontend/tsconfig.json',
      'frontend/tsconfig.spec.json'
    ]
  }
];

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, RouterLink, PageLayoutComponent],
  template: `
    <app-page-layout
      title="Review Index"
      subheading="Angular + .NET"
      description="Merged pull requests, commit messages, and changed files collected in one place so the assessment can be reviewed incrementally."
    >
      <div class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <section class="space-y-4">
          @for (pullRequest of pullRequests; track pullRequest.number) {
            <article class="rounded-md border border-neutral-800 bg-neutral-900 p-6">
              <div class="flex flex-col gap-4 border-b border-neutral-800 pb-4 md:flex-row md:items-start md:justify-between">
                <div class="space-y-2">
                  <p class="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
                    PR #{{ pullRequest.number }} · merged {{ pullRequest.mergedAt | date: 'mediumDate' }}
                  </p>
                  <h2 class="text-xl font-semibold text-white">{{ pullRequest.title }}</h2>
                </div>

                <a
                  [href]="pullRequest.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center justify-center rounded-md border border-neutral-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:border-neutral-500 hover:bg-neutral-800"
                >
                  Open PR
                </a>
              </div>

              <div class="mt-4 grid gap-4 lg:grid-cols-2">
                <details class="rounded-md border border-neutral-800 bg-neutral-950 px-4 py-3" open>
                  <summary class="cursor-pointer text-sm font-medium text-white">
                    Commits ({{ pullRequest.commitTitles.length }})
                  </summary>

                  <ul class="mt-3 space-y-2">
                    @for (commitTitle of pullRequest.commitTitles; track commitTitle) {
                      <li class="rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-neutral-300">
                        {{ commitTitle }}
                      </li>
                    }
                  </ul>
                </details>

                <details class="rounded-md border border-neutral-800 bg-neutral-950 px-4 py-3" open>
                  <summary class="cursor-pointer text-sm font-medium text-white">
                    Files ({{ pullRequest.files.length }})
                  </summary>

                  <ul class="mt-3 space-y-2">
                    @for (file of pullRequest.files; track file) {
                      <li class="rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 font-mono text-xs text-neutral-400">
                        {{ file }}
                      </li>
                    }
                  </ul>
                </details>
              </div>
            </article>
          }
        </section>

        <aside class="space-y-4 xl:sticky xl:top-28">
          <div class="rounded-md border border-neutral-800 bg-neutral-900 p-6">
            <p class="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">Reviewer notes</p>
            <h2 class="mt-3 text-xl font-semibold text-white">Incremental walkthrough</h2>
            <p class="mt-3 text-sm leading-6 text-neutral-400">
              Review the merged PRs below. Open the feature directly if you want to skip to the final result.
            </p>
            <a
              routerLink="/books"
              class="mt-4 inline-flex items-center justify-center rounded-md bg-white px-4 py-3 text-sm font-medium text-black transition-colors hover:bg-neutral-200"
            >
              Open feature
            </a>
          </div>
        </aside>
      </div>
    </app-page-layout>
  `
})
export class HomeComponent {
  protected readonly pullRequests = REVIEW_PULL_REQUESTS;
}
