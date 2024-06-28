import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private baseUrl = 'http://localhost:3000';
  private token: string | null = null;

  constructor(private http: HttpClient) {
    if (typeof window !== 'undefined' && localStorage) {
      this.token = localStorage.getItem('token');
    }
  }

  searchRecords(table: string, column: string, value: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/search`, {
      headers: new HttpHeaders({ Authorization: `Bearer ${this.token}` }),
      params: { table, column, value }
    });
  }
}
