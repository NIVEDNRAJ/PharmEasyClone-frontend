import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService, Product } from '../../core/services/product';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html'
})
export class HomeComponent implements OnInit {
  private productService = inject(ProductService);
  
  trendingProducts: Product[] = [];
  isLoading = true;

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
}