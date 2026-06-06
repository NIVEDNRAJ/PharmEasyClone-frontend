import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PrescriptionService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/Prescriptions`;

  upload(data: {
    patientName: string;
    deliveryAddress: string;
    pincode: string;
    imageUrl?: string;
    notes?: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/upload`, data);
  }

  getMyPrescriptions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/my`);
  }
}
