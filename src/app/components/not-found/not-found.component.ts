import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="not-found-container">
      <mat-card class="not-found-card">
        <mat-card-content class="text-center">
          <mat-icon class="error-icon">search_off</mat-icon>
          <h1>404</h1>
          <h2>Page Not Found</h2>
          <p>The page you're looking for doesn't exist.</p>
          <div class="action-buttons">
            <button mat-raised-button color="primary" (click)="goHome()">
              <mat-icon>home</mat-icon>
              Go to Dashboard
            </button>
            <button mat-button (click)="goBack()">
              <mat-icon>arrow_back</mat-icon>
              Go Back
            </button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .not-found-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 64px);
      padding: 20px;
    }

    .not-found-card {
      max-width: 500px;
      padding: 40px;
    }

    .error-icon {
      font-size: 64px;
      color: #666;
      margin-bottom: 16px;
    }

    h1 {
      font-size: 4rem;
      color: #1976d2;
      margin: 0;
    }

    h2 {
      margin: 16px 0;
      color: #333;
    }

    p {
      margin-bottom: 24px;
      color: #666;
    }

    .action-buttons {
      display: flex;
      gap: 16px;
      justify-content: center;
    }

    @media (max-width: 480px) {
      .action-buttons {
        flex-direction: column;
      }
    }
  `]
})
export class NotFoundComponent {
  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/dashboard']);
  }

  goBack() {
    window.history.back();
  }
}