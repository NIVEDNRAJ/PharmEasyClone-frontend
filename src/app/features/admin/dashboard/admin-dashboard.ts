import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../../core/services/admin';
import { ProductService } from '../../../core/services/product';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.scss']
})
export class AdminDashboardComponent implements OnInit {
  private adminService = inject(AdminService);
  private productService = inject(ProductService);
  authService = inject(AuthService);

  activeTab: 'overview' | 'products' | 'vendors' | 'doctors' | 'orders' | 'prescriptions' | 'users' = 'overview';
  isLoading = true;

  stats: any = {};
  pendingProducts: any[] = [];
  pendingVendors: any[] = [];
  pendingDoctors: any[] = [];
  orders: any[] = [];
  prescriptions: any[] = [];
  users: any[] = [];

  newCoupon = { code: '', discountAmount: 100, isActive: true };
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
      case 'products': this.loadPendingProducts(); break;
      case 'vendors': this.loadPendingVendors(); break;
      case 'doctors': this.loadPendingDoctors(); break;
      case 'orders': this.loadOrders(); break;
      case 'prescriptions': this.loadPrescriptions(); break;
      case 'users': this.loadUsers(); break;
    }
  }

  loadOverview() {
    this.adminService.getDashboard().subscribe({
      next: (data) => { this.stats = data; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }

  loadPendingProducts() {
    this.productService.getPendingProducts().subscribe({
      next: (data) => { this.pendingProducts = data; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }

  loadPendingVendors() {
    this.adminService.getPendingVendors().subscribe({
      next: (data) => { this.pendingVendors = data; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }

  loadPendingDoctors() {
    this.adminService.getPendingDoctors().subscribe({
      next: (data) => { this.pendingDoctors = data; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }

  loadOrders() {
    this.adminService.getOrders().subscribe({
      next: (data) => { this.orders = data; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }

  loadPrescriptions() {
    this.adminService.getPrescriptions().subscribe({
      next: (data) => { this.prescriptions = data; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }

  loadUsers() {
    this.adminService.getUsers().subscribe({
      next: (data) => { this.users = data; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }

  approveProduct(id: string) {
    this.productService.approveProduct(id).subscribe({
      next: () => { this.message = 'Product approved.'; this.loadPendingProducts(); },
      error: (e) => { this.error = e.error?.message || 'Failed.'; }
    });
  }

  rejectProduct(id: string) {
    this.productService.rejectProduct(id).subscribe({
      next: () => { this.message = 'Product rejected.'; this.loadPendingProducts(); },
      error: (e) => { this.error = e.error?.message || 'Failed.'; }
    });
  }

  approveVendor(id: string) {
    this.adminService.approveVendor(id).subscribe({
      next: () => { this.message = 'Vendor approved.'; this.loadPendingVendors(); },
      error: (e) => { this.error = e.error?.message || 'Failed.'; }
    });
  }

  rejectVendor(id: string) {
    this.adminService.rejectVendor(id).subscribe({
      next: () => { this.message = 'Vendor rejected.'; this.loadPendingVendors(); },
      error: (e) => { this.error = e.error?.message || 'Failed.'; }
    });
  }

  approveDoctor(id: string) {
    this.adminService.approveDoctor(id).subscribe({
      next: () => { this.message = 'Doctor approved.'; this.loadPendingDoctors(); },
      error: (e) => { this.error = e.error?.message || 'Failed.'; }
    });
  }

  rejectDoctor(id: string) {
    this.adminService.rejectDoctor(id).subscribe({
      next: () => { this.message = 'Doctor rejected.'; this.loadPendingDoctors(); },
      error: (e) => { this.error = e.error?.message || 'Failed.'; }
    });
  }

  updateOrderStatus(id: string, status: string) {
    this.adminService.updateOrderStatus(id, status).subscribe({
      next: () => { this.message = 'Order updated.'; this.loadOrders(); },
      error: (e) => { this.error = e.error?.message || 'Failed.'; }
    });
  }

  updatePrescriptionStatus(id: string, status: string) {
    this.adminService.updatePrescriptionStatus(id, status).subscribe({
      next: () => { this.message = 'Prescription updated.'; this.loadPrescriptions(); },
      error: (e) => { this.error = e.error?.message || 'Failed.'; }
    });
  }

  createCoupon() {
    if (!this.newCoupon.code) return;
    this.adminService.createCoupon(this.newCoupon).subscribe({
      next: () => { this.message = 'Coupon created.'; this.newCoupon = { code: '', discountAmount: 100, isActive: true }; },
      error: (e) => { this.error = e.error?.message || 'Failed.'; }
    });
  }
}
