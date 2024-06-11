import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  apiUrl = 'https://ha-viet-long.imgbb.com/json';
  authToken = '9bac5ee302b53f9edcde35c61bcf631e1b517a9c';
  api_key = '19646d843fcf5c88988749f99588c157';
  api = 'https://api.imgbb.com/1/upload';

  constructor(private http: HttpClient) { }

  // Convert image file to base64
  convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  // Upload image to API
  uploadImage(base64Image: string): Observable<any> {
    const formData = new FormData();
    formData.append('image', base64Image.split(',')[1]); // Removing the data URL part
    const url = `${this.api}?key=${this.api_key}`;
    
    return this.http.post(url, formData);
  }
 
}
