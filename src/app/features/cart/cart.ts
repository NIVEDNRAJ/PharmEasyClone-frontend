import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CartService, CartItem } from '../../core/services/cart';
import { OrderService } from '../../core/services/order';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.scss']
})
export class CartComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private cartService = inject(CartService);
  private orderService = inject(OrderService);
  authService = inject(AuthService);

  cartItems: CartItem[] = [];
  private cartSub: Subscription | null = null;

  // Billing
  mrp = 0;
  discount = 0;
  deliveryFee = 49;
  totalAmount = 0;

  // Shipping Form
  checkoutForm: FormGroup = this.fb.group({
    patientName: ['', [Validators.required, Validators.minLength(2)]],
    deliveryAddress: ['', [Validators.required, Validators.minLength(10)]],
    pincode: ['', [Validators.required, Validators.pattern('^[1-9][0-9]{5}$')]] // Indian Pincodes (6 digits)
  });

  // State
  isSubmitting = false;
  showSimulatedPayment = false;
  mockOrderId = '';
  mockOrderGuidId = '';

  ngOnInit() {
    this.cartSub = this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.recalculateBill();
    });
  }

  ngOnDestroy() {
    if (this.cartSub) {
      this.cartSub.unsubscribe();
    }
  }

  incrementQuantity(item: CartItem) {
    this.cartService.updateQuantity(item.productId, item.quantity + 1);
  }

  decrementQuantity(item: CartItem) {
    this.cartService.updateQuantity(item.productId, item.quantity - 1);
  }

  removeItem(productId: string) {
    this.cartService.removeFromCart(productId);
  }

  recalculateBill() {
    this.mrp = this.cartService.getTotalMrp();
    this.discount = this.cartService.getTotalDiscount();
    const subtotal = this.cartService.getTotalAmount();
    
    // Free delivery above ₹500
    this.deliveryFee = subtotal > 500 || subtotal === 0 ? 0 : 49;
    this.totalAmount = subtotal + this.deliveryFee;
  }

  onSubmit() {
    if (this.cartItems.length === 0) return;

    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    // Check login
    const token = localStorage.getItem('pharm_token');
    if (!token) {
      alert('Please log in to proceed with your order.');
      this.authService.openDrawer();
      return;
    }

    this.isSubmitting = true;
    const formVal = this.checkoutForm.value;
    const orderItems = this.cartItems.map(item => ({
      productId: item.productId,
      quantity: item.quantity
    }));

    const orderDto = {
      patientName: formVal.patientName,
      deliveryAddress: formVal.deliveryAddress,
      pincode: formVal.pincode,
      items: orderItems
    };

    this.orderService.placeOrder(orderDto).subscribe({
      next: (res) => {
        this.mockOrderId = res.razorpayOrderId;
        this.mockOrderGuidId = res.orderId;

        this.isSubmitting = false;
        this.showSimulatedPayment = true;
      },
      error: (err) => {
        alert(err?.error?.message || 'Failed to place order. Please try again.');
        this.isSubmitting = false;
      }
    });
  }

  confirmSimulatedSuccess() {
    this.showSimulatedPayment = false;
    this.isSubmitting = true;

    const confirmDto = {
      orderId: this.mockOrderGuidId,
      razorpayOrderId: this.mockOrderId,
      razorpayPaymentId: 'pay_mock_' + Math.random().toString(36).substring(2, 9),
      razorpaySignature: 'sig_mock_verified'
    };

    this.orderService.confirmOrder(confirmDto).subscribe({
      next: () => {
        this.cartService.clearCart();
        this.isSubmitting = false;
        alert('Order placed successfully!');
        this.router.navigate(['/doctor-consult/history']); // Redirect to consultation or orders history page. Let's navigate to order history page!
      },
      error: (err) => {
        alert(err?.error?.message || 'Order payment confirmation failed.');
        this.isSubmitting = false;
      }
    });
  }

  cancelSimulatedPayment() {
    this.showSimulatedPayment = false;
  }
}
