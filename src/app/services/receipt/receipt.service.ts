import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Receipt {
  ReceiptId: string;
  EmployeeId: string;
  CustomerId: string;
  ReceiptDate: string;
  ReceiptTotal: number;
  TableNum: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReceiptService {
  private apiBaseUrl = 'http://localhost:3000/receipts';  // Make sure this URL matches your Express server's URL
  private token: string | null = null;

  constructor(private http: HttpClient) {     
    if (typeof window !== 'undefined' && localStorage) {
      this.token = localStorage.getItem('token');
    }    
  }

  // GET all receipts
  getReceipts(): Observable<Receipt[]> {
    return this.http.get<Receipt[]>(this.apiBaseUrl, {
      headers: new HttpHeaders({ Authorization: `Bearer ${this.token}` })
    });
  }

  // GET receipt by ID
  getReceiptById(id: string): Observable<Receipt> {
    const url = `${this.apiBaseUrl}/${id}`;
    return this.http.get<Receipt>(url, {
      headers: new HttpHeaders({ Authorization: `Bearer ${this.token}` })
    });
  }

  // POST new receipt
  addReceipt(receipt: Receipt): Observable<Receipt> {
    return this.http.post<Receipt>(this.apiBaseUrl, receipt, {
      headers: new HttpHeaders({ Authorization: `Bearer ${this.token}` })
    });
  }

  // PUT update receipt by ID
  updateReceipt(id: string, receipt: Receipt): Observable<Receipt> {
    const url = `${this.apiBaseUrl}/${id}`;
    return this.http.put<Receipt>(url, receipt, {
      headers: new HttpHeaders({ Authorization: `Bearer ${this.token}` })
    });
  }

  // DELETE receipt by ID
  deleteReceipt(id: string): Observable<void> {
    const url = `${this.apiBaseUrl}/${id}`;
    return this.http.delete<void>(url, {
      headers: new HttpHeaders({ Authorization: `Bearer ${this.token}` })
    });
  }
}
