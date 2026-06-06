import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Product {
  id: string;
  name: string;
  imageUrl: string;
  category: string;
  requiresPrescription: boolean;
  bestPrice: number;
  maxDiscount: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  
  private apiUrl = `${environment.apiUrl}/Products`;

  getTrendingProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/trending`);
  }

  getProducts(searchTerm?: string, category?: string): Observable<Product[]> {
    let url = this.apiUrl;
    const params: string[] = [];
    if (searchTerm) params.push(`searchTerm=${encodeURIComponent(searchTerm)}`);
    if (category) params.push(`category=${encodeURIComponent(category)}`);
    if (params.length > 0) {
      url += '?' + params.join('&');
    }
    return this.http.get<Product[]>(url);
  }

  getProductById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/categories`);
  }

  getPendingProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pending`);
  }

  approveProduct(id: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/approve`, {});
  }

  rejectProduct(id: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/reject`, {});
  }

  uploadProductByVendor(productDto: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/vendor`, productDto);
  }

  getVendorProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/vendor`);
  }
}