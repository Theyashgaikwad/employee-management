import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService, Employee } from '../../services/employee.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class ProfileComponent implements OnInit {
  employeeService = inject(EmployeeService);
  authService = inject(AuthService);
  router = inject(Router);

  currentEmployee: Employee | null = null;
  loading = false;
  errorMessage = '';
  successMessage = '';

  profileForm: Partial<Employee> = {};
  passwordData = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  activeTab = 'profile';

  ngOnInit(): void {
    // For demo purposes, load employee with ID 1
    // In real app, get current user from auth service
    this.loadProfile(1);
  }

  loadProfile(employeeId: number): void {
    this.loading = true;
    this.employeeService.getEmployee(employeeId).subscribe({
      next: (employee) => {
        this.currentEmployee = employee;
        this.profileForm = { ...employee };
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.errorMessage = 'Failed to load profile';
        this.loading = false;
      }
    });
  }

  updateProfile(): void {
    if (!this.currentEmployee?.id) return;

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.employeeService.updateEmployee(this.currentEmployee.id, this.profileForm as Employee).subscribe({
      next: (updated) => {
        this.currentEmployee = updated;
        this.successMessage = 'Profile updated successfully';
        this.loading = false;
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        this.errorMessage = 'Failed to update profile';
        this.loading = false;
      }
    });
  }

  changePassword(): void {
    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      this.errorMessage = 'New passwords do not match';
      return;
    }

    if (!this.currentEmployee?.id) return;

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Call the change password endpoint
    this.employeeService.updateEmployee(this.currentEmployee.id, {
      ...this.currentEmployee,
      // Add password change logic here
    }).subscribe({
      next: () => {
        this.successMessage = 'Password changed successfully';
        this.passwordData = { oldPassword: '', newPassword: '', confirmPassword: '' };
        this.loading = false;
      },
      error: (error) => {
        console.error('Error changing password:', error);
        this.errorMessage = 'Failed to change password';
        this.loading = false;
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // In a real app, upload the file and get the URL
      // For now, just set a placeholder
      this.profileForm.profilePicture = 'uploaded-image-url';
    }
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    this.errorMessage = '';
    this.successMessage = '';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}