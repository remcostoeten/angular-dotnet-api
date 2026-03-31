import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';
import { form, FormField, required, validate } from '@angular/forms/signals';

import type { ICreateBookPayload } from '../api/books.models';

// in large app I would extract the form to a seperate shared ui component and maybe even a createForm helper to standardize creation, validation and resetting.

// this pattern is something I would do with most components throughouth the app. Ideally there is as little tailwind/css in a view as possible

@Component({
  selector: 'app-add-book-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormField],
  template: `
    <form (submit)="onSubmit($event)" class="space-y-4 rounded-lg border border-neutral-800 bg-neutral-900 p-6">
      <h3 class="text-lg font-semibold text-white">Add a book</h3>

      <div class="space-y-1">
        <label class="block text-sm font-medium text-neutral-400" for="title">Title</label>
        <input
          id="title"
          type="text"
          [formField]="bookForm.title"
          class="w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white placeholder-neutral-500 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
          placeholder="Enter book title"
        />
        @if (bookForm.title().touched() && bookForm.title().invalid()) {
          <p class="text-xs text-red-400">{{ bookForm.title().errors()[0].message }}</p>
        }
      </div>

      <div class="space-y-1">
        <label class="block text-sm font-medium text-neutral-400" for="authorName">Author</label>
        <input
          id="authorName"
          type="text"
          [formField]="bookForm.authorName"
          class="w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white placeholder-neutral-500 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
          placeholder="Enter author name"
        />
        @if (bookForm.authorName().touched() && bookForm.authorName().invalid()) {
          <p class="text-xs text-red-400">{{ bookForm.authorName().errors()[0].message }}</p>
        }
      </div>

      <div class="space-y-1">
        <label class="block text-sm font-medium text-neutral-400" for="price">Price (BTC)</label>
        <input
          id="price"
          type="number"
          step="any"
          [formField]="bookForm.price"
          class="w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white placeholder-neutral-500 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
          placeholder="0.001"
        />
        @if (bookForm.price().touched() && bookForm.price().invalid()) {
          <p class="text-xs text-red-400">{{ bookForm.price().errors()[0].message }}</p>
        }
      </div>

      <button
        type="submit"
        [disabled]="bookForm().invalid()"
        class="rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Add book
      </button>
    </form>
  `
})
export class AddBookFormComponent {
  readonly submitBook = output<ICreateBookPayload>();

  readonly bookModel = signal<ICreateBookPayload>({
    title: '',
    authorName: '',
    price: 0
  });

  readonly bookForm = form(this.bookModel, (s) => {
    required(s.title, { message: 'Title is required' });
    required(s.authorName, { message: 'Author is required' });
    required(s.price, { message: 'Price is required' });


    // initially had prie min is 0 inline but tht allows to post zero, inline does not allow > 0, so in theory I could have done 0,0000001 but thats tricky, and if we would validate on btc price or a weird alt coin it could be such a small value. 
    validate(s.price, ({ value }) => {
      if (value() <= 0) {
        return {
          kind: 'positivePrice',
          message: 'Price must be greater than 0 BTC'
        };
      }

      return undefined;
    });
  });

  onSubmit(event: Event) {
    event.preventDefault();

    if (this.bookForm().invalid()) {
      return;
    }

    this.submitBook.emit(this.bookForm().value());
  }

  reset() {
    this.bookForm().reset({
      title: '',
      authorName: '',
      price: 0
    });
  }
}
