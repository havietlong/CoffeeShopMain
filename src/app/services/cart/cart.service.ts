import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiBaseUrl = 'http://localhost:5265/api/carts';
  private token: string | null = null;

  constructor(private http: HttpClient) {
    if (typeof window !== 'undefined' && localStorage) {
      this.token = localStorage.getItem('token');
    }
  }

  getCart(): Observable<any> {
    return this.http.get<any>(this.apiBaseUrl, {
      headers: new HttpHeaders({ Authorization: `Bearer ${this.token}` }),      
    }
  );
  }

  getCartById(id: string): Observable<any> {
    const url = `${this.apiBaseUrl}/${id}`;
    return this.http.get<any>(url, { headers: new HttpHeaders({ Authorization: `Bearer ${this.token}` }) });
  }

  addCart(receipt: any): Observable<any> {
    return this.http.post<any>(this.apiBaseUrl, receipt, {
      headers: new HttpHeaders({ Authorization: `Bearer ${this.token}` })
    }).pipe(
      tap(() => this.getCart().subscribe()) // Refresh the cart list after adding
    );
  }
}
