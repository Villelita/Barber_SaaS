import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './auth/login.component';
import { RegisterComponent } from './auth/register.component';
import { BusinessListComponent } from './business/business-list/business-list.component';
import { EmployeeListComponent } from './business/employees/employee-list/employee-list.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'employees', component: EmployeeListComponent },
      { path: 'business-list', component: BusinessListComponent },
      { path: 'settings', component: DashboardComponent }, // Placeholder
      { path: 'profile', component: DashboardComponent }, // Placeholder
      { path: '', redirectTo: 'business-list', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
