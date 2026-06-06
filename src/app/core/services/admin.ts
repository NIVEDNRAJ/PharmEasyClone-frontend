import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/Admin`;

  getDashboard(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard`);
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users`);
  }

  getPendingVendors(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/vendors/pending`);
  }

  approveVendor(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/vendors/${id}/approve`, {});
  }

  rejectVendor(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/vendors/${id}/reject`, {});
  }

  getPendingDoctors(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/doctors/pending`);
  }

  approveDoctor(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/doctors/${id}/approve`, {});
  }

  rejectDoctor(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/doctors/${id}/reject`, {});
  }

  getOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/orders`);
  }

  updateOrderStatus(id: string, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/orders/${id}/status`, { status });
  }

  getCoupons(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/coupons`);
  }

  createCoupon(coupon: { code: string; discountAmount: number; isActive: boolean }): Observable<any> {
    return this.http.post(`${this.apiUrl}/coupons`, coupon);
  }

  getPrescriptions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/prescriptions`);
  }

  updatePrescriptionStatus(id: string, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/prescriptions/${id}/status`, { status });
  }
}
