import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PrescriptionService } from '../../core/services/prescription';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-upload-prescription',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './upload-prescription.html',
  styleUrls: ['./upload-prescription.scss']
})
export class UploadPrescriptionComponent implements OnInit {
  private prescriptionService = inject(PrescriptionService);
  authService = inject(AuthService);

  form = {
    patientName: '',
    deliveryAddress: '',
    pincode: '400001',
    imageUrl: '',
    notes: ''
  };

  prescriptions: any[] = [];
  message = '';
  error = '';
  isLoading = false;
  step = 1;

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.loadMyPrescriptions();
    }
  }

  loadMyPrescriptions() {
    this.prescriptionService.getMyPrescriptions().subscribe({
      next: (data) => { this.prescriptions = data; }
    });
  }

  upload() {
    if (!this.authService.isLoggedIn()) {
      this.authService.openDrawer();
      return;
    }
    if (!this.form.patientName || !this.form.deliveryAddress) {
      this.error = 'Please fill required fields.';
      return;
    }
    this.isLoading = true;
    this.prescriptionService.upload(this.form).subscribe({
      next: (res) => {
        this.message = res.message;
        this.isLoading = false;
        this.step = 1;
        this.form = { patientName: '', deliveryAddress: '', pincode: '400001', imageUrl: '', notes: '' };
        this.loadMyPrescriptions();
      },
      error: (e) => {
        this.error = e.error?.message || 'Upload failed.';
        this.isLoading = false;
      }
    });
  }
}
