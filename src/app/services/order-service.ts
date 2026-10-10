import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Order } from '../classes/order';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = 'http://localhost:5000/api/orders';

  private http = inject(HttpClient);

  // Checkout: turn the cart into an order
  public checkout(shippingAddress: string): Observable<any> {
    return this.http.post(this.apiUrl, { shippingAddress });
  }

  // Customer: my orders
  public getMyOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl + '/my-orders');
  }

  // Staff (owner / inventory manager): all orders
  public getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }
}
