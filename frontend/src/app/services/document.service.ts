import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Document {
  id?: number;
  fileName: string;
  fileType: string;
  employee: any;
  uploadDate: string;
  expiryDate?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = '/api/documents';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  uploadDocument(employeeId: number, file: File, expiryDate?: string): Observable<Document> {
    const formData = new FormData();
    formData.append('file', file);
    if (expiryDate) {
      formData.append('expiryDate', expiryDate);
    }

    return this.http.post<Document>(`${this.apiUrl}/upload/${employeeId}`, formData, {
      headers: this.getHeaders()
    });
  }

  getDocumentsByEmployee(employeeId: number): Observable<Document[]> {
    return this.http.get<Document[]>(`${this.apiUrl}/employee/${employeeId}`, {
      headers: this.getHeaders()
    });
  }

  downloadDocument(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download/${id}`, {
      headers: this.getHeaders(),
      responseType: 'blob'
    });
  }

  deleteDocument(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }
}