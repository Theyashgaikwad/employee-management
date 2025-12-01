import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AttendanceService, Attendance as AttendanceModel } from '../../services/attendance.service';
import { EmployeeService, Employee } from '../../services/employee.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-attendance',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './attendance.html',
  styleUrl: './attendance.css',
})
export class Attendance implements OnInit {
  authService = inject(AuthService);
  attendanceService = inject(AttendanceService);
  employeeService = inject(EmployeeService);
  router = inject(Router);

  attendances: AttendanceModel[] = [];
  filteredAttendances: AttendanceModel[] = [];
  employees: Employee[] = [];
  loading = false;
  errorMessage = '';
  searchTerm = '';
  selectedEmployeeId: number | null = null;

  ngOnInit(): void {
    this.loadAttendances();
    this.loadEmployees();
  }

  loadAttendances(): void {
    this.loading = true;
    this.attendanceService.getAttendances().subscribe({
      next: (data) => {
        this.attendances = data;
        this.filteredAttendances = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading attendances:', error);
        this.errorMessage = 'Failed to load attendances';
        this.loading = false;
      }
    });
  }

  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe({
      next: (data) => {
        this.employees = data;
      },
      error: (error) => {
        console.error('Error loading employees:', error);
      }
    });
  }

  onSearch(): void {
    if (!this.searchTerm && !this.selectedEmployeeId) {
      this.filteredAttendances = this.attendances;
      return;
    }

    this.filteredAttendances = this.attendances.filter(attendance => {
      const matchesSearch = !this.searchTerm ||
        (attendance.employeeName && attendance.employeeName.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        attendance.status.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (attendance.notes && attendance.notes.toLowerCase().includes(this.searchTerm.toLowerCase()));

      const matchesEmployee = !this.selectedEmployeeId || attendance.employeeId === this.selectedEmployeeId;

      return matchesSearch && matchesEmployee;
    });
  }

  checkIn(employeeId: number): void {
    this.attendanceService.checkIn(employeeId).subscribe({
      next: () => {
        this.loadAttendances();
      },
      error: (error) => {
        console.error('Error checking in:', error);
        this.errorMessage = 'Failed to check in';
      }
    });
  }

  checkOut(employeeId: number): void {
    this.attendanceService.checkOut(employeeId).subscribe({
      next: () => {
        this.loadAttendances();
      },
      error: (error) => {
        console.error('Error checking out:', error);
        this.errorMessage = 'Failed to check out';
      }
    });
  }

  deleteAttendance(id: number | undefined): void {
    if (!id) return;

    if (confirm('Are you sure you want to delete this attendance record?')) {
      this.attendanceService.deleteAttendance(id).subscribe({
        next: () => {
          this.loadAttendances();
        },
        error: (error) => {
          console.error('Error deleting attendance:', error);
          this.errorMessage = 'Failed to delete attendance record';
        }
      });
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
