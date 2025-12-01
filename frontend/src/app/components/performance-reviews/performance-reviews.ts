import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PerformanceReviewService, PerformanceReview } from '../../services/performance-review.service';
import { EmployeeService } from '../../services/employee.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-performance-reviews',
  imports: [CommonModule, FormsModule],
  templateUrl: './performance-reviews.html',
  styleUrl: './performance-reviews.css',
})
export class PerformanceReviewsComponent implements OnInit {
  performanceReviewService = inject(PerformanceReviewService);
  employeeService = inject(EmployeeService);
  authService = inject(AuthService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  employeeId: number | null = null;
  reviews: PerformanceReview[] = [];
  loading = false;
  errorMessage = '';
  showForm = false;

  newReview: Partial<PerformanceReview> = {
    quarter: 'Q1',
    rating: 3,
    managerFeedback: '',
    employeeSelfAssessment: '',
    goals: '',
    achievements: ''
  };

  quarters = ['Q1', 'Q2', 'Q3', 'Q4'];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('employeeId');
    if (id) {
      this.employeeId = Number(id);
      this.loadReviews();
    }
  }

  loadReviews(): void {
    if (!this.employeeId) return;

    this.loading = true;
    this.performanceReviewService.getReviewsByEmployee(this.employeeId).subscribe({
      next: (reviews) => {
        this.reviews = reviews;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading reviews:', error);
        this.errorMessage = 'Failed to load performance reviews';
        this.loading = false;
      }
    });
  }

  createReview(): void {
    if (!this.employeeId || !this.newReview.quarter || !this.newReview.rating) return;

    this.loading = true;
    this.errorMessage = '';

    const review: PerformanceReview = {
      employee: { id: this.employeeId },
      reviewer: { id: 1 }, // TODO: Get current user
      quarter: this.newReview.quarter!,
      rating: this.newReview.rating!,
      managerFeedback: this.newReview.managerFeedback || '',
      employeeSelfAssessment: this.newReview.employeeSelfAssessment || '',
      goals: this.newReview.goals || '',
      achievements: this.newReview.achievements || ''
    };

    this.performanceReviewService.createReview(review).subscribe({
      next: (savedReview) => {
        this.reviews.unshift(savedReview);
        this.showForm = false;
        this.resetForm();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error creating review:', error);
        this.errorMessage = 'Failed to create performance review';
        this.loading = false;
      }
    });
  }

  updateReview(review: PerformanceReview): void {
    this.performanceReviewService.updateReview(review.id!, review).subscribe({
      next: (updated) => {
        const index = this.reviews.findIndex(r => r.id === updated.id);
        if (index !== -1) {
          this.reviews[index] = updated;
        }
      },
      error: (error) => {
        console.error('Error updating review:', error);
        this.errorMessage = 'Failed to update performance review';
      }
    });
  }

  deleteReview(review: PerformanceReview): void {
    if (!confirm('Are you sure you want to delete this performance review?')) return;

    this.performanceReviewService.deleteReview(review.id!).subscribe({
      next: () => {
        this.reviews = this.reviews.filter(r => r.id !== review.id);
      },
      error: (error) => {
        console.error('Error deleting review:', error);
        this.errorMessage = 'Failed to delete performance review';
      }
    });
  }

  resetForm(): void {
    this.newReview = {
      quarter: 'Q1',
      rating: 3,
      managerFeedback: '',
      employeeSelfAssessment: '',
      goals: '',
      achievements: ''
    };
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}