import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LeaveService, Leave } from '../../services/leave.service';
import { EmployeeService, Employee } from '../../services/employee.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-leave-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './leave-form.html',
  styleUrl: './leave-form.css',
})
export class LeaveForm implements OnInit {
  authService = inject(AuthService);
  leaveService = inject(LeaveService);
  employeeService = inject(EmployeeService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  leave: Leave = {
    employee: {} as Employee,
    startDate: '',
    endDate: '',
    leaveType: 'CASUAL',
    reason: '',
    status: 'PENDING'
  };

  employees: Employee[] = [];
  loading = false;
  errorMessage = '';
  isEdit = false;
  leaveId: number | null = null;

  leaveTypes = [
    { value: 'CASUAL', label: 'Casual Leave' },
    { value: 'SICK', label: 'Sick Leave' },
    { value: 'EARNED', label: 'Earned Leave' },
    { value: 'MATERNITY', label: 'Maternity Leave' },
    { value: 'PATERNITY', label: 'Paternity Leave' }
  ];

  ngOnInit(): void {
    this.loadEmployees();
    this.checkIfEdit();
  }

  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe({
      next: (data) => {
        this.employees = data;
      },
      error: (error) => {
        console.error('Error loading employees:', error);
        this.errorMessage = 'Failed to load employees';
      }
    });
  }

  checkIfEdit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEdit = true;
      this.leaveId = +id;
      this.loadLeave(this.leaveId);
    }
  }

  loadLeave(id: number): void {
    // For edit functionality, we would need to get leave by ID
    // Since the backend doesn't have a getLeave endpoint, we'll skip this for now
    this.errorMessage = 'Edit functionality not implemented yet';
  }

  onSubmit(): void {
    if (!this.isValid()) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    if (this.isEdit && this.leaveId) {
      this.updateLeave();
    } else {
      this.createLeave();
    }
  }

  createLeave(): void {
    this.leaveService.createLeave(this.leave).subscribe({
      next: (data) => {
        this.loading = false;
        this.router.navigate(['/leaves']);
      },
      error: (error) => {
        console.error('Error creating leave:', error);
        this.errorMessage = 'Failed to create leave request';
        this.loading = false;
      }
    });
  }

  updateLeave(): void {
    if (!this.leaveId) return;

    this.leaveService.updateLeave(this.leaveId, this.leave).subscribe({
      next: (data) => {
        this.loading = false;
        this.router.navigate(['/leaves']);
      },
      error: (error) => {
        console.error('Error updating leave:', error);
        this.errorMessage = 'Failed to update leave request';
        this.loading = false;
      }
    });
  }

  isValid(): boolean {
    return !!(
      this.leave.employee.id &&
      this.leave.startDate &&
      this.leave.endDate &&
      this.leave.leaveType &&
      this.leave.reason
    );
  }

  cancel(): void {
    this.router.navigate(['/leaves']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}