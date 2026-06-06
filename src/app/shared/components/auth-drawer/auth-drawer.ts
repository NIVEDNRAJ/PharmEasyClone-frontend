import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-auth-drawer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auth-drawer.html'
})
export class AuthDrawerComponent {
  authService = inject(AuthService);
  private fb = inject(FormBuilder);

  // UI State: 'email' | 'otp' | 'loading'
  step: 'email' | 'otp' | 'loading' = 'email';
  errorMessage = '';

  emailForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  otpForm: FormGroup = this.fb.group({
    code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
  });

  close() {
    this.authService.closeDrawer();
    // Reset state after closing
    setTimeout(() => {
      this.step = 'email';
      this.emailForm.reset();
      this.otpForm.reset();
      this.errorMessage = '';
    }, 300); // Wait for sliding animation to finish
  }

  requestOtp() {
    if (this.emailForm.invalid) return;
    
    this.step = 'loading';
    this.errorMessage = '';
    const email = this.emailForm.value.email;

    this.authService.sendOtp(email).subscribe({
      next: () => {
        this.step = 'otp';
      },
      error: (err) => {
        this.errorMessage = 'Failed to send OTP. Please try again.';
        this.step = 'email';
      }
    });
  }

  verifyOtp() {
    if (this.otpForm.invalid) return;

    this.step = 'loading';
    this.errorMessage = '';
    const email = this.emailForm.value.email;
    const code = this.otpForm.value.code;

    this.authService.verifyOtp(email, code).subscribe({
      next: (res) => {
        this.authService.saveToken(res.token);
        this.close();
        alert('Login Successful!'); // We will replace this with a nice toast later
      },
      error: (err) => {
        this.errorMessage = 'Invalid or expired OTP.';
        this.step = 'otp';
      }
    });
  }
}