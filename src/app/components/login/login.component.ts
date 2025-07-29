import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { UserRole } from '../../models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <mat-card-title class="text-center">
            <mat-icon class="login-icon">local_shipping</mat-icon>
            <h2>Login to PMS</h2>
          </mat-card-title>
          <mat-card-subtitle class="text-center">
            Welcome back! Please sign in to your account.
          </mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput 
                     type="email" 
                     formControlName="email"
                     placeholder="Enter your email">
              <mat-icon matSuffix>email</mat-icon>
              <mat-error *ngIf="loginForm.get('email')?.hasError('required')">
                Email is required
              </mat-error>
              <mat-error *ngIf="loginForm.get('email')?.hasError('email')">
                Please enter a valid email
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <input matInput 
                     [type]="hidePassword ? 'password' : 'text'"
                     formControlName="password"
                     placeholder="Enter your password">
              <button mat-icon-button 
                      matSuffix 
                      (click)="hidePassword = !hidePassword"
                      type="button">
                <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>
              <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
                Password is required
              </mat-error>
            </mat-form-field>

            <div class="demo-credentials">
              <h4>Demo Credentials:</h4>
              <div class="credential-item">
                <strong>Admin:</strong> admin@pms.com / admin123
                <button mat-button type="button" (click)="fillCredentials('admin')" class="ml-2">
                  <mat-icon>login</mat-icon> Use
                </button>
              </div>
              <div class="credential-item">
                <strong>Customer:</strong> customer@pms.com / customer123
                <button mat-button type="button" (click)="fillCredentials('customer')" class="ml-2">
                  <mat-icon>login</mat-icon> Use
                </button>
              </div>
              <div class="credential-item">
                <strong>Agent:</strong> agent@pms.com / agent123
                <button mat-button type="button" (click)="fillCredentials('agent')" class="ml-2">
                  <mat-icon>login</mat-icon> Use
                </button>
              </div>
            </div>

            <button mat-raised-button 
                    color="primary" 
                    type="submit"
                    class="full-width login-button"
                    [disabled]="loginForm.invalid || isLoading">
              <mat-spinner diameter="20" *ngIf="isLoading"></mat-spinner>
              <span *ngIf="!isLoading">Sign In</span>
            </button>
          </form>
        </mat-card-content>

        <mat-card-actions class="text-center">
          <p>Don't have an account? 
            <button mat-button color="primary" (click)="goToRegister()">
              Sign Up
            </button>
          </p>
          <p>
            <button mat-button color="accent" (click)="goToTracking()">
              Track Parcel
            </button>
          </p>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 64px);
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .login-card {
      width: 100%;
      max-width: 450px;
      padding: 24px;
      border-radius: 16px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    }

    .login-icon {
      font-size: 48px;
      color: #1976d2;
      margin-bottom: 16px;
    }

    .login-form {
      margin-top: 24px;
    }

    .login-form mat-form-field {
      margin-bottom: 16px;
    }

    .login-button {
      height: 48px;
      font-size: 16px;
      margin-top: 24px;
    }

    .demo-credentials {
      background: #f5f5f5;
      padding: 16px;
      border-radius: 8px;
      margin: 16px 0;
      border-left: 4px solid #2196f3;
    }

    .demo-credentials h4 {
      margin: 0 0 12px 0;
      color: #333;
      font-size: 14px;
    }

    .credential-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
      font-size: 12px;
      padding: 4px 0;
    }

    .credential-item:last-child {
      margin-bottom: 0;
    }

    mat-card-actions {
      padding-top: 16px;
    }

    mat-card-actions p {
      margin: 8px 0;
    }

    @media (max-width: 480px) {
      .login-container {
        padding: 10px;
      }
      
      .login-card {
        padding: 16px;
      }
      
      .credential-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
      }
    }
  `]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  hidePassword = true;
  isLoading = false;
  returnUrl: string;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  ngOnInit() {
    // Redirect if already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate([this.returnUrl]);
    }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.snackBar.open('Login successful!', 'Close', { duration: 3000 });
          
          // Redirect based on user role
          const user = response.user;
          switch (user.role) {
            case UserRole.ADMIN:
              this.router.navigate(['/admin']);
              break;
            case UserRole.CUSTOMER:
              this.router.navigate(['/customer']);
              break;
            case UserRole.DELIVERY_AGENT:
              this.router.navigate(['/agent']);
              break;
            default:
              this.router.navigate([this.returnUrl]);
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.snackBar.open(error.message || 'Login failed', 'Close', { 
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  fillCredentials(type: string) {
    switch (type) {
      case 'admin':
        this.loginForm.patchValue({
          email: 'admin@pms.com',
          password: 'admin123'
        });
        break;
      case 'customer':
        this.loginForm.patchValue({
          email: 'customer@pms.com',
          password: 'customer123'
        });
        break;
      case 'agent':
        this.loginForm.patchValue({
          email: 'agent@pms.com',
          password: 'agent123'
        });
        break;
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  goToTracking() {
    this.router.navigate(['/track']);
  }
}