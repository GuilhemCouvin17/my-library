import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BooksService } from 'src/app/services/books.service';
import { Book } from 'src/app/models/Book.model';

@Component({
  selector: 'app-book-form',
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.scss'],
})
export class BookFormComponent implements OnInit {
  bookForm: FormGroup;
  fileIsUploading = false;
  fileURL: string;
  fileUploaded = false;

  constructor(
    private formBuilder: FormBuilder,
    private booksService: BooksService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.bookForm = this.formBuilder.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
    });
  }

  onSaveBook() {
    const title = this.bookForm.get('title').value;
    const author = this.bookForm.get('author').value;
    const newBook = new Book(title, author);
    if (this.fileURL && this.fileURL !== '') {
      newBook.photo = this.fileURL;
    }
    this.booksService.createBook(newBook);
    this.router.navigate(['/books']);
  }

  onUploadFile(file: File) {
    this.fileIsUploading = true;
    this.booksService.upload(file).then((url: string) => {
      this.fileURL = url;
      this.fileIsUploading = false;
      this.fileUploaded = true;
    });
  }

  detectFiles(event) {
    this.onUploadFile(event.target.files[0]);
  }
}
