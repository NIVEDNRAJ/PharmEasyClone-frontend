import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductService } from '../../core/services/product';
import { CartService, CartItem } from '../../core/services/cart';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.scss']
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  productId: string | null = null;
  product: any = null;
  isLoading = true;

  // Reactively track if the product is in cart and its quantity
  cartItem: CartItem | null = null;
  private cartSub: Subscription | null = null;

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.productId = params['id'];
      if (this.productId) {
        this.fetchProductDetails();
      }
    });

    // Subscribe to cart changes to reactively update quantity counter
    this.cartSub = this.cartService.cartItems$.subscribe(items => {
      if (this.productId) {
        const match = items.find(item => item.productId.toLowerCase() === this.productId?.toLowerCase());
        this.cartItem = match || null;
      }
    });
  }

  ngOnDestroy() {
    if (this.cartSub) {
      this.cartSub.unsubscribe();
    }
  }

  fetchProductDetails() {
    this.isLoading = true;
    this.productService.getProductById(this.productId!).subscribe({
      next: (data) => {
        this.product = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  addToCart() {
    if (!this.product) return;
    this.cartService.addToCart(this.product);
    alert(`${this.product.name} added to cart!`);
  }

  incrementQuantity() {
    if (this.cartItem) {
      this.cartService.updateQuantity(this.cartItem.productId, this.cartItem.quantity + 1);
    }
  }

  decrementQuantity() {
    if (this.cartItem) {
      this.cartService.updateQuantity(this.cartItem.productId, this.cartItem.quantity - 1);
    }
  }
}
