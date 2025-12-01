import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AttendanceService, Attendance as AttendanceModel } from '../../services/attendance.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-attendance-form',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './attendance-form.html',
  styleUrl: './attendance-form.css',
})
export class AttendanceForm implements OnInit {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  attendanceService = inject(AttendanceService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  attendanceForm: FormGroup;
  loading = false;
  errorMessage = '';
  isEditMode = false;
  attendanceId: number | null = null;

  statusOptions = ['PRESENT', 'ABSENT', 'LATE', 'HALF_DAY'];

  constructor() {
    this.attendanceForm = this.fb.group({
      employeeId: ['', [Validators.required]],
      date: ['', [Validators.required]],
      checkInTime: [''],
      checkOutTime: [''],
      workingHours: [''],
      status: ['PRESENT', [Validators.required]],
      notes: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.attendanceId = Number(id);
      this.loadAttendance(this.attendanceId);
    }
  }

  loadAttendance(id: number): void {
    this.loading = true;
    this.attendanceService.getAttendance(id).subscribe({
      next: (attendance) => {
        this.attendanceForm.patchValue(attendance);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading attendance:', error);
        this.errorMessage = 'Failed to load attendance';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.attendanceForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const attendanceData: AttendanceModel = this.attendanceForm.value;

    const request = this.isEditMode && this.attendanceId
      ? this.attendanceService.updateAttendance(this.attendanceId, attendanceData)
      : this.attendanceService.createAttendance(attendanceData);

    request.subscribe({
      next: (response) => {
        this.loading = false;
        this.router.navigate(['/attendance']);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'Failed to save attendance. Please try again.';
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
