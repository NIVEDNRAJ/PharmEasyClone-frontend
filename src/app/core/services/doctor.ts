import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DoctorService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getDoctors(specialty?: string): Observable<any[]> {
    const url = specialty
      ? `${this.apiUrl}/Doctors?specialty=${encodeURIComponent(specialty)}`
      : `${this.apiUrl}/Doctors`;
    return this.http.get<any[]>(url);
  }

  getSpecialties(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/Doctors/specialties`);
  }

  getDoctorById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Doctors/${id}`);
  }

  validateCoupon(code: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Coupons/validate/${encodeURIComponent(code)}`);
  }

  bookConsultation(bookingDto: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Consultations/book`, bookingDto);
  }

  confirmBooking(confirmDto: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Consultations/confirm`, confirmDto);
  }

  getBookingHistory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Consultations/history`);
  }
}
