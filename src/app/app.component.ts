import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { Observable, filter } from 'rxjs';
import { AuthService } from './services/auth.service';
import { User, UserRole } from './models';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule
  ],
  template: `
    <div class="app-container">
      <mat-toolbar color="primary" class="app-toolbar">
        <button mat-icon-button (click)="toggleSidenav()" *ngIf="currentUser$ | async">
          <mat-icon>menu</mat-icon>
        </button>
        
        <span class="app-title">Parcel Management System</span>
        
        <span class="spacer"></span>
        
        <ng-container *ngIf="currentUser$ | async as user; else loginButtons">
          <button mat-button [matMenuTriggerFor]="userMenu">
            <mat-icon>account_circle</mat-icon>
            {{ user.firstName }} {{ user.lastName }}
            <mat-icon>arrow_drop_down</mat-icon>
          </button>
          <mat-menu #userMenu="matMenu">
            <button mat-menu-item (click)="goToProfile()">
              <mat-icon>person</mat-icon>
              Profile
            </button>
            <button mat-menu-item (click)="logout()">
              <mat-icon>logout</mat-icon>
              Logout
            </button>
          </mat-menu>
        </ng-container>
        
        <ng-template #loginButtons>
          <button mat-button (click)="goToLogin()">Login</button>
          <button mat-button (click)="goToRegister()">Register</button>
        </ng-template>
      </mat-toolbar>

      <mat-sidenav-container class="sidenav-container">
        <mat-sidenav 
          #sidenav 
          mode="side" 
          opened="false"
          class="sidenav"
          *ngIf="currentUser$ | async as user">
          
          <mat-nav-list>
            <!-- Common navigation -->
            <a mat-list-item (click)="navigate('/dashboard')" class="nav-item">
              <mat-icon matListItemIcon>dashboard</mat-icon>
              <span matListItemTitle>Dashboard</span>
            </a>
            
            <a mat-list-item (click)="navigate('/track')" class="nav-item">
              <mat-icon matListItemIcon>track_changes</mat-icon>
              <span matListItemTitle>Track Parcel</span>
            </a>

            <mat-divider></mat-divider>

            <!-- Admin navigation -->
            <ng-container *ngIf="user.role === 'admin'">
              <h3 matSubheader>Admin Panel</h3>
              <a mat-list-item (click)="navigate('/admin')" class="nav-item">
                <mat-icon matListItemIcon>admin_panel_settings</mat-icon>
                <span matListItemTitle>Admin Dashboard</span>
              </a>
              <a mat-list-item (click)="navigate('/admin/parcels')" class="nav-item">
                <mat-icon matListItemIcon>inventory</mat-icon>
                <span matListItemTitle>Manage Parcels</span>
              </a>
              <a mat-list-item (click)="navigate('/admin/users')" class="nav-item">
                <mat-icon matListItemIcon>people</mat-icon>
                <span matListItemTitle>Manage Users</span>
              </a>
              <a mat-list-item (click)="navigate('/admin/agents')" class="nav-item">
                <mat-icon matListItemIcon>delivery_dining</mat-icon>
                <span matListItemTitle>Manage Agents</span>
              </a>
            </ng-container>

            <!-- Customer navigation -->
            <ng-container *ngIf="user.role === 'customer'">
              <h3 matSubheader>Customer Panel</h3>
              <a mat-list-item (click)="navigate('/customer')" class="nav-item">
                <mat-icon matListItemIcon>person</mat-icon>
                <span matListItemTitle>My Dashboard</span>
              </a>
              <a mat-list-item (click)="navigate('/customer/book-parcel')" class="nav-item">
                <mat-icon matListItemIcon>add_box</mat-icon>
                <span matListItemTitle>Book Parcel</span>
              </a>
              <a mat-list-item (click)="navigate('/customer/my-parcels')" class="nav-item">
                <mat-icon matListItemIcon>local_shipping</mat-icon>
                <span matListItemTitle>My Parcels</span>
              </a>
            </ng-container>

            <!-- Delivery Agent navigation -->
            <ng-container *ngIf="user.role === 'delivery_agent'">
              <h3 matSubheader>Agent Panel</h3>
              <a mat-list-item (click)="navigate('/agent')" class="nav-item">
                <mat-icon matListItemIcon>local_shipping</mat-icon>
                <span matListItemTitle>Agent Dashboard</span>
              </a>
              <a mat-list-item (click)="navigate('/agent/assigned-parcels')" class="nav-item">
                <mat-icon matListItemIcon>assignment</mat-icon>
                <span matListItemTitle>Assigned Parcels</span>
              </a>
            </ng-container>
          </mat-nav-list>
        </mat-sidenav>

        <mat-sidenav-content class="main-content">
          <router-outlet></router-outlet>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `,
  styles: [`
    .app-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .app-toolbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
    }

    .app-title {
      font-size: 1.2rem;
      font-weight: 500;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .sidenav-container {
      flex: 1;
      margin-top: 64px;
    }

    .sidenav {
      width: 280px;
      background: #fafafa;
    }

    .main-content {
      padding: 20px;
      background: #f5f5f5;
      min-height: calc(100vh - 64px);
    }

    .nav-item {
      margin: 4px 0;
      border-radius: 8px;
    }

    .nav-item:hover {
      background-color: rgba(0, 0, 0, 0.04);
    }

    mat-list-item {
      height: 48px !important;
    }

    .mat-mdc-list-item-title {
      font-weight: 500;
    }

    h3[matSubheader] {
      color: #666;
      font-weight: 600;
      margin: 16px 0 8px 0;
    }
  `]
})
export class AppComponent implements OnInit {
  title = 'Parcel Management System';
  currentUser$: Observable<User | null>;
  sidenavOpened = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit() {
    // Close sidenav on route change for mobile
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        if (window.innerWidth < 768) {
          this.sidenavOpened = false;
        }
      });
  }

  toggleSidenav() {
    this.sidenavOpened = !this.sidenavOpened;
  }

  navigate(route: string) {
    this.router.navigate([route]);
    if (window.innerWidth < 768) {
      this.sidenavOpened = false;
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  goToProfile() {
    const user = this.authService.getCurrentUser();
    if (user) {
      switch (user.role) {
        case UserRole.ADMIN:
          this.router.navigate(['/admin/profile']);
          break;
        case UserRole.CUSTOMER:
          this.router.navigate(['/customer/profile']);
          break;
        case UserRole.DELIVERY_AGENT:
          this.router.navigate(['/agent/profile']);
          break;
      }
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}