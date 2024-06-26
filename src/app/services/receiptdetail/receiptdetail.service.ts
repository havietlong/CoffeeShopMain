import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../products/products.service';

export interface ReceiptDetail {
  Product: Product;
  ReceiptId?: string;
  ProductId?: number;
  ProductQuantity: number;
  ProductPrice: number;
}
@Injectable({
  providedIn: 'root'
})
export class ReceiptDetailService {
  private apiUrl = 'http://localhost:3000/receiptdetails'; // Adjust the URL as needed
  private token: string | null = null;

  constructor(private http: HttpClient) {
    if (typeof window !== 'undefined' && localStorage) {
      this.token = localStorage.getItem('token');
    }
  }

  // GET all receipt details for a receipt
  getReceiptDetails(receiptId: string): Observable<ReceiptDetail[]> {
    const url = `${this.apiUrl}/${receiptId}`;
    return this.http.get<ReceiptDetail[]>(url, {
      headers: new HttpHeaders({ Authorization: `Bearer ${this.token}` })
    });
  }

  // POST a new receipt detail
  addReceiptDetail(receiptDetail: { ProductId: number | undefined; ProductPrice: number; ProductQuantity: number; ReceiptId: string | undefined }): Observable<ReceiptDetail> {
    return this.http.post<ReceiptDetail>(this.apiUrl, receiptDetail, {
      headers: new HttpHeaders({ Authorization: `Bearer ${this.token}` })
    });
  }

  // PUT update a receipt detail
  updateReceiptDetail(receiptId: string | undefined, productId: number, receiptDetail: Partial<ReceiptDetail>): Observable<Partial<ReceiptDetail>> {
    const url = `${this.apiUrl}/${receiptId}/${productId}`;
    return this.http.put<Partial<ReceiptDetail>>(url, receiptDetail, {
      headers: new HttpHeaders({ Authorization: `Bearer ${this.token}` })
    });
  }

  // DELETE a receipt detail
  deleteReceiptDetail(receiptId: string, productId: number | undefined): Observable<void> {
    const url = `${this.apiUrl}/${receiptId}/${productId}`;
    return this.http.delete<void>(url, {
      headers: new HttpHeaders({ Authorization: `Bearer ${this.token}` })
    });
  }
}