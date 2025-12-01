import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RoleService, Role } from '../../services/role.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-role-form',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './role-form.html',
  styleUrl: './role-form.css',
})
export class RoleForm implements OnInit {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  roleService = inject(RoleService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  roleForm: FormGroup;
  loading = false;
  errorMessage = '';
  isEditMode = false;
  roleId: number | null = null;

  constructor() {
    this.roleForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      baseSalary: ['', [Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.roleId = Number(id);
      this.loadRole(this.roleId);
    }
  }

  loadRole(id: number): void {
    this.loading = true;
    this.roleService.getRole(id).subscribe({
      next: (role) => {
        this.roleForm.patchValue(role);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading role:', error);
        this.errorMessage = 'Failed to load role';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.roleForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const roleData: Role = this.roleForm.value;

    const request = this.isEditMode && this.roleId
      ? this.roleService.updateRole(this.roleId, roleData)
      : this.roleService.createRole(roleData);

    request.subscribe({
      next: (response) => {
        this.loading = false;
        this.router.navigate(['/roles']);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'Failed to save role. Please try again.';
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
