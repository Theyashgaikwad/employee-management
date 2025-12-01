import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentService, Document } from '../../services/document.service';
import { EmployeeService } from '../../services/employee.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-documents',
  imports: [CommonModule, FormsModule],
  templateUrl: './documents.html',
  styleUrl: './documents.css',
})
export class DocumentsComponent implements OnInit {
  documentService = inject(DocumentService);
  employeeService = inject(EmployeeService);
  authService = inject(AuthService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  employeeId: number | null = null;
  documents: Document[] = [];
  loading = false;
  errorMessage = '';
  selectedFile: File | null = null;
  expiryDate = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('employeeId');
    if (id) {
      this.employeeId = Number(id);
      this.loadDocuments();
    }
  }

  loadDocuments(): void {
    if (!this.employeeId) return;

    this.loading = true;
    this.documentService.getDocumentsByEmployee(this.employeeId).subscribe({
      next: (docs) => {
        this.documents = docs;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading documents:', error);
        this.errorMessage = 'Failed to load documents';
        this.loading = false;
      }
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  uploadDocument(): void {
    if (!this.selectedFile || !this.employeeId) return;

    this.loading = true;
    this.errorMessage = '';

    this.documentService.uploadDocument(this.employeeId, this.selectedFile, this.expiryDate || undefined).subscribe({
      next: (doc) => {
        this.documents.push(doc);
        this.selectedFile = null;
        this.expiryDate = '';
        this.loading = false;
        // Reset file input
        const fileInput = document.getElementById('fileInput') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      },
      error: (error) => {
        console.error('Error uploading document:', error);
        this.errorMessage = 'Failed to upload document';
        this.loading = false;
      }
    });
  }

  downloadDocument(doc: Document): void {
    this.documentService.downloadDocument(doc.id!).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = doc.fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      },
      error: (error) => {
        console.error('Error downloading document:', error);
        this.errorMessage = 'Failed to download document';
      }
    });
  }

  deleteDocument(doc: Document): void {
    if (!confirm('Are you sure you want to delete this document?')) return;

    this.documentService.deleteDocument(doc.id!).subscribe({
      next: () => {
        this.documents = this.documents.filter(d => d.id !== doc.id);
      },
      error: (error) => {
        console.error('Error deleting document:', error);
        this.errorMessage = 'Failed to delete document';
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}