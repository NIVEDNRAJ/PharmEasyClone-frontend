import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DoctorService } from '../../../core/services/doctor';
import { AuthService } from '../../../core/services/auth';
import { ProductService } from '../../../core/services/product';

@Component({
  selector: 'app-booking-history',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './booking-history.html',
  styleUrls: ['./booking-history.scss']
})
export class BookingHistoryComponent implements OnInit {
  private doctorService = inject(DoctorService);
  private productService = inject(ProductService);
  authService = inject(AuthService);

  activeTab: 'consultations' | 'vendor' | 'admin' = 'consultations';
  history: any[] = [];
  isLoading = true;
  isLoggedIn = false;

  // Vendor Panel fields
  vendorProducts: any[] = [];
  newProduct = {
    name: '',
    description: '',
    category: 'Medicine',
    imageUrl: '',
    requiresPrescription: false,
    price: 0,
    discountPercentage: 10,
    stockCount: 100
  };
  isUploading = false;
  uploadSuccess = '';
  uploadError = '';

  // Admin Panel fields
  pendingProducts: any[] = [];
  isApproving = false;
  approveSuccess = '';
  approveError = '';

  ngOnInit() {
    this.checkLoginStatus();
  }

  checkLoginStatus() {
    const token = localStorage.getItem('pharm_token');
    this.isLoggedIn = !!token;
    if (this.isLoggedIn) {
      const role = this.authService.getUserRole();
      if (role === 'Admin') {
        this.activeTab = 'admin';
        this.fetchPendingProducts();
      } else if (role === 'Vendor') {
        this.activeTab = 'vendor';
        this.fetchVendorProducts();
      } else {
        this.activeTab = 'consultations';
        this.fetchBookingHistory();
      }
    } else {
      this.isLoading = false;
    }
  }

  setActiveTab(tab: 'consultations' | 'vendor' | 'admin') {
    this.activeTab = tab;
    if (tab === 'consultations') {
      this.fetchBookingHistory();
    } else if (tab === 'vendor') {
      this.fetchVendorProducts();
    } else if (tab === 'admin') {
      this.fetchPendingProducts();
    }
  }

  fetchBookingHistory() {
    this.isLoading = true;
    this.doctorService.getBookingHistory().subscribe({
      next: (data) => {
        this.history = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  fetchVendorProducts() {
    this.isLoading = true;
    this.productService.getVendorProducts().subscribe({
      next: (data) => {
        this.vendorProducts = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  fetchPendingProducts() {
    this.isLoading = true;
    this.productService.getPendingProducts().subscribe({
      next: (data) => {
        this.pendingProducts = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  uploadProduct() {
    if (!this.newProduct.name || !this.newProduct.description || !this.newProduct.price) {
      this.uploadError = 'Please fill out all required fields.';
      return;
    }
    this.isUploading = true;
    this.uploadSuccess = '';
    this.uploadError = '';

    this.productService.uploadProductByVendor(this.newProduct).subscribe({
      next: (res) => {
        this.isUploading = false;
        this.uploadSuccess = 'Product uploaded successfully and is pending Admin approval!';
        // Reset form
        this.newProduct = {
          name: '',
          description: '',
          category: 'Medicine',
          imageUrl: '',
          requiresPrescription: false,
          price: 0,
          discountPercentage: 10,
          stockCount: 100
        };
        this.fetchVendorProducts();
      },
      error: (err) => {
        this.isUploading = false;
        this.uploadError = err.error?.message || 'Failed to upload product. Please try again.';
      }
    });
  }

  approveProduct(id: string) {
    this.isApproving = true;
    this.approveSuccess = '';
    this.approveError = '';
    this.productService.approveProduct(id).subscribe({
      next: (res) => {
        this.isApproving = false;
        this.approveSuccess = 'Product approved and is now live!';
        this.fetchPendingProducts();
      },
      error: (err) => {
        this.isApproving = false;
        this.approveError = err.error?.message || 'Failed to approve product.';
      }
    });
  }

  joinConsultation(booking: any) {
    if (booking.paymentStatus !== 'Paid') {
      alert('This booking requires payment before joining.');
      return;
    }
    alert(`Connecting to ${booking.doctorName}'s secure ${booking.mode.toLowerCase()} room...\nPlease grant microphone and camera permissions when prompted.`);
  }

  triggerLogin() {
    this.authService.openDrawer();
    // Watch drawer close to refresh
    this.authService.isDrawerOpen$.subscribe(open => {
      if (!open) {
        // Delay slightly for token writing
        setTimeout(() => this.checkLoginStatus(), 500);
      }
    });
  }
}
