import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DoctorService } from '../../../core/services/doctor';

@Component({
  selector: 'app-booking-success',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './booking-success.html',
  styleUrls: ['./booking-success.scss']
})
export class BookingSuccessComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private doctorService = inject(DoctorService);

  bookingId: string | null = null;
  bookingDetails: any = null;
  isLoading = true;

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.bookingId = params['bookingId'] || null;
      if (this.bookingId) {
        this.fetchBookingDetails();
      } else {
        this.isLoading = false;
      }
    });
  }

  fetchBookingDetails() {
    this.isLoading = true;
    this.doctorService.getBookingHistory().subscribe({
      next: (history) => {
        // Find the booking in history
        const match = history.find(b => b.id.toLowerCase() === this.bookingId?.toLowerCase());
        if (match) {
          this.bookingDetails = match;
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}
