import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5204/api/Auth'; // Ensure port matches .NET

  // State management for the slide-out drawer
  private isDrawerOpenSubject = new BehaviorSubject<boolean>(false);
  isDrawerOpen$ = this.isDrawerOpenSubject.asObservable();

  openDrawer() {
    this.isDrawerOpenSubject.next(true);
  }

  closeDrawer() {
    this.isDrawerOpenSubject.next(false);
  }

  sendOtp(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/send-otp`, { email });
  }

  verifyOtp(email: string, code: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-otp`, { email, code });
  }

  // Helper to save token (you can expand this later)
  saveToken(token: string) {
    localStorage.setItem('pharm_token', token);
  }
}