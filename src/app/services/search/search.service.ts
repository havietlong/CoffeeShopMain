import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private baseUrl = 'http://localhost:5265/api';
  private token: string | null = null;

  constructor(private http: HttpClient) {
    if (typeof window !== 'undefined' && localStorage) {
      this.token = localStorage.getItem('token');
    }
  }

  searchRecords(table: string, column: string, value: string): Observable<any[]> {
    let tableToSearch = '';
  
    switch (table) {
      case 'employees':
        tableToSearch = 'Users';
        break;
      case 'products':
        tableToSearch = 'products';
        break;
      // Add more cases here if needed for other tables
    }
  
    return this.http.get<any[]>(`${this.baseUrl}/${tableToSearch}?search=${value}&sortBy=${column}`, {
      headers: new HttpHeaders({ Authorization: `Bearer ${this.token}` })
    });
  }
}
