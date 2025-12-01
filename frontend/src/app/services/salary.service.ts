import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Employee } from './employee.service';

export interface Salary {
  id?: number;
  employee: Employee;
  payDate: string;
  basicSalary: number;
  hra?: number;
  conveyance?: number;
  medical?: number;
  lta?: number;
  pf?: number;
  gratuity?: number;
  tax?: number;
  deductions?: number;
  netSalary?: number;
  month: string;
  year: number;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class SalaryService {
  private apiUrl = '/api/salaries';

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

  getSalaries(): Observable<Salary[]> {
    return this.http.get<Salary[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getSalariesByEmployee(employeeId: number): Observable<Salary[]> {
    return this.http.get<Salary[]>(`${this.apiUrl}/employee/${employeeId}`, { headers: this.getHeaders() });
  }

  createSalary(salary: Salary): Observable<Salary> {
    return this.http.post<Salary>(this.apiUrl, salary, { headers: this.getHeaders() });
  }

  updateSalary(id: number, salary: Salary): Observable<Salary> {
    return this.http.put<Salary>(`${this.apiUrl}/${id}`, salary, { headers: this.getHeaders() });
  }

  deleteSalary(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}