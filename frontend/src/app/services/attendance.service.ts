import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Attendance {
  id?: number;
  employeeId?: number;
  employeeName?: string;
  date: string;
  checkInTime?: string;
  checkOutTime?: string;
  workingHours?: number;
  status: string;
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private apiUrl = '/api/attendance';

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

  getAttendances(): Observable<Attendance[]> {
    return this.http.get<Attendance[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getAttendance(id: number): Observable<Attendance> {
    return this.http.get<Attendance>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  getAttendancesByEmployee(employeeId: number): Observable<Attendance[]> {
    return this.http.get<Attendance[]>(`${this.apiUrl}/employee/${employeeId}`, { headers: this.getHeaders() });
  }

  checkIn(employeeId: number): Observable<Attendance> {
    return this.http.post<Attendance>(`${this.apiUrl}/checkin/${employeeId}`, {}, { headers: this.getHeaders() });
  }

  checkOut(employeeId: number): Observable<Attendance> {
    return this.http.put<Attendance>(`${this.apiUrl}/checkout/${employeeId}`, {}, { headers: this.getHeaders() });
  }

  createAttendance(attendance: Attendance): Observable<Attendance> {
    return this.http.post<Attendance>(this.apiUrl, attendance, { headers: this.getHeaders() });
  }

  updateAttendance(id: number, attendance: Attendance): Observable<Attendance> {
    return this.http.put<Attendance>(`${this.apiUrl}/${id}`, attendance, { headers: this.getHeaders() });
  }

  deleteAttendance(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}