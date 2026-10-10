import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart-service';
import { OrderService } from '../../services/order-service';
import { CartItem } from '../../classes/cart';

@Component({
  selector: 'app-cart-page',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.css',
})
export class CartPage implements OnInit {
  checkoutForm!: FormGroup;

  items: CartItem[] = [];
  readonly TAX_RATE = 0.07; // same rate as the back-end (7%)

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private fb: FormBuilder,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.checkoutForm = this.fb.group({
      shippingAddress: ['', [Validators.required, Validators.minLength(10)]]
    });
    this.getData();
  }

  get f() {
    return this.checkoutForm.controls;
  }

  private getData(): void {
    this.cartService.getCart().subscribe({
      next: (cart) => {
        // remove items whose book was deleted
        this.items = (cart.items ?? []).filter(i => !!i.book);
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading cart:', err)
    });
  }

  unitPrice(item: CartItem): number {
    return item.book.price * (1 - (item.book.discount || 0) / 100);
  }

  lineTotal(item: CartItem): number {
    return this.unitPrice(item) * item.quantity;
  }

  get subtotal(): number {
    return this.items.reduce((sum, item) => sum + this.lineTotal(item), 0);
  }

  get tax(): number {
    return this.subtotal * this.TAX_RATE;
  }

  get total(): number {
    return this.subtotal + this.tax;
  }

  remove(item: CartItem): void {
    this.cartService.removeItem(item.book._id!).subscribe({
      next: (cart) => {
        this.items = (cart.items ?? []).filter(i => !!i.book);
        this.cdr.detectChanges();
      },
      error: (err) => alert(err.error?.message ?? 'Remove failed')
    });
  }

  onCheckout(): void {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }
    this.orderService.checkout(this.checkoutForm.value.shippingAddress).subscribe({
      next: () => {
        alert('Order created successfully');
        this.router.navigate(['/orders']);
      },
      error: (err) => alert(err.error?.message ?? 'Checkout failed')
    });
  }
}
