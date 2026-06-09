import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/Orders`;

  placeOrder(orderDto: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/place`, orderDto);
  }

  confirmOrder(confirmDto: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/confirm`, confirmDto);
  }

  getOrderHistory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/history`);
  }
}
