import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DoctorService } from '../../../core/services/doctor';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-consult-summary',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './consult-summary.html',
  styleUrls: ['./consult-summary.scss']
})
export class ConsultSummaryComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private doctorService = inject(DoctorService);
  authService = inject(AuthService);

  doctor: any = null;
  isLoading = true;

  // Calendar dates
  dates: any[] = [];
  selectedDateIndex = 0;

  // Slots
  afternoonSlots = ['04:45 PM'];
  eveningSlots = ['07:00 PM', '07:15 PM', '07:30 PM', '07:45 PM', '08:00 PM', '08:15 PM'];
  selectedSlot: string | null = null;
  isEveningOpen = true;
  isAfternoonOpen = true;

  // Booking details form
  bookingForm: FormGroup = this.fb.group({
    patientName: ['', [Validators.required, Validators.minLength(2)]],
    gender: ['Male', [Validators.required]],
    symptoms: [''],
    mode: ['Video', [Validators.required]]
  });

  // Coupons
  couponCode = '';
  appliedCoupon: any = null;
  couponError = '';
  couponSuccess = '';

  // Pricing
  mrp = 0;
  discount = 0;
  totalAmount = 0;

  // Payment UI state
  isSubmitting = false;
  showSimulatedPayment = false;
  mockOrderId = '';
  mockBookingId = '';

  ngOnInit() {
    this.generateCalendarDates();
    this.route.queryParams.subscribe(params => {
      const doctorId = params['doctorId'];
      if (doctorId) {
        this.fetchDoctorDetails(doctorId);
      } else {
        this.router.navigate(['/doctor-consult']);
      }
    });
  }

  generateCalendarDates() {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let i = 0; i < 6; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      this.dates.push({
        dayName: days[d.getDay()],
        dateNum: d.getDate(),
        month: months[d.getMonth()],
        fullDate: d,
        label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : `${days[d.getDay()]} ${d.getDate()}`
      });
    }
  }

  fetchDoctorDetails(id: string) {
    this.doctorService.getDoctorById(id).subscribe({
      next: (data) => {
        this.doctor = data;
        this.mrp = this.doctor.consultationFee;
        this.recalculateBill();
        this.isLoading = false;
      },
      error: () => {
        this.router.navigate(['/doctor-consult']);
      }
    });
  }

  selectDate(index: number) {
    this.selectedDateIndex = index;
    this.selectedSlot = null; // Reset slot
  }

  selectSlot(slot: string) {
    this.selectedSlot = slot;
  }

  applyCoupon() {
    this.couponError = '';
    this.couponSuccess = '';
    
    if (!this.couponCode.trim()) {
      this.couponError = 'Please enter a coupon code.';
      return;
    }

    this.doctorService.validateCoupon(this.couponCode.trim()).subscribe({
      next: (res) => {
        this.appliedCoupon = res;
        this.discount = res.discountAmount;
        this.couponSuccess = `Coupon "${res.code}" applied! Discount of ₹${res.discountAmount} applied.`;
        this.recalculateBill();
      },
      error: () => {
        this.appliedCoupon = null;
        this.discount = 0;
        this.couponError = 'Invalid or expired coupon code. Try "DOCTOR150".';
        this.recalculateBill();
      }
    });
  }

  removeCoupon() {
    this.appliedCoupon = null;
    this.discount = 0;
    this.couponCode = '';
    this.couponSuccess = '';
    this.couponError = '';
    this.recalculateBill();
  }

  recalculateBill() {
    this.totalAmount = this.mrp - this.discount;
    if (this.totalAmount < 0) this.totalAmount = 0;
  }

  onSubmit() {
    if (this.bookingForm.invalid) {
      this.bookingForm.markAllAsTouched();
      return;
    }

    if (!this.selectedSlot) {
      alert('Please select a preferred consultation time slot.');
      return;
    }

    // Check login
    const token = localStorage.getItem('pharm_token');
    if (!token) {
      alert('Please log in to confirm your booking.');
      this.authService.openDrawer();
      return;
    }

    this.isSubmitting = true;
    const formVal = this.bookingForm.value;
    const bookingDto = {
      doctorId: this.doctor.id,
      patientName: formVal.patientName,
      gender: formVal.gender,
      symptoms: formVal.symptoms,
      mode: formVal.mode,
      bookingDate: this.dates[this.selectedDateIndex].fullDate,
      timeSlot: this.selectedSlot,
      couponCode: this.appliedCoupon ? this.appliedCoupon.code : null
    };

    this.doctorService.bookConsultation(bookingDto).subscribe({
      next: (res) => {
        const orderId = res.razorpayOrderId;
        const bookingId = res.bookingId;
        const keyId = res.razorpayKeyId;

        this.mockOrderId = orderId;
        this.mockBookingId = bookingId;

        // Trigger Simulated Checkout Dialog
        this.isSubmitting = false;
        this.showSimulatedPayment = true;
      },
      error: (err) => {
        alert(err?.error?.message || 'Failed to create booking order. Please try again.');
        this.isSubmitting = false;
      }
    });
  }

  // Handle Mock Payment Success
  confirmSimulatedSuccess() {
    this.showSimulatedPayment = false;
    this.isSubmitting = true;

    const confirmDto = {
      bookingId: this.mockBookingId,
      razorpayOrderId: this.mockOrderId,
      razorpayPaymentId: 'pay_mock_' + Math.random().toString(36).substring(2, 9),
      razorpaySignature: 'sig_mock_verified'
    };

    this.doctorService.confirmBooking(confirmDto).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.router.navigate(['/doctor-consult/confirmation'], { queryParams: { bookingId: res.bookingId } });
      },
      error: (err) => {
        alert(err?.error?.message || 'Payment confirmation failed on server.');
        this.isSubmitting = false;
      }
    });
  }

  cancelSimulatedPayment() {
    this.showSimulatedPayment = false;
  }
}
