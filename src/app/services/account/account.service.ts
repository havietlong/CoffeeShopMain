import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Account {
  AccountId: string;
  AccountUsername: string;
  AccountPassword: string;
  RoleId: number;
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiBaseUrl = 'http://localhost:3000/accounts';  // Make sure this URL matches your Express server's URL
  private authUrl = 'http://localhost:3000/login';
  private token: string | null = null;

  constructor(private http: HttpClient) {     
    if (typeof window !== 'undefined' && localStorage) {
      this.token = localStorage.getItem('token');
    }    
  }

  // Login
  login(username: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(this.authUrl, { username, password });
  }

  // GET all accounts
  getAccounts(): Observable<Account[]> {
    console.log(this.token);
    return this.http.get<Account[]>(this.apiBaseUrl, {
      headers: new HttpHeaders({ Authorization: `Bearer ${this.token}` })
    });
  }

  // GET account by ID
  getAccountById(id: string): Observable<Account> {
    const url = `${this.apiBaseUrl}/${id}`;
    return this.http.get<Account>(url, {
      headers: new HttpHeaders({ Authorization: `Bearer ${this.token}` })
    });
  }

  // POST new account
  addAccount(account: Account): Observable<Account> {
    return this.http.post<Account>(this.apiBaseUrl, account, {
      headers: new HttpHeaders({ Authorization: `Bearer ${this.token}` })
    });
  }

  // PUT update account by ID
  updateAccount(id: string, account: Account): Observable<Account> {
    const url = `${this.apiBaseUrl}/${id}`;
    return this.http.put<Account>(url, account, {
      headers: new HttpHeaders({ Authorization: `Bearer ${this.token}` })
    });
  }

  // DELETE account by ID
  deleteAccount(id: string): Observable<void> {
    const url = `${this.apiBaseUrl}/${id}`;
    return this.http.delete<void>(url, {
      headers: new HttpHeaders({ Authorization: `Bearer ${this.token}` })
    });
  }
}
