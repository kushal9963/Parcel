import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { UserRole } from './models';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  
  // Public routes
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'track',
    loadComponent: () => import('./components/track-parcel/track-parcel.component').then(m => m.TrackParcelComponent)
  },
  
  // Protected routes
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  
  // Admin routes
  {
    path: 'admin',
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRoles: [UserRole.ADMIN] },
    children: [
      {
        path: '',
        loadComponent: () => import('./admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'parcels',
        loadComponent: () => import('./admin/parcel-management/parcel-management.component').then(m => m.ParcelManagementComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./admin/user-management/user-management.component').then(m => m.UserManagementComponent)
      },
      {
        path: 'agents',
        loadComponent: () => import('./admin/agent-management/agent-management.component').then(m => m.AgentManagementComponent)
      }
    ]
  },
  
  // Customer routes
  {
    path: 'customer',
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRoles: [UserRole.CUSTOMER] },
    children: [
      {
        path: '',
        loadComponent: () => import('./customer/customer-dashboard/customer-dashboard.component').then(m => m.CustomerDashboardComponent)
      },
      {
        path: 'book-parcel',
        loadComponent: () => import('./customer/book-parcel/book-parcel.component').then(m => m.BookParcelComponent)
      },
      {
        path: 'my-parcels',
        loadComponent: () => import('./customer/my-parcels/my-parcels.component').then(m => m.MyParcelsComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./customer/customer-profile/customer-profile.component').then(m => m.CustomerProfileComponent)
      }
    ]
  },
  
  // Delivery Agent routes
  {
    path: 'agent',
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRoles: [UserRole.DELIVERY_AGENT] },
    children: [
      {
        path: '',
        loadComponent: () => import('./delivery-agent/agent-dashboard/agent-dashboard.component').then(m => m.AgentDashboardComponent)
      },
      {
        path: 'assigned-parcels',
        loadComponent: () => import('./delivery-agent/assigned-parcels/assigned-parcels.component').then(m => m.AssignedParcelsComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./delivery-agent/agent-profile/agent-profile.component').then(m => m.AgentProfileComponent)
      }
    ]
  },
  
  // Error routes
  {
    path: 'unauthorized',
    loadComponent: () => import('./components/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent)
  },
  {
    path: '**',
    loadComponent: () => import('./components/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];