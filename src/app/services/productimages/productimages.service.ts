import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ProductImage {
  ProductImageId?: number;
  ProductImagePath: string;
  ProductImageDescription: string;
  ProductId: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductImageService {
  private apiBaseUrl = 'http://localhost:3000/productimages';  // Make sure this URL matches your Express server's URL
  private token: string | null = null;

  constructor(private http: HttpClient) {     
    if (typeof window !== 'undefined' && localStorage) {
      this.token = localStorage.getItem('token');
    }    
  }

  // GET all product images
  getProductImages(): Observable<ProductImage[]> {
    return this.http.get<ProductImage[]>(this.apiBaseUrl, {
      headers: new HttpHeaders({ Authorization: `Bearer ${this.token}` })
    });
  }

  // GET product image by ID
  getProductImageById(id: number): Observable<ProductImage> {
    const url = `${this.apiBaseUrl}/${id}`;
    return this.http.get<ProductImage>(url, {
      headers: new HttpHeaders({ Authorization: `Bearer ${this.token}` })
    });
  }

  // POST new product image
  addProductImage(productImage: ProductImage): Observable<ProductImage> {
    return this.http.post<ProductImage>(this.apiBaseUrl, productImage, {
      headers: new HttpHeaders({ Authorization: `Bearer ${this.token}` })
    });
  }

  // PUT update product image by ID
  updateProductImage(id: number, productImage: ProductImage): Observable<ProductImage> {
    const url = `${this.apiBaseUrl}/${id}`;
    return this.http.put<ProductImage>(url, productImage, {
      headers: new HttpHeaders({ Authorization: `Bearer ${this.token}` })
    });
  }

  // DELETE product image by ID
  deleteProductImage(id: number): Observable<void> {
    const url = `${this.apiBaseUrl}/${id}`;
    return this.http.delete<void>(url, {
      headers: new HttpHeaders({ Authorization: `Bearer ${this.token}` })
    });
  }
}
