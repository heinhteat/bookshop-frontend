import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order-service';
import { AuthService } from '../../services/auth-service';
import { Order } from '../../classes/order';

@Component({
  selector: 'app-order-page',
  imports: [CommonModule],
  templateUrl: './order-page.html',
  styleUrl: './order-page.css',
})
export class OrderPage implements OnInit {
  orders: Order[] = [];

  constructor(
    private orderService: OrderService,
    public authService: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    // staff see every order, customers see only their own
    const request$ = this.authService.isStaff()
      ? this.orderService.getAllOrders()
      : this.orderService.getMyOrders();

    request$.subscribe({
      next: (data) => {
        this.orders = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading orders:', err)
    });
  }

  customerName(order: Order): string {
    return typeof order.user === 'object' && order.user ? order.user.name + ' (' + order.user.email + ')' : '';
  }

  statusClass(status: string): string {
    switch (status) {
      case 'delivered': return 'bg-success';
      case 'cancelled': return 'bg-danger';
      case 'shipped': return 'bg-info';
      default: return 'bg-secondary';
    }
  }
}
