import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface Customer {
  CustomerId: string;
  CustomerName: string;
  CustomerPhone: string;
  CustomerBirthday: Date;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiBaseUrl = 'http://localhost:3000/customers';  // Make sure this URL matches your Express server's URL
  private token: string | null = null;

  constructor(private http: HttpClient) {     
    if (typeof window !== 'undefined' && localStorage) {
      this.token = localStorage.getItem('token');
    }    
  }

  // GET all customers
  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.apiBaseUrl, {
      headers: new HttpHeaders({ Authorization: `Bearer ${this.token}` })
    });
  }

  // GET customer by ID
  getCustomerById(id: string): Observable<Customer> {
    const url = `${this.apiBaseUrl}/${id}`;
    return this.http.get<Customer>(url, {
      headers: new HttpHeaders({ Authorization: `Bearer ${this.token}` })
    });
  }

  // POST new customer
  addCustomer(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(this.apiBaseUrl, customer, {
      headers: new HttpHeaders({ Authorization: `Bearer ${this.token}` })
    });
  }

  // PUT update customer by ID
  updateCustomer(id: string, customer: Customer): Observable<Customer> {
    const url = `${this.apiBaseUrl}/${id}`;
    return this.http.put<Customer>(url, customer, {
      headers: new HttpHeaders({ Authorization: `Bearer ${this.token}` })
    });
  }

  // DELETE customer by ID
  deleteCustomer(id: string): Observable<void> {
    const url = `${this.apiBaseUrl}/${id}`;
    return this.http.delete<void>(url, {
      headers: new HttpHeaders({ Authorization: `Bearer ${this.token}` })
    });
  }
}
