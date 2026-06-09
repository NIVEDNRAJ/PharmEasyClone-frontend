import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService, Product } from '../../core/services/product';
import { CartService } from '../../core/services/cart';

@Component({
  selector: 'app-product-search',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './product-search.html',
  styleUrls: ['./product-search.scss']
})
export class ProductSearchComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  searchQuery = '';
  selectedCategory = '';
  products: Product[] = [];
  isLoading = true;

  categoriesList: string[] = ['Medicine', 'Healthcare', 'Healthcare Devices', 'Vitamins'];

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['query'] || '';
      this.selectedCategory = params['category'] || '';
      this.fetchProducts();
    });
  }

  fetchProducts() {
    this.isLoading = true;
    this.productService.getProducts(
      this.searchQuery || undefined, 
      this.selectedCategory || undefined
    ).subscribe({
      next: (data) => {
        this.products = data;
        this.isLoading = false;
      },
      error: () => {
        this.products = [];
        this.isLoading = false;
      }
    });
  }

  onCategorySelect(category: string) {
    this.selectedCategory = this.selectedCategory === category ? '' : category;
    this.updateRoute();
  }

  onSearch() {
    this.updateRoute();
  }

  updateRoute() {
    this.router.navigate(['/search'], {
      queryParams: {
        query: this.searchQuery || null,
        category: this.selectedCategory || null
      }
    });
  }

  addToCart(product: Product, event: Event) {
    event.stopPropagation();
    this.cartService.addToCart(product);
    alert(`${product.name} added to cart!`);
  }

  viewProduct(id: string) {
    this.router.navigate(['/product', id]);
  }
}
