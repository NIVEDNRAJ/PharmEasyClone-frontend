import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DoctorPortalService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/DoctorPortal`;

  getDashboard(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard`);
  }

  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile`);
  }

  updateProfile(profile: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/profile`, profile);
  }

  getAppointments(status?: string): Observable<any[]> {
    const url = status ? `${this.apiUrl}/appointments?status=${status}` : `${this.apiUrl}/appointments`;
    return this.http.get<any[]>(url);
  }

  updateAppointmentStatus(id: string, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/appointments/${id}/status`, { status });
  }
}
