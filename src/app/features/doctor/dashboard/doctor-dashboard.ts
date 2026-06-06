import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DoctorPortalService } from '../../../core/services/doctor-portal';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './doctor-dashboard.html',
  styleUrls: ['./doctor-dashboard.scss']
})
export class DoctorDashboardComponent implements OnInit {
  private doctorPortal = inject(DoctorPortalService);
  authService = inject(AuthService);

  activeTab: 'overview' | 'appointments' | 'profile' = 'overview';
  isLoading = true;
  stats: any = {};
  appointments: any[] = [];
  profile: any = {};

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
      case 'appointments': this.loadAppointments(); break;
      case 'profile': this.loadProfile(); break;
    }
  }

  loadOverview() {
    this.doctorPortal.getDashboard().subscribe({
      next: (data) => { this.stats = data; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }

  loadAppointments() {
    this.doctorPortal.getAppointments().subscribe({
      next: (data) => { this.appointments = data; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }

  loadProfile() {
    this.doctorPortal.getProfile().subscribe({
      next: (data) => { this.profile = { ...data }; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }

  updateStatus(id: string, status: string) {
    this.doctorPortal.updateAppointmentStatus(id, status).subscribe({
      next: () => { this.message = 'Status updated.'; this.loadAppointments(); },
      error: (e) => { this.error = e.error?.message || 'Failed.'; }
    });
  }

  saveProfile() {
    this.doctorPortal.updateProfile(this.profile).subscribe({
      next: () => { this.message = 'Profile saved.'; },
      error: (e) => { this.error = e.error?.message || 'Failed.'; }
    });
  }

  joinConsultation(booking: any) {
    if (booking.paymentStatus !== 'Paid') {
      alert('Payment pending for this consultation.');
      return;
    }
    alert(`Connecting to ${booking.patientName}'s ${booking.mode} consultation room...`);
  }
}
