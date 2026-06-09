import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class VendorPortalService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/VendorPortal`;

  getDashboard(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard`);
  }

  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile`);
  }

  updateProfile(profile: { businessName: string; licenseNumber: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/profile`, profile);
  }

  updateInventory(productId: string, data: { price: number; discountPercentage: number; stockCount: number }): Observable<any> {
    return this.http.put(`${this.apiUrl}/inventory/${productId}`, data);
  }

  getOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/orders`);
  }
}
