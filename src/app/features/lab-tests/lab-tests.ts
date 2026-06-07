import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LabTestService } from '../../core/services/lab-test';
import { AuthService } from '../../core/services/auth';

declare var Razorpay: any;

@Component({
  selector: 'app-lab-tests',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './lab-tests.html',
  styleUrls: ['./lab-tests.scss']
})
export class LabTestsComponent implements OnInit {
  private labTestService = inject(LabTestService);
  authService = inject(AuthService);

  tests: any[] = [];
  categories: string[] = [];
  selectedCategory = '';
  isLoading = true;

  showBooking = false;
  selectedTest: any = null;
  booking = {
    patientName: '',
    address: '',
    pincode: '400001',
    bookingDate: '',
    timeSlot: 'Morning (8 AM - 12 PM)'
  };
  message = '';
  error = '';

  isSubmitting = false;

  ngOnInit() {
    this.labTestService.getCategories().subscribe({
      next: (cats) => { this.categories = cats; }
    });
    this.loadTests();
  }

  loadTests() {
    this.isLoading = true;
    this.labTestService.getLabTests(this.selectedCategory || undefined).subscribe({
      next: (data) => { this.tests = data; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }

  filterCategory(cat: string) {
    this.selectedCategory = cat;
    this.loadTests();
  }

  openBooking(test: any) {
    if (!this.authService.isLoggedIn()) {
      this.authService.openDrawer();
      return;
    }
    this.selectedTest = test;
    this.showBooking = true;
    this.booking.bookingDate = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  }

  confirmBooking() {
    if (!this.selectedTest || !this.booking.patientName || !this.booking.address) {
      this.error = 'Please fill all required fields.';
      return;
    }
    this.isSubmitting = true;
    this.error = '';
    this.message = '';

    this.labTestService.book({
      labTestId: this.selectedTest.id,
      patientName: this.booking.patientName,
      address: this.booking.address,
      pincode: this.booking.pincode,
      bookingDate: this.booking.bookingDate,
      timeSlot: this.booking.timeSlot
    }).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        const keyId = res.razorpayKeyId;
        const orderId = res.razorpayOrderId;
        const bookingId = res.bookingId;
        const amount = res.paidAmount;

        this.showBooking = false;
        this.openRazorpayCheckout(keyId, orderId, bookingId, amount);
      },
      error: (e) => {
        this.error = e.error?.message || 'Booking failed.';
        this.isSubmitting = false;
      }
    });
  }

  openRazorpayCheckout(keyId: string, orderId: string, bookingId: string, amount: number) {
    const options = {
      key: keyId,
      amount: Math.round(amount * 100), // paise
      currency: 'INR',
      name: 'PharmEasy Clone',
      description: 'Lab Test Booking',
      order_id: orderId,
      handler: (response: any) => {
        this.isSubmitting = true;
        const confirmDto = {
          bookingId: bookingId,
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature
        };

        this.labTestService.confirmBooking(confirmDto).subscribe({
          next: () => {
            this.isSubmitting = false;
            this.message = 'Lab test booked successfully! Sample collection will happen at your address.';
            this.booking.patientName = '';
            this.booking.address = '';
          },
          error: (err) => {
            alert(err?.error?.message || 'Payment confirmation failed.');
            this.isSubmitting = false;
          }
        });
      },
      prefill: {
        email: localStorage.getItem('user_email') || '',
        name: this.booking.patientName || ''
      },
      theme: {
        color: '#10B981'
      },
      modal: {
        ondismiss: () => {
          this.isSubmitting = false;
        }
      }
    };

    try {
      const rzp = new Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Failed to open Razorpay checkout:', err);
      alert('Failed to initialize Razorpay payment. Please check your internet connection.');
    }
  }
}
