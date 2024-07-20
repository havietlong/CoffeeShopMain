import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Category {
  CategoryId: number;
  CategoryName: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private apiBaseUrl = 'http://localhost:5265/api/category';
  private token: string | null = null;

  constructor(private http: HttpClient) {
    if (typeof window !== 'undefined' && localStorage) {
      this.token = localStorage.getItem('token');
    }
  }

  // getCategories(): Observable<Category[]> {
  //   return this.http.get<Category[]>(this.apiBaseUrl);
  // }

  // GET all categories
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiBaseUrl, {
      headers: new HttpHeaders({ Authorization: `Bearer ${this.token}` }),      
    }
  );
  }

  // // GET category by ID
  // getCategoryById(id: number): Observable<Category> {
  //   const url = `${this.apiBaseUrl}/${id}`;
  //   return this.http.get<Category>(url, {
  //     headers: new HttpHeaders({ Authorization: `Bearer ${this.token}` }),
  //     withCredentials: true
  //   });
  // }

  // // POST new category
  addCategory(category: Partial<Category>): Observable<Partial<Category>> {
    return this.http.post<Partial<Category>>(this.apiBaseUrl, category, {
      headers: new HttpHeaders({ Authorization: `Bearer ${this.token}` }),
      withCredentials: true
    });
  }

  // // PUT update category by ID
  // updateCategory(id: number, category: Category): Observable<Category> {
  //   const url = `${this.apiBaseUrl}/${id}`;
  //   return this.http.put<Category>(url, category, {
  //     headers: new HttpHeaders({ Authorization: `Bearer ${this.token}` }),
  //     withCredentials: true
  //   });
  // }

  // // DELETE category by ID
  // deleteCategory(id: number): Observable<void> {
  //   const url = `${this.apiBaseUrl}/${id}`;
  //   return this.http.delete<void>(url, {
  //     headers: new HttpHeaders({ Authorization: `Bearer ${this.token}` }),
  //     withCredentials: true
  //   });
  // }
}
