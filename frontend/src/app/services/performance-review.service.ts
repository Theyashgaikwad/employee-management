import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface PerformanceReview {
  id?: number;
  employee: any;
  reviewer: any;
  reviewDate?: string;
  quarter: string;
  rating: number;
  managerFeedback: string;
  employeeSelfAssessment: string;
  goals: string;
  achievements: string;
}

@Injectable({
  providedIn: 'root'
})
export class PerformanceReviewService {
  private apiUrl = '/api/performance-reviews';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getReviewsByEmployee(employeeId: number): Observable<PerformanceReview[]> {
    return this.http.get<PerformanceReview[]>(`${this.apiUrl}/employee/${employeeId}`, {
      headers: this.getHeaders()
    });
  }

  createReview(review: PerformanceReview): Observable<PerformanceReview> {
    return this.http.post<PerformanceReview>(this.apiUrl, review, {
      headers: this.getHeaders()
    });
  }

  updateReview(id: number, review: PerformanceReview): Observable<PerformanceReview> {
    return this.http.put<PerformanceReview>(`${this.apiUrl}/${id}`, review, {
      headers: this.getHeaders()
    });
  }

  deleteReview(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }
}