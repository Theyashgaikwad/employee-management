import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DepartmentService, Department } from '../../services/department.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-departments',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './departments.html',
  styleUrl: './departments.css',
})
export class Departments implements OnInit {
  authService = inject(AuthService);
  departmentService = inject(DepartmentService);
  router = inject(Router);

  departments: Department[] = [];
  filteredDepartments: Department[] = [];
  loading = false;
  errorMessage = '';
  searchTerm = '';

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.loading = true;
    this.departmentService.getDepartments().subscribe({
      next: (data) => {
        this.departments = data;
        this.filteredDepartments = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading departments:', error);
        this.errorMessage = 'Failed to load departments';
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    if (!this.searchTerm) {
      this.filteredDepartments = this.departments;
      return;
    }

    this.filteredDepartments = this.departments.filter(dept =>
      dept.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      (dept.description && dept.description.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
      (dept.manager && dept.manager.toLowerCase().includes(this.searchTerm.toLowerCase()))
    );
  }

  deleteDepartment(id: number | undefined): void {
    if (!id) return;

    if (confirm('Are you sure you want to delete this department?')) {
      this.departmentService.deleteDepartment(id).subscribe({
        next: () => {
          this.loadDepartments();
        },
        error: (error) => {
          console.error('Error deleting department:', error);
          this.errorMessage = 'Failed to delete department';
        }
      });
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
