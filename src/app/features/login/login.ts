import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent implements OnInit {
  authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  // UI state: 'login' | 'register'
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

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.redirectBasedOnRole();
    }
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
    const email = this.emailForm.value.email;

    this.authService.login(email, this.selectedRole).subscribe({
      next: (res) => {
        this.authService.saveToken(res.token, res.role);
        this.step = 'email';
        this.redirectBasedOnRole();
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
        this.redirectBasedOnRole();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Verification failed. Please check the code and try again.';
        this.step = 'otp';
      }
    });
  }

  private redirectBasedOnRole() {
    this.router.navigate([this.authService.getDashboardRoute()]);
  }
}
