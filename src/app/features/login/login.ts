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

  // UI state: 'email' | 'loading'
  step: 'email' | 'loading' = 'email';
  errorMessage = '';
  selectedRole = 'Customer'; // Customer, Vendor, Doctor, Admin

  emailForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.redirectBasedOnRole();
    }
  }

  login() {
    if (this.emailForm.invalid) return;

    this.step = 'loading';
    this.errorMessage = '';
    const email = this.emailForm.value.email;

    this.authService.login(email, this.selectedRole).subscribe({
      next: (res) => {
        this.authService.saveToken(res.token, res.role);
        this.step = 'email';
        this.redirectBasedOnRole();
      },
      error: (err) => {
        this.errorMessage = 'Authentication failed. Please check your network or try again.';
        this.step = 'email';
      }
    });
  }

  private redirectBasedOnRole() {
    this.router.navigate([this.authService.getDashboardRoute()]);
  }
}
