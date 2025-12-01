import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LeaveService, Leave } from '../../services/leave.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-leaves',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './leaves.html',
  styleUrl: './leaves.css',
})
export class Leaves implements OnInit {
  authService = inject(AuthService);
  leaveService = inject(LeaveService);
  router = inject(Router);

  leaves: Leave[] = [];
  filteredLeaves: Leave[] = [];
  loading = false;
  errorMessage = '';
  searchTerm = '';
  selectedStatus = '';

  ngOnInit(): void {
    this.loadLeaves();
  }

  loadLeaves(): void {
    this.loading = true;
    this.leaveService.getLeaves().subscribe({
      next: (data) => {
        this.leaves = data;
        this.filteredLeaves = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading leaves:', error);
        this.errorMessage = 'Failed to load leave requests';
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.applyFilters();
  }

  onStatusFilter(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = this.leaves;

    if (this.searchTerm) {
      filtered = filtered.filter(leave =>
        leave.employee.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        leave.employee.lastName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        leave.employee.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        leave.leaveType.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    if (this.selectedStatus) {
      filtered = filtered.filter(leave => leave.status === this.selectedStatus);
    }

    this.filteredLeaves = filtered;
  }

  approveLeave(leave: Leave): void {
    if (!leave.id) return;

    // For demo purposes, using employee ID 1 as approver. In real app, get from current user
    this.leaveService.approveLeave(leave.id, 1).subscribe({
      next: () => {
        this.loadLeaves();
      },
      error: (error) => {
        console.error('Error approving leave:', error);
        this.errorMessage = 'Failed to approve leave request';
      }
    });
  }

  rejectLeave(leave: Leave): void {
    if (!leave.id) return;

    const comments = prompt('Enter rejection comments:');
    if (comments === null) return;

    // For demo purposes, using employee ID 1 as approver. In real app, get from current user
    this.leaveService.rejectLeave(leave.id, 1, comments).subscribe({
      next: () => {
        this.loadLeaves();
      },
      error: (error) => {
        console.error('Error rejecting leave:', error);
        this.errorMessage = 'Failed to reject leave request';
      }
    });
  }

  deleteLeave(id: number | undefined): void {
    if (!id) return;

    if (confirm('Are you sure you want to delete this leave request?')) {
      this.leaveService.deleteLeave(id).subscribe({
        next: () => {
          this.loadLeaves();
        },
        error: (error) => {
          console.error('Error deleting leave:', error);
          this.errorMessage = 'Failed to delete leave request';
        }
      });
    }
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}