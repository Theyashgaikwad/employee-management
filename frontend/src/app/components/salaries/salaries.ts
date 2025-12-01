import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SalaryService, Salary } from '../../services/salary.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-salaries',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './salaries.html',
  styleUrl: './salaries.css',
})
export class Salaries implements OnInit {
  authService = inject(AuthService);
  salaryService = inject(SalaryService);
  router = inject(Router);

  salaries: Salary[] = [];
  filteredSalaries: Salary[] = [];
  loading = false;
  errorMessage = '';
  searchTerm = '';
  selectedMonth = '';
  selectedYear = '';

  months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  years = Array.from({ length: 10 }, (_, i) => (new Date().getFullYear() - i).toString());

  ngOnInit(): void {
    this.loadSalaries();
  }

  loadSalaries(): void {
    this.loading = true;
    this.salaryService.getSalaries().subscribe({
      next: (data) => {
        this.salaries = data;
        this.filteredSalaries = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading salaries:', error);
        this.errorMessage = 'Failed to load salary records';
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.applyFilters();
  }

  onMonthFilter(): void {
    this.applyFilters();
  }

  onYearFilter(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = this.salaries;

    if (this.searchTerm) {
      filtered = filtered.filter(salary =>
        salary.employee.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        salary.employee.lastName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        salary.employee.email.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    if (this.selectedMonth) {
      filtered = filtered.filter(salary => salary.month === this.selectedMonth);
    }

    if (this.selectedYear) {
      filtered = filtered.filter(salary => salary.year === parseInt(this.selectedYear));
    }

    this.filteredSalaries = filtered;
  }

  deleteSalary(id: number | undefined): void {
    if (!id) return;

    if (confirm('Are you sure you want to delete this salary record?')) {
      this.salaryService.deleteSalary(id).subscribe({
        next: () => {
          this.loadSalaries();
        },
        error: (error) => {
          console.error('Error deleting salary:', error);
          this.errorMessage = 'Failed to delete salary record';
        }
      });
    }
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}