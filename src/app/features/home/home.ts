import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService, Product } from '../../core/services/product';
import { CartService } from '../../core/services/cart';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private router = inject(Router);

  trendingProducts: Product[] = [];
  isLoading = true;
  searchQuery = '';

  // E-Commerce Categories grid data
  categories = [
    { name: 'Medicine', desc: 'Flat 25% Off', icon: '💊', link: '/search', query: { category: 'Medicine' } },
    { name: 'Doctor Consult', desc: '24/7 Access', icon: '🧑‍⚕️', link: '/doctor-consult' },
    { name: 'Lab Tests', desc: 'Up to 70% Off', icon: '🔬', link: '/lab-tests' },
    { name: 'Upload Rx', desc: 'Order with Rx', icon: '📋', link: '/prescription' },
    { name: 'Healthcare Products', desc: 'Up to 50% Off', icon: '🧴', link: '/search', query: { category: 'Healthcare' } }
  ];

  ngOnInit() {
    this.productService.getTrendingProducts().subscribe({
      next: (products) => {
        this.trendingProducts = products;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load trending products:', err);
        this.isLoading = false;
      }
    });
  }

  search() {
    if (!this.searchQuery.trim()) return;
    this.router.navigate(['/search'], { queryParams: { query: this.searchQuery.trim() } });
  }

  addToCart(product: Product, event: Event) {
    event.stopPropagation(); // Avoid navigating to product detail
    this.cartService.addToCart(product);
    alert(`${product.name} added to cart!`);
  }

  viewProduct(id: string) {
    this.router.navigate(['/product', id]);
  }
}