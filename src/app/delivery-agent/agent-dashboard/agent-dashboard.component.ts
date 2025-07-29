import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { ParcelService } from '../../services/parcel.service';
import { User } from '../../models';

@Component({
  selector: 'app-agent-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="agent-dashboard">
      <div class="dashboard-header">
        <h1>
          <mat-icon>local_shipping</mat-icon>
          Agent Dashboard
        </h1>
        <p>Welcome, {{ currentUser?.firstName }}! Manage your assigned parcels</p>
      </div>

      <div class="dashboard-cards">
        <mat-card class="dashboard-card">
          <mat-card-content>
            <div class="dashboard-card-icon">
              <mat-icon>assignment</mat-icon>
            </div>
            <div class="dashboard-card-title">Assigned Parcels</div>
            <div class="dashboard-card-value">{{ assignedParcels }}</div>
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
            <div class="dashboard-card-title">Delivered Today</div>
            <div class="dashboard-card-value">{{ deliveredToday }}</div>
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
              <button mat-raised-button color="primary" (click)="viewAssignedParcels()">
                <mat-icon>assignment</mat-icon>
                View Assigned Parcels
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
    .agent-dashboard {
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
      .agent-dashboard {
        padding: 10px;
      }

      .action-buttons {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AgentDashboardComponent implements OnInit {
  currentUser: User | null = null;
  assignedParcels = 0;
  inTransitParcels = 0;
  deliveredToday = 0;

  constructor(
    private authService: AuthService,
    private parcelService: ParcelService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.loadAgentData();
  }

  loadAgentData() {
    if (this.currentUser) {
      this.parcelService.getParcelsByAgentId(this.currentUser.id).subscribe({
        next: (parcels) => {
          this.assignedParcels = parcels.length;
          this.inTransitParcels = parcels.filter(p => 
            p.status === 'in_transit' || p.status === 'picked' || p.status === 'out_for_delivery'
          ).length;
          
          // Count deliveries today
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          this.deliveredToday = parcels.filter(p => 
            p.status === 'delivered' && 
            p.actualDelivery && 
            new Date(p.actualDelivery) >= today
          ).length;
        }
      });
    }
  }

  viewAssignedParcels() {
    this.router.navigate(['/agent/assigned-parcels']);
  }

  trackParcel() {
    this.router.navigate(['/track']);
  }
}