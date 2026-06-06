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

  // UI State: 'email' | 'loading'
  step: 'email' | 'loading' = 'email';
  errorMessage = '';

  selectedRole = 'Customer'; // Customer, Vendor, Doctor, Admin

  emailForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  close() {
    this.authService.closeDrawer();
    // Reset state after closing
    setTimeout(() => {
      this.step = 'email';
      this.emailForm.reset();
      this.errorMessage = '';
    }, 300); // Wait for sliding animation to finish
  }

  login() {
    if (this.emailForm.invalid) return;
    
    this.step = 'loading';
    this.errorMessage = '';
    const email = this.emailForm.value.email;

    this.authService.login(email, this.selectedRole).subscribe({
      next: (res) => {
        this.authService.saveToken(res.token, res.role);
        this.close();
        window.location.href = this.authService.getDashboardRoute() || '/';
      },
      error: (err) => {
        this.errorMessage = 'Authentication failed. Please check your network or try again.';
        this.step = 'email';
      }
    });
  }
}
