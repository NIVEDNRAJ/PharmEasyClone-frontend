import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  
  // Ensure this matches your running .NET API port
  private apiUrl = 'http://localhost:5204/api/Products'; 

  getTrendingProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/trending`);
  }
}