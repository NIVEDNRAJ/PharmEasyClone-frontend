import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/Auth`;

  // State management for the slide-out drawer
  private isDrawerOpenSubject = new BehaviorSubject<boolean>(false);
  isDrawerOpen$ = this.isDrawerOpenSubject.asObservable();

  openDrawer() {
    this.isDrawerOpenSubject.next(true);
  }

  closeDrawer() {
    this.isDrawerOpenSubject.next(false);
  }

  sendOtp(email: string, role: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/send-otp`, { email, role });
  }

  verifyOtp(email: string, code: string, role?: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-otp`, { email, code, role });
  }

  login(email: string, role: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, role });
  }

  // Helper to save token (you can expand this later)
  saveToken(token: string, role?: string) {
    localStorage.setItem('pharm_token', token);
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      localStorage.setItem('user_email', this.readClaim(payload, 'email') || '');
      if (role) localStorage.setItem('user_role', role);
    } catch {}
  }

  getDashboardRoute(): string {
    const role = this.getUserRole();
    switch (role) {
      case 'Admin': return '/admin';
      case 'Vendor': return '/vendor';
      case 'Doctor': return '/doctor';
      default: return '/';
    }
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('pharm_token');
  }

  getUserRole(): string {
    const token = localStorage.getItem('pharm_token');
    if (!token) return 'Customer';
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const role = this.readClaim(payload, 'role') || localStorage.getItem('user_role') || 'Customer';
      return role;
    } catch {
      return 'Customer';
    }
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'Admin';
  }

  isVendor(): boolean {
    return this.getUserRole() === 'Vendor';
  }

  isDoctor(): boolean {
    return this.getUserRole() === 'Doctor';
  }

  getUserName(): string | null {
    const token = localStorage.getItem('pharm_token');
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const name = this.readClaim(payload, 'name') || this.readClaim(payload, 'email') || '';
      return name.split('@')[0];
    } catch {
      return 'User';
    }
  }

  logout() {
    localStorage.removeItem('pharm_token');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_role');
    window.location.reload();
  }

  private readClaim(payload: Record<string, string>, claimName: string): string {
    return payload[claimName]
      || payload[`http://schemas.xmlsoap.org/ws/2005/05/identity/claims/${claimName}`]
      || payload[`http://schemas.microsoft.com/ws/2008/06/identity/claims/${claimName}`]
      || '';
  }
}