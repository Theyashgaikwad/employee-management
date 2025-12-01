import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DepartmentService, Department } from '../../services/department.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-department-form',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './department-form.html',
  styleUrl: './department-form.css',
})
export class DepartmentForm implements OnInit {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  departmentService = inject(DepartmentService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  departmentForm: FormGroup;
  loading = false;
  errorMessage = '';
  isEditMode = false;
  departmentId: number | null = null;

  constructor() {
    this.departmentForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      manager: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.departmentId = Number(id);
      this.loadDepartment(this.departmentId);
    }
  }

  loadDepartment(id: number): void {
    this.loading = true;
    this.departmentService.getDepartment(id).subscribe({
      next: (department) => {
        this.departmentForm.patchValue(department);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading department:', error);
        this.errorMessage = 'Failed to load department';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.departmentForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const departmentData: Department = this.departmentForm.value;

    const request = this.isEditMode && this.departmentId
      ? this.departmentService.updateDepartment(this.departmentId, departmentData)
      : this.departmentService.createDepartment(departmentData);

    request.subscribe({
      next: (response) => {
        this.loading = false;
        this.router.navigate(['/departments']);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'Failed to save department. Please try again.';
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
