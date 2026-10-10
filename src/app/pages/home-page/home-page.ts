import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookService } from '../../services/book-service';
import { Book } from '../../classes/book';

@Component({
  selector: 'app-home-page',
  imports: [CommonModule, RouterLink],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage implements OnInit {
  latestBooks: Book[] = [];

  constructor(private bookService: BookService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    // the API returns newest books first -> show 4 of them
    this.bookService.getAll().subscribe({
      next: (data) => {
        this.latestBooks = data.slice(0, 4);
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading books:', err)
    });
  }

  finalPrice(book: Book): number {
    return book.price * (1 - (book.discount || 0) / 100);
  }
}
