import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface Receipt {
  ReceiptId?: string;
  EmployeeId: string;
  CustomerId?: string;
  ReceiptDate: string;
  ReceiptTotal: number;
  TableNum: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReceiptService {
  private apiBaseUrl = 'http://localhost:5265/api/receipts';
  private token: string | null = null;
  private receiptUpdated = new Subject<Receipt[]>();

  constructor(private http: HttpClient) {     
    if (typeof window !== 'undefined' && localStorage) {
      this.token = localStorage.getItem('token');
    }    
  }

  getReceipts(): Observable<Receipt[]> {
    return this.http.get<Receipt[]>(this.apiBaseUrl, {
      headers: new HttpHeaders({ Authorization: `Bearer ${this.token}` })
    }).pipe(
      tap(receipts => this.receiptUpdated.next(receipts))
    );
  }

  getReceiptById(id: string | undefined): Observable<Receipt> {
    const url = `${this.apiBaseUrl}/${id}`;
    return this.http.get<Receipt>(url, {
      headers: new HttpHeaders({ Authorization: `Bearer ${this.token}` })
    });
  }

  addReceipt(receipt: any): Observable<any> {
    return this.http.post<any>(this.apiBaseUrl, receipt, {
      headers: new HttpHeaders({ Authorization: `Bearer ${this.token}` })
    }).pipe(
      tap(() => this.getReceipts().subscribe()) // Refresh the receipt list after adding
    );
  }

  updateReceipt(id: string, receipt: Partial<Receipt>): Observable<Partial<Receipt>> {
    const url = `${this.apiBaseUrl}/${id}`;
    return this.http.put<Partial<Receipt>>(url, receipt, {
      headers: new HttpHeaders({ Authorization: `Bearer ${this.token}` })
    }).pipe(
      tap(() => this.getReceipts().subscribe()) // Refresh the receipt list after updating
    );
  }

  deleteReceipt(id: string): Observable<void> {
    const url = `${this.apiBaseUrl}/${id}`;
    return this.http.delete<void>(url, {
      headers: new HttpHeaders({ Authorization: `Bearer ${this.token}` })
    }).pipe(
      tap(() => this.getReceipts().subscribe()) // Refresh the receipt list after deleting
    );
  }

  getReceiptUpdates(): Observable<Receipt[]> {
    return this.receiptUpdated.asObservable();
  }
}
