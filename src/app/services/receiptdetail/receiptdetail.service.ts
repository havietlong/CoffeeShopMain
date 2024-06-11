import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ReceiptDetail {
  ReceiptId: string;
  ProductId: number;
  ProductQuantity: number;
  ProductPrice: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReceiptDetailService {
  private apiBaseUrl = 'http://localhost:3000/receiptdetails';  // Make sure this URL matches your Express server's URL
  private token: string | null = null;

  constructor(private http: HttpClient) {     
    if (typeof window !== 'undefined' && localStorage) {
      this.token = localStorage.getItem('token');
    }    
  }

  // GET all receipt details
  getReceiptDetails(): Observable<ReceiptDetail[]> {
    return this.http.get<ReceiptDetail[]>(this.apiBaseUrl, {
      headers: new HttpHeaders({ Authorization: `Bearer ${this.token}` })
    });
  }

  // GET receipt detail by ID
  getReceiptDetailById(receiptId: string, productId: number): Observable<ReceiptDetail> {
    const url = `${this.apiBaseUrl}/${receiptId}/${productId}`;
    return this.http.get<ReceiptDetail>(url, {
      headers: new HttpHeaders({ Authorization: `Bearer ${this.token}` })
    });
  }

  // POST new receipt detail
  addReceiptDetail(receiptDetail: ReceiptDetail): Observable<ReceiptDetail> {
    return this.http.post<ReceiptDetail>(this.apiBaseUrl, receiptDetail, {
      headers: new HttpHeaders({ Authorization: `Bearer ${this.token}` })
    });
  }

  // PUT update receipt detail by ID
  updateReceiptDetail(receiptId: string, productId: number, receiptDetail: ReceiptDetail): Observable<ReceiptDetail> {
    const url = `${this.apiBaseUrl}/${receiptId}/${productId}`;
    return this.http.put<ReceiptDetail>(url, receiptDetail, {
      headers: new HttpHeaders({ Authorization: `Bearer ${this.token}` })
    });
  }

  // DELETE receipt detail by ID
  deleteReceiptDetail(receiptId: string, productId: number): Observable<void> {
    const url = `${this.apiBaseUrl}/${receiptId}/${productId}`;
    return this.http.delete<void>(url, {
      headers: new HttpHeaders({ Authorization: `Bearer ${this.token}` })
    });
  }
}
