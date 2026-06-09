import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { VendorPortalService } from '../../../core/services/vendor-portal';
import { ProductService } from '../../../core/services/product';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-vendor-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './vendor-dashboard.html',
  styleUrls: ['./vendor-dashboard.scss']
})
export class VendorDashboardComponent implements OnInit {
  private vendorService = inject(VendorPortalService);
  private productService = inject(ProductService);
  authService = inject(AuthService);

  activeTab: 'overview' | 'products' | 'orders' | 'profile' = 'overview';
  isLoading = true;
  stats: any = {};
  products: any[] = [];
  orders: any[] = [];
  profile = { businessName: '', licenseNumber: '' };

  newProduct = {
    name: '', description: '', category: 'Medicine', imageUrl: '',
    requiresPrescription: false, price: 0, discountPercentage: 10, stockCount: 100
  };

  message = '';
  error = '';

  ngOnInit() {
    this.loadOverview();
  }

  setTab(tab: typeof this.activeTab) {
    this.activeTab = tab;
    this.message = '';
    this.error = '';
    this.isLoading = true;
    switch (tab) {
      case 'overview': this.loadOverview(); break;
      case 'products': this.loadProducts(); break;
      case 'orders': this.loadOrders(); break;
      case 'profile': this.loadProfile(); break;
    }
  }

  loadOverview() {
    this.vendorService.getDashboard().subscribe({
      next: (data) => { this.stats = data; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }

  loadProducts() {
    this.productService.getVendorProducts().subscribe({
      next: (data) => { this.products = data; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }

  loadOrders() {
    this.vendorService.getOrders().subscribe({
      next: (data) => { this.orders = data; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }

  loadProfile() {
    this.vendorService.getProfile().subscribe({
      next: (data) => {
        this.profile = { businessName: data.businessName, licenseNumber: data.licenseNumber };
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  uploadProduct() {
    if (!this.newProduct.name || !this.newProduct.price) {
      this.error = 'Name and price are required.';
      return;
    }
    this.productService.uploadProductByVendor(this.newProduct).subscribe({
      next: () => {
        this.message = 'Product uploaded. Pending admin approval.';
        this.newProduct = { name: '', description: '', category: 'Medicine', imageUrl: '', requiresPrescription: false, price: 0, discountPercentage: 10, stockCount: 100 };
        this.loadProducts();
      },
      error: (e) => { this.error = e.error?.message || 'Upload failed.'; }
    });
  }

  updateInventory(productId: string, price: number, discount: number, stock: number) {
    this.vendorService.updateInventory(productId, { price, discountPercentage: discount, stockCount: stock }).subscribe({
      next: () => { this.message = 'Inventory updated.'; },
      error: (e) => { this.error = e.error?.message || 'Update failed.'; }
    });
  }

  saveProfile() {
    this.vendorService.updateProfile(this.profile).subscribe({
      next: () => { this.message = 'Profile saved.'; },
      error: (e) => { this.error = e.error?.message || 'Save failed.'; }
    });
  }
}
