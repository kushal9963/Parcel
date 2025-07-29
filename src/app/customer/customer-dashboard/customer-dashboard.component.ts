import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { ParcelService } from '../../services/parcel.service';
import { User, Parcel } from '../../models';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="customer-dashboard">
      <div class="dashboard-header">
        <h1>
          <mat-icon>person</mat-icon>
          Welcome, {{ currentUser?.firstName }}!
        </h1>
        <p>Manage your parcels and track shipments</p>
      </div>

      <div class="dashboard-cards">
        <mat-card class="dashboard-card">
          <mat-card-content>
            <div class="dashboard-card-icon">
              <mat-icon>inventory</mat-icon>
            </div>
            <div class="dashboard-card-title">My Parcels</div>
            <div class="dashboard-card-value">{{ totalParcels }}</div>
          </mat-card-content>
        </mat-card>

        <mat-card class="dashboard-card">
          <mat-card-content>
            <div class="dashboard-card-icon">
              <mat-icon>local_shipping</mat-icon>
            </div>
            <div class="dashboard-card-title">In Transit</div>
            <div class="dashboard-card-value">{{ inTransitParcels }}</div>
          </mat-card-content>
        </mat-card>

        <mat-card class="dashboard-card">
          <mat-card-content>
            <div class="dashboard-card-icon">
              <mat-icon>check_circle</mat-icon>
            </div>
            <div class="dashboard-card-title">Delivered</div>
            <div class="dashboard-card-value">{{ deliveredParcels }}</div>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="quick-actions">
        <mat-card>
          <mat-card-header>
            <mat-card-title>Quick Actions</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="action-buttons">
              <button mat-raised-button color="primary" (click)="bookParcel()">
                <mat-icon>add_box</mat-icon>
                Book New Parcel
              </button>
              <button mat-raised-button (click)="viewMyParcels()">
                <mat-icon>inventory</mat-icon>
                View My Parcels
              </button>
              <button mat-raised-button (click)="trackParcel()">
                <mat-icon>track_changes</mat-icon>
                Track Parcel
              </button>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .customer-dashboard {
      padding: 20px;
      max-width: 1000px;
      margin: 0 auto;
    }

    .dashboard-header {
      margin-bottom: 32px;
    }

    .dashboard-header h1 {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 0 0 8px 0;
      color: #1976d2;
    }

    .dashboard-header p {
      color: #666;
      margin: 0;
    }

    .dashboard-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }

    .quick-actions {
      margin-bottom: 24px;
    }

    .action-buttons {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 16px;
    }

    .action-buttons button {
      height: 48px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    @media (max-width: 768px) {
      .customer-dashboard {
        padding: 10px;
      }

      .action-buttons {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class CustomerDashboardComponent implements OnInit {
  currentUser: User | null = null;
  totalParcels = 0;
  inTransitParcels = 0;
  deliveredParcels = 0;

  constructor(
    private authService: AuthService,
    private parcelService: ParcelService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.loadCustomerData();
  }

  loadCustomerData() {
    if (this.currentUser) {
      this.parcelService.getParcelsByCustomerId(this.currentUser.id).subscribe({
        next: (parcels) => {
          this.totalParcels = parcels.length;
          this.inTransitParcels = parcels.filter(p => 
            p.status === 'in_transit' || p.status === 'picked' || p.status === 'out_for_delivery'
          ).length;
          this.deliveredParcels = parcels.filter(p => p.status === 'delivered').length;
        }
      });
    }
  }

  bookParcel() {
    this.router.navigate(['/customer/book-parcel']);
  }

  viewMyParcels() {
    this.router.navigate(['/customer/my-parcels']);
  }

  trackParcel() {
    this.router.navigate(['/track']);
  }
}