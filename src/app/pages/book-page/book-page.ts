import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
import { BookService } from '../../services/book-service';
import { CategoryService } from '../../services/category-service';
import { CartService } from '../../services/cart-service';
import { AuthService } from '../../services/auth-service';
import { Book } from '../../classes/book';
import { Category } from '../../classes/category';

@Component({
  selector: 'app-book-page',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './book-page.html',
  styleUrl: './book-page.css',
})
export class BookPage implements OnInit {
  bookForm!: FormGroup;

  books: Book[] = [];
  categories: Category[] = [];
  book: Book | undefined;
  isEdit: boolean = false;

  // search + filter
  searchText: string = '';
  filterGenre: string = '';
  private search$ = new Subject<string>();

  constructor(
    private bookService: BookService,
    private categoryService: CategoryService,
    private cartService: CartService,
    public authService: AuthService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.getCategories();
    this.getData();

    // RxJS: wait 300 ms after the user stops typing, then ask the API
    this.search$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(text => this.bookService.getAll(text, this.filterGenre))
    ).subscribe({
      next: (data) => {
        this.books = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Search error:', err)
    });
  }

  private initForm(): void {
    this.bookForm = this.fb.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      isbn: ['', [Validators.required, Validators.pattern(/^[0-9-]{10,17}$/)]],
      genre: ['General', Validators.required],
      bookType: ['physical', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0), Validators.pattern(/^[0-9]+$/)]],
      discount: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      image: ['', Validators.pattern(/^(https?:\/\/.+)?$/)],
      description: ['']
    });
  }

  get f() {
    return this.bookForm.controls;
  }

  private getCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (data) => {
        this.categories = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading categories:', err)
    });
  }

  getData(): void {
    this.bookService.getAll(this.searchText, this.filterGenre).subscribe({
      next: (data) => {
        this.books = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading books:', err);
      }
    });
  }

  // search box
  onSearch(text: string): void {
    this.searchText = text;
    this.search$.next(text);
  }

  // genre dropdown
  onFilterChange(): void {
    this.getData();
  }

  finalPrice(book: Book): number {
    return book.price * (1 - (book.discount || 0) / 100);
  }

  onSubmit(): void {
    const bookData: Book = this.bookForm.value;
    if (this.isEdit) { // update
      this.bookService.update(this.book!._id!, bookData).subscribe({
        next: () => {
          alert('Update completed');
          this.resetForm();
        },
        error: (err) => alert(this.errorText(err))
      });
    } else { // add
      this.bookService.create(bookData).subscribe({
        next: () => {
          alert('New book created');
          this.resetForm();
        },
        error: (err) => alert(this.errorText(err))
      });
    }
  }

  selectBook(selectedBook: Book): void {
    this.isEdit = true; // change to edit mode
    this.book = selectedBook;
    this.bookForm.patchValue({
      title: selectedBook.title,
      author: selectedBook.author,
      isbn: selectedBook.isbn,
      genre: selectedBook.genre,
      bookType: selectedBook.bookType,
      price: selectedBook.price,
      stock: selectedBook.stock,
      discount: selectedBook.discount,
      image: selectedBook.image,
      description: selectedBook.description
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  resetForm(): void {
    this.isEdit = false;
    this.book = undefined;
    this.bookForm.reset({ genre: 'General', bookType: 'physical', price: 0, stock: 0, discount: 0, image: '', description: '' });
    this.getData();
  }

  deleteBook(deletedBook: Book): void {
    if (confirm('Are you sure to delete "' + deletedBook.title + '"?')) {
      this.bookService.delete(deletedBook._id!).subscribe({
        next: () => {
          alert('DELETE OK.');
          this.resetForm();
        },
        error: (err) => alert(this.errorText(err))
      });
    }
  }

  // customer: add one copy to the cart
  addToCart(selectedBook: Book): void {
    this.cartService.addItem(selectedBook._id!, 1).subscribe({
      next: () => alert('"' + selectedBook.title + '" added to cart'),
      error: (err) => alert(this.errorText(err))
    });
  }

  private errorText(err: any): string {
    return err.error?.message ?? 'Cannot reach the server. Is the back-end running?';
  }

}
