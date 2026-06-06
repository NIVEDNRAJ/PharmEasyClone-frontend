import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.html'
})
export class HeaderComponent {
  authService = inject(AuthService);
}