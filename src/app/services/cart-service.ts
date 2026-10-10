import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Cart } from '../classes/cart';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = 'http://localhost:5000/api/cart';

  private http = inject(HttpClient);

  // View my cart
  public getCart(): Observable<Cart> {
    return this.http.get<Cart>(this.apiUrl);
  }

  // Add a book to the cart
  public addItem(bookId: string, quantity: number = 1): Observable<Cart> {
    return this.http.post<Cart>(this.apiUrl + '/items', { bookId, quantity });
  }

  // Remove a book from the cart
  public removeItem(bookId: string): Observable<Cart> {
    return this.http.delete<Cart>(this.apiUrl + '/items/' + bookId);
  }
}
