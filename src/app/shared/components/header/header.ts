import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth';
import { CartService } from '../../../core/services/cart';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './header.html'
})
export class HeaderComponent {
  authService = inject(AuthService);
  cartService = inject(CartService);
  private router = inject(Router);

  searchQuery = '';

  search() {
    if (!this.searchQuery.trim()) return;
    this.router.navigate(['/search'], { queryParams: { query: this.searchQuery.trim() } });
    this.searchQuery = ''; // Clear after search
  }
}