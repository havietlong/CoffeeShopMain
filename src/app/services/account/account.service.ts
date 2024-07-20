import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Account {
  username:String;
  firstName:String;
  lastName:String;
  dateOfBirth: String;
  userPosition: number;
  role: number;
  gender: number;
  phoneNumber: string;
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiAuthUrl = 'http://localhost:5265/api/Auth';  // Make sure this URL matches your Express server's URL
  private apiUserUrl = 'http://localhost:5265/api/Users'; 
  // private authUrl = '';
  private token: string | null = null;

  constructor(private http: HttpClient) {     
    if (typeof window !== 'undefined' && localStorage) {
      this.token = localStorage.getItem('token');
    }    
  }

  // Login
  login(username: string, password: string): Observable<{
    userId: string; token: string 
}> {
    return this.http.post<{ userId: string;token: string }>(this.apiAuthUrl+'/login', { username, password });
  }

  // GET all accounts
  getAccounts(): Observable<Account[]> {
    console.log(this.token);
    return this.http.get<Account[]>(this.apiAuthUrl, {
      headers: new HttpHeaders({ Authorization: `Bearer ${this.token}` })
    });
  }

  // GET account by ID
  getAccountById(id: string): Observable<Account> {
    const url = `${this.apiAuthUrl}/${id}`;
    return this.http.get<Account>(url, {
      headers: new HttpHeaders({ Authorization: `Bearer ${this.token}` })
    });
  }

  // POST new account
  addAccount(account: Account): Observable<Account> {
    return this.http.post<Account>(this.apiUserUrl, account, {
      headers: new HttpHeaders({ Authorization: `Bearer ${this.token}` })
    });
  }

  // PUT update account by ID
  updateAccount(id: string, account: Account): Observable<Account> {
    const url = `${this.apiAuthUrl}/${id}`;
    return this.http.put<Account>(url, account, {
      headers: new HttpHeaders({ Authorization: `Bearer ${this.token}` })
    });
  }

  // DELETE account by ID
  deleteAccount(id: string): Observable<void> {
    const url = `${this.apiAuthUrl}/${id}`;
    return this.http.delete<void>(url, {
      headers: new HttpHeaders({ Authorization: `Bearer ${this.token}` })
    });
  }
}
