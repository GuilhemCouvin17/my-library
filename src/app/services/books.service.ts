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
    if (book.photo) {
      const storageRef = firebase.storage().refFromURL(book.photo);
      storageRef
        .delete()
        .then(() => {
          console.log('Image deleted !');
        })
        .catch((error) => {
          console.log('File missing: ' + error);
        });
    }
    const bookIndexToRemove = this.books.findIndex((bookItem) => {
      if (bookItem === book) {
        return true;
      }
    });
    this.books.splice(bookIndexToRemove);
    this.saveBooks();
    this.emitBooks();
  }

  upload(file: File) {
    return new Promise((resolve, reject) => {
      const almostUniqueFileName = Date.now().toString();
      const upload = firebase
        .storage()
        .ref()
        .child('image/' + almostUniqueFileName + file.name)
        .put(file);
      upload.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        () => {
          console.log('Loading ...');
        },
        (error) => {
          console.log('Loading failed: ' + error);
        },
        () => {
          resolve(upload.snapshot.ref.getDownloadURL());
        }
      );
    });
  }
}
