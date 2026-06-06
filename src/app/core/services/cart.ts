import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from './product';

export interface CartItem {
  productId: string;
  name: string;
  imageUrl: string;
  price: number;
  quantity: number;
  discountPercentage: number;
  requiresPrescription: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  constructor() {
    this.loadCart();
  }

  private loadCart() {
    const data = localStorage.getItem('pharm_cart');
    if (data) {
      try {
        this.cartItemsSubject.next(JSON.parse(data));
      } catch {
        this.cartItemsSubject.next([]);
      }
    }
  }

  private saveCart(items: CartItem[]) {
    localStorage.setItem('pharm_cart', JSON.stringify(items));
    this.cartItemsSubject.next(items);
  }

  getCartItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  addToCart(product: any, quantity: number = 1) {
    const items = [...this.getCartItems()];
    const existing = items.find(item => item.productId === product.id);

    if (existing) {
      existing.quantity += quantity;
    } else {
      items.push({
        productId: product.id,
        name: product.name,
        imageUrl: product.imageUrl,
        price: product.bestPrice || product.price,
        discountPercentage: product.maxDiscount || product.discountPercentage || 0,
        quantity: quantity,
        requiresPrescription: product.requiresPrescription
      });
    }

    this.saveCart(items);
  }

  removeFromCart(productId: string) {
    const items = this.getCartItems().filter(item => item.productId !== productId);
    this.saveCart(items);
  }

  updateQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const items = [...this.getCartItems()];
    const match = items.find(item => item.productId === productId);
    if (match) {
      match.quantity = quantity;
      this.saveCart(items);
    }
  }

  clearCart() {
    this.saveCart([]);
  }

  getCartCount(): number {
    return this.getCartItems().reduce((sum, item) => sum + item.quantity, 0);
  }

  getTotalMrp(): number {
    return this.getCartItems().reduce((sum, item) => {
      const mrp = item.price / (1 - (item.discountPercentage / 100));
      return sum + (mrp * item.quantity);
    }, 0);
  }

  getTotalDiscount(): number {
    return this.getCartItems().reduce((sum, item) => {
      const mrp = item.price / (1 - (item.discountPercentage / 100));
      return sum + ((mrp - item.price) * item.quantity);
    }, 0);
  }

  getTotalAmount(): number {
    return this.getCartItems().reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }
}
