import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Dashboard } from './components/dashboard/dashboard';
import { Employees } from './components/employees/employees';
import { EmployeeForm } from './components/employee-form/employee-form';
import { Departments } from './components/departments/departments';
import { DepartmentForm } from './components/department-form/department-form';
import { Roles } from './components/roles/roles';
import { RoleForm } from './components/role-form/role-form';
import { Attendance } from './components/attendance/attendance';
import { AttendanceForm } from './components/attendance-form/attendance-form';
import { Leaves } from './components/leaves/leaves';
import { LeaveForm } from './components/leave-form/leave-form';
import { Salaries } from './components/salaries/salaries';
import { SalaryForm } from './components/salary-form/salary-form';
import { DocumentsComponent } from './components/documents/documents';
import { PerformanceReviewsComponent } from './components/performance-reviews/performance-reviews';
import { ProfileComponent } from './components/profile/profile';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'employees', component: Employees, canActivate: [authGuard] },
  { path: 'employees/add', component: EmployeeForm, canActivate: [authGuard] },
  { path: 'employees/edit/:id', component: EmployeeForm, canActivate: [authGuard] },
  { path: 'departments', component: Departments, canActivate: [authGuard] },
  { path: 'departments/add', component: DepartmentForm, canActivate: [authGuard] },
  { path: 'departments/edit/:id', component: DepartmentForm, canActivate: [authGuard] },
  { path: 'roles', component: Roles, canActivate: [authGuard] },
  { path: 'roles/add', component: RoleForm, canActivate: [authGuard] },
  { path: 'roles/edit/:id', component: RoleForm, canActivate: [authGuard] },
  { path: 'attendance', component: Attendance, canActivate: [authGuard] },
  { path: 'attendance/add', component: AttendanceForm, canActivate: [authGuard] },
  { path: 'attendance/edit/:id', component: AttendanceForm, canActivate: [authGuard] },
  { path: 'leaves', component: Leaves, canActivate: [authGuard] },
  { path: 'leaves/add', component: LeaveForm, canActivate: [authGuard] },
  { path: 'leaves/edit/:id', component: LeaveForm, canActivate: [authGuard] },
  { path: 'salaries', component: Salaries, canActivate: [authGuard] },
  { path: 'salaries/add', component: SalaryForm, canActivate: [authGuard] },
  { path: 'salaries/edit/:id', component: SalaryForm, canActivate: [authGuard] },
  { path: 'employees/:employeeId/documents', component: DocumentsComponent, canActivate: [authGuard] },
  { path: 'employees/:employeeId/performance', component: PerformanceReviewsComponent, canActivate: [authGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '/login' }
];
