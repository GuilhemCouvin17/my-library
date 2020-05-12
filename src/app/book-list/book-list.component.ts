import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Book } from '../models/Book.model';
import { BooksService } from '../services/books.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss'],
})
export class BookListComponent implements OnInit, OnDestroy {
  books: Book[];
  booksSubscription: Subscription;

  constructor(private booksService: BooksService, private router: Router) {}

  ngOnDestroy(): void {
    this.booksSubscription.unsubscribe();
  }

  ngOnInit() {
    this.booksSubscription = this.booksService.bookSubject.subscribe(
      (books: Book[]) => {
        this.books = books;
      }
    );
    this.booksService.getBooks();
    this.booksService.emitBooks();
  }

  onNewBook() {
    this.router.navigate(['/books', 'new']);
  }

  onDeleteBook(book: Book) {
    this.booksService.removeBook(book);
  }

  onViewbook(id: number) {
    this.router.navigate(['/books', 'view', id]);
  }
}
