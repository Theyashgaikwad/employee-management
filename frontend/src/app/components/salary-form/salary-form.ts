import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SalaryService, Salary } from '../../services/salary.service';
import { EmployeeService, Employee } from '../../services/employee.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-salary-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './salary-form.html',
  styleUrl: './salary-form.css',
})
export class SalaryForm implements OnInit {
  authService = inject(AuthService);
  salaryService = inject(SalaryService);
  employeeService = inject(EmployeeService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  salary: Salary = {
    employee: {} as Employee,
    payDate: '',
    basicSalary: 0,
    month: '',
    year: new Date().getFullYear(),
    status: 'PENDING'
  };

  employees: Employee[] = [];
  loading = false;
  errorMessage = '';
  isEdit = false;
  salaryId: number | null = null;

  months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

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
      this.salaryId = +id;
      this.loadSalary(this.salaryId);
    }
  }

  loadSalary(id: number): void {
    // For edit functionality, we would need to get salary by ID
    // Since the backend doesn't have a getSalary endpoint, we'll skip this for now
    this.errorMessage = 'Edit functionality not implemented yet';
  }

  onSubmit(): void {
    if (!this.isValid()) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    if (this.isEdit && this.salaryId) {
      this.updateSalary();
    } else {
      this.createSalary();
    }
  }

  createSalary(): void {
    this.salaryService.createSalary(this.salary).subscribe({
      next: (data) => {
        this.loading = false;
        this.router.navigate(['/salaries']);
      },
      error: (error) => {
        console.error('Error creating salary:', error);
        this.errorMessage = 'Failed to create salary record';
        this.loading = false;
      }
    });
  }

  updateSalary(): void {
    if (!this.salaryId) return;

    this.salaryService.updateSalary(this.salaryId, this.salary).subscribe({
      next: (data) => {
        this.loading = false;
        this.router.navigate(['/salaries']);
      },
      error: (error) => {
        console.error('Error updating salary:', error);
        this.errorMessage = 'Failed to update salary record';
        this.loading = false;
      }
    });
  }

  isValid(): boolean {
    return !!(
      this.salary.employee.id &&
      this.salary.basicSalary &&
      this.salary.month &&
      this.salary.year
    );
  }

  cancel(): void {
    this.router.navigate(['/salaries']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}