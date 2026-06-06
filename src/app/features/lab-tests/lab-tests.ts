import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LabTestService } from '../../core/services/lab-test';
import { AuthService } from '../../core/services/auth';

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
    this.labTestService.book({
      labTestId: this.selectedTest.id,
      patientName: this.booking.patientName,
      address: this.booking.address,
      pincode: this.booking.pincode,
      bookingDate: this.booking.bookingDate,
      timeSlot: this.booking.timeSlot
    }).subscribe({
      next: (res) => {
        this.message = res.message;
        this.showBooking = false;
        this.error = '';
      },
      error: (e) => { this.error = e.error?.message || 'Booking failed.'; }
    });
  }
}
