import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../core/services/order';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-history.html',
  styleUrls: ['./order-history.scss']
})
export class OrderHistoryComponent implements OnInit {
  private orderService = inject(OrderService);
  authService = inject(AuthService);

  orders: any[] = [];
  isLoading = true;
  isLoggedIn = false;

  ngOnInit() {
    this.checkLoginStatus();
  }

  checkLoginStatus() {
    const token = localStorage.getItem('pharm_token');
    this.isLoggedIn = !!token;
    if (this.isLoggedIn) {
      this.fetchOrderHistory();
    } else {
      this.isLoading = false;
    }
  }

  fetchOrderHistory() {
    this.isLoading = true;
    this.orderService.getOrderHistory().subscribe({
      next: (data) => {
        this.orders = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  triggerLogin() {
    this.authService.openDrawer();
    this.authService.isDrawerOpen$.subscribe(open => {
      if (!open) {
        setTimeout(() => this.checkLoginStatus(), 500);
      }
    });
  }
}
