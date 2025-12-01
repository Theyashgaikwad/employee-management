import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Employee } from './employee.service';

export interface Leave {
  id?: number;
  employee: Employee;
  startDate: string;
  endDate: string;
  leaveType: string;
  reason: string;
  status: string;
  appliedDate?: string;
  approvedDate?: string;
  approvedBy?: Employee;
  comments?: string;
  daysCount?: number;
}

export interface LeaveBalance {
  total: number;
  used: number;
  remaining: number;
}

@Injectable({
  providedIn: 'root'
})
export class LeaveService {
  private apiUrl = '/api/leaves';

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

  getLeaves(): Observable<Leave[]> {
    return this.http.get<Leave[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getLeavesByEmployee(employeeId: number): Observable<Leave[]> {
    return this.http.get<Leave[]>(`${this.apiUrl}/employee/${employeeId}`, { headers: this.getHeaders() });
  }

  getLeavesByStatus(status: string): Observable<Leave[]> {
    return this.http.get<Leave[]>(`${this.apiUrl}/status/${status}`, { headers: this.getHeaders() });
  }

  createLeave(leave: Leave): Observable<Leave> {
    return this.http.post<Leave>(this.apiUrl, leave, { headers: this.getHeaders() });
  }

  approveLeave(id: number, approvedById: number): Observable<Leave> {
    return this.http.put<Leave>(`${this.apiUrl}/${id}/approve?approvedById=${approvedById}`, {}, { headers: this.getHeaders() });
  }

  rejectLeave(id: number, approvedById: number, comments: string): Observable<Leave> {
    return this.http.put<Leave>(`${this.apiUrl}/${id}/reject?approvedById=${approvedById}&comments=${comments}`, {}, { headers: this.getHeaders() });
  }

  updateLeave(id: number, leave: Leave): Observable<Leave> {
    return this.http.put<Leave>(`${this.apiUrl}/${id}`, leave, { headers: this.getHeaders() });
  }

  deleteLeave(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  getLeaveBalance(employeeId: number): Observable<LeaveBalance> {
    return this.http.get<LeaveBalance>(`${this.apiUrl}/employee/${employeeId}/balance`, { headers: this.getHeaders() });
  }
}