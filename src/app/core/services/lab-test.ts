import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class LabTestService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/LabTests`;

  getLabTests(category?: string): Observable<any[]> {
    const url = category ? `${this.apiUrl}?category=${encodeURIComponent(category)}` : this.apiUrl;
    return this.http.get<any[]>(url);
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/categories`);
  }

  book(data: {
    labTestId: string;
    patientName: string;
    address: string;
    pincode: string;
    bookingDate: string;
    timeSlot: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/book`, data);
  }

  getMyBookings(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/bookings`);
  }
}
