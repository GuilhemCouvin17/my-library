import { Injectable } from '@angular/core';
import { Book } from '../models/Book.model';
import { Subject } from 'rxjs';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  books: Book[] = [];
  bookSubject = new Subject<Book[]>();

  constructor() {}

  emitBooks() {
    this.bookSubject.next(this.books);
  }

  getBooks() {
    firebase
      .database()
      .ref('/books')
      .on('value', (data) => {
        this.books = data.val() ? data.val() : [];
        this.emitBooks();
      });
  }

  getSingleBooks(id: number) {
    return new Promise((resolve, reject) => {
      firebase
        .database()
        .ref('/books/' + id)
        .once('value')
        .then(
          (data) => {
            resolve(data.val());
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  saveBooks() {
    firebase.database().ref('/books').set(this.books);
  }

  createBook(newBook: Book) {
    this.books.push(newBook);
    this.saveBooks();
    this.emitBooks();
  }

  removeBook(book: Book) {
    const bookIndexToRemove = this.books.findIndex((bookItem) => {
      if (bookItem === book) {
        return true;
      }
    });
    this.books.splice(bookIndexToRemove);
    this.saveBooks();
    this.emitBooks();
  }
}
