import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-auth-drawer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './auth-drawer.html'
})
export class AuthDrawerComponent {
  authService = inject(AuthService);
  private fb = inject(FormBuilder);

  // UI State: 'login' | 'register'
  mode: 'login' | 'register' = 'login';
  // step inside current mode: 'email' | 'otp' | 'loading'
  step: 'email' | 'otp' | 'loading' = 'email';
  errorMessage = '';
  successMessage = '';

  selectedRole = 'Customer'; // Customer, Vendor, Doctor, Admin

  emailForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  otpForm: FormGroup = this.fb.group({
    code: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]]
  });

  close() {
    this.authService.closeDrawer();
    // Reset state after closing
    setTimeout(() => {
      this.mode = 'login';
      this.step = 'email';
      this.emailForm.reset();
      this.otpForm.reset();
      this.errorMessage = '';
      this.successMessage = '';
    }, 300); // Wait for sliding animation to finish
  }

  toggleMode() {
    this.mode = this.mode === 'login' ? 'register' : 'login';
    this.step = 'email';
    this.errorMessage = '';
    this.successMessage = '';
    this.emailForm.reset();
    this.otpForm.reset();
  }

  login() {
    if (this.emailForm.invalid) return;
    
    this.step = 'loading';
    this.errorMessage = '';
    this.successMessage = '';
    const email = this.emailForm.value.email.trim().toLowerCase();
    this.emailForm.patchValue({ email });

    this.authService.login(email, this.selectedRole).subscribe({
      next: (res) => {
        this.authService.saveToken(res.token, res.role);
        this.close();
        window.location.href = this.authService.getDashboardRoute() || '/';
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Authentication failed. Please check your credentials or register.';
        this.step = 'email';
      }
    });
  }

  sendRegistrationOtp() {
    if (this.emailForm.invalid) return;

    this.step = 'loading';
    this.errorMessage = '';
    this.successMessage = '';
    const email = this.emailForm.value.email.trim().toLowerCase();
    this.emailForm.patchValue({ email });

    this.authService.sendOtp(email, this.selectedRole).subscribe({
      next: (res) => {
        this.successMessage = res.message || 'Registration OTP sent. Please check your email.';
        this.step = 'otp';
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to send OTP. Please try again.';
        this.step = 'email';
      }
    });
  }

  verifyRegistrationOtp() {
    if (this.otpForm.invalid) return;

    this.step = 'loading';
    this.errorMessage = '';
    this.successMessage = '';
    const email = this.emailForm.value.email.trim().toLowerCase();
    const code = this.otpForm.value.code.trim();

    this.authService.verifyOtp(email, code, this.selectedRole).subscribe({
      next: (res) => {
        this.authService.saveToken(res.token, res.role);
        this.close();
        window.location.href = this.authService.getDashboardRoute() || '/';
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Verification failed. Please check the code and try again.';
        this.step = 'otp';
      }
    });
  }
}
