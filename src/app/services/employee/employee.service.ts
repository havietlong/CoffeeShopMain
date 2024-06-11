import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Employee {
  EmployeeId: string;
  EmployeeName: string;
  EmployeePosition: string;
  EmployeeWorkingHour: number;
  AccountId: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiBaseUrl = 'http://localhost:3000/employees';
  private token: string | null = null;

  constructor(private http: HttpClient) {
    if (typeof window !== 'undefined' && localStorage) {
      this.token = localStorage.getItem('token');
    }
  }

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });
  }

  // GET all employees
  getEmployees(): Observable<any> {
    return this.http.get<any>(this.apiBaseUrl, {
      headers: this.getAuthHeaders()
    });
  }

  // GET any by ID
  getEmployeeById(id: string): Observable<any> {
    const url = `${this.apiBaseUrl}/${id}`;
    return this.http.get<any>(url, {
      headers: this.getAuthHeaders()
    });
  }

  // POST new any
  addEmployee(any: any): Observable<any> {
    return this.http.post<any>(this.apiBaseUrl, any, {
      headers: this.getAuthHeaders()
    });
  }

  // PUT update any by ID
  updateEmployee(id: string, any: any): Observable<any> {
    const url = `${this.apiBaseUrl}/${id}`;
    return this.http.put<any>(url, any, {
      headers: this.getAuthHeaders()
    });
  }

  // DELETE any by ID
  deleteEmployee(id: string): Observable<void> {
    const url = `${this.apiBaseUrl}/${id}`;
    return this.http.delete<void>(url, {
      headers: this.getAuthHeaders()
    });
  }
}
