import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { Observable, forkJoin, map } from 'rxjs';
import { ParcelService } from '../../services/parcel.service';
import { AuthService } from '../../services/auth.service';
import { Parcel, ParcelStatus, User } from '../../models';

interface DashboardStats {
  totalParcels: number;
  pendingParcels: number;
  inTransitParcels: number;
  deliveredParcels: number;
  totalRevenue: number;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule
  ],
  template: `
    <div class="admin-dashboard">
      <div class="dashboard-header">
        <h1>
          <mat-icon>admin_panel_settings</mat-icon>
          Admin Dashboard
        </h1>
        <p>Welcome back, {{ currentUser?.firstName }}! Here's your system overview.</p>
      </div>

      <!-- Dashboard Statistics -->
      <div class="dashboard-cards">
        <mat-card class="dashboard-card stat-card-primary">
          <mat-card-content>
            <div class="dashboard-card-icon">
              <mat-icon>inventory</mat-icon>
            </div>
            <div class="dashboard-card-title">Total Parcels</div>
            <div class="dashboard-card-value">{{ stats?.totalParcels || 0 }}</div>
          </mat-card-content>
        </mat-card>

        <mat-card class="dashboard-card stat-card-warning">
          <mat-card-content>
            <div class="dashboard-card-icon">
              <mat-icon>pending</mat-icon>
            </div>
            <div class="dashboard-card-title">Pending Parcels</div>
            <div class="dashboard-card-value">{{ stats?.pendingParcels || 0 }}</div>
          </mat-card-content>
        </mat-card>

        <mat-card class="dashboard-card stat-card-info">
          <mat-card-content>
            <div class="dashboard-card-icon">
              <mat-icon>local_shipping</mat-icon>
            </div>
            <div class="dashboard-card-title">In Transit</div>
            <div class="dashboard-card-value">{{ stats?.inTransitParcels || 0 }}</div>
          </mat-card-content>
        </mat-card>

        <mat-card class="dashboard-card stat-card-success">
          <mat-card-content>
            <div class="dashboard-card-icon">
              <mat-icon>check_circle</mat-icon>
            </div>
            <div class="dashboard-card-title">Delivered</div>
            <div class="dashboard-card-value">{{ stats?.deliveredParcels || 0 }}</div>
          </mat-card-content>
        </mat-card>

        <mat-card class="dashboard-card stat-card-accent">
          <mat-card-content>
            <div class="dashboard-card-icon">
              <mat-icon>attach_money</mat-icon>
            </div>
            <div class="dashboard-card-title">Total Revenue</div>
            <div class="dashboard-card-value">\${{ stats?.totalRevenue?.toFixed(2) || '0.00' }}</div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Quick Actions -->
      <mat-card class="quick-actions-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>flash_on</mat-icon>
            Quick Actions
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="quick-actions">
            <button mat-raised-button color="primary" (click)="navigateTo('/admin/parcels')">
              <mat-icon>inventory</mat-icon>
              Manage Parcels
            </button>
            <button mat-raised-button color="accent" (click)="navigateTo('/admin/users')">
              <mat-icon>people</mat-icon>
              Manage Users
            </button>
            <button mat-raised-button (click)="navigateTo('/admin/agents')">
              <mat-icon>delivery_dining</mat-icon>
              Manage Agents
            </button>
            <button mat-raised-button color="warn" (click)="navigateTo('/track')">
              <mat-icon>track_changes</mat-icon>
              Track Parcel
            </button>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Recent Parcels -->
      <mat-card class="recent-parcels-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>history</mat-icon>
            Recent Parcels
          </mat-card-title>
          <mat-card-subtitle>Latest parcel activities</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <div class="table-container">
            <table mat-table [dataSource]="recentParcels" class="recent-parcels-table">
              <ng-container matColumnDef="trackingId">
                <th mat-header-cell *matHeaderCellDef>Tracking ID</th>
                <td mat-cell *matCellDef="let parcel">{{ parcel.trackingId }}</td>
              </ng-container>

              <ng-container matColumnDef="sender">
                <th mat-header-cell *matHeaderCellDef>Sender</th>
                <td mat-cell *matCellDef="let parcel">{{ parcel.senderName }}</td>
              </ng-container>

              <ng-container matColumnDef="receiver">
                <th mat-header-cell *matHeaderCellDef>Receiver</th>
                <td mat-cell *matCellDef="let parcel">{{ parcel.receiverName }}</td>
              </ng-container>

              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Status</th>
                <td mat-cell *matCellDef="let parcel">
                  <mat-chip [ngClass]="'status-' + parcel.status.replace('_', '-')">
                    {{ getStatusLabel(parcel.status) }}
                  </mat-chip>
                </td>
              </ng-container>

              <ng-container matColumnDef="amount">
                <th mat-header-cell *matHeaderCellDef>Amount</th>
                <td mat-cell *matCellDef="let parcel">\${{ parcel.totalAmount.toFixed(2) }}</td>
              </ng-container>

              <ng-container matColumnDef="date">
                <th mat-header-cell *matHeaderCellDef>Date</th>
                <td mat-cell *matCellDef="let parcel">{{ parcel.bookedAt | date:'short' }}</td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let parcel">
                  <button mat-icon-button (click)="viewParcel(parcel.id)" matTooltip="View Details">
                    <mat-icon>visibility</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </div>

          <div class="table-actions">
            <button mat-button color="primary" (click)="navigateTo('/admin/parcels')">
              View All Parcels
              <mat-icon>arrow_forward</mat-icon>
            </button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .admin-dashboard {
      padding: 20px;
      max-width: 1200px;
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
      font-size: 16px;
    }

    .dashboard-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }

    .stat-card-primary .dashboard-card-value {
      color: #1976d2;
    }

    .stat-card-warning .dashboard-card-value {
      color: #f57c00;
    }

    .stat-card-info .dashboard-card-value {
      color: #7b1fa2;
    }

    .stat-card-success .dashboard-card-value {
      color: #388e3c;
    }

    .stat-card-accent .dashboard-card-value {
      color: #d32f2f;
    }

    .quick-actions-card, .recent-parcels-card {
      margin-bottom: 24px;
    }

    .quick-actions {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 16px;
    }

    .quick-actions button {
      height: 48px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .recent-parcels-table {
      width: 100%;
    }

    .table-actions {
      margin-top: 16px;
      text-align: right;
    }

    .table-actions button {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    /* Status chip colors */
    mat-chip.status-booked {
      background-color: #e3f2fd;
      color: #1976d2;
    }

    mat-chip.status-picked {
      background-color: #fff3e0;
      color: #f57c00;
    }

    mat-chip.status-in-transit {
      background-color: #f3e5f5;
      color: #7b1fa2;
    }

    mat-chip.status-out-for-delivery {
      background-color: #ffebee;
      color: #d32f2f;
    }

    mat-chip.status-delivered {
      background-color: #e8f5e8;
      color: #388e3c;
    }

    mat-chip.status-cancelled {
      background-color: #ffebee;
      color: #d32f2f;
    }

    mat-chip.status-returned {
      background-color: #f5f5f5;
      color: #616161;
    }

    @media (max-width: 768px) {
      .admin-dashboard {
        padding: 10px;
      }

      .dashboard-cards {
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 12px;
      }

      .quick-actions {
        grid-template-columns: 1fr;
      }

      .table-container {
        overflow-x: auto;
      }
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  currentUser: User | null = null;
  stats: DashboardStats | null = null;
  recentParcels: Parcel[] = [];
  displayedColumns: string[] = ['trackingId', 'sender', 'receiver', 'status', 'amount', 'date', 'actions'];

  constructor(
    private parcelService: ParcelService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.loadDashboardData();
  }

  loadDashboardData() {
    forkJoin({
      parcels: this.parcelService.getAllParcels()
    }).subscribe({
      next: ({ parcels }) => {
        this.calculateStats(parcels);
        this.recentParcels = parcels
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5);
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
      }
    });
  }

  calculateStats(parcels: Parcel[]) {
    this.stats = {
      totalParcels: parcels.length,
      pendingParcels: parcels.filter(p => p.status === ParcelStatus.BOOKED).length,
      inTransitParcels: parcels.filter(p => 
        p.status === ParcelStatus.IN_TRANSIT || 
        p.status === ParcelStatus.PICKED || 
        p.status === ParcelStatus.OUT_FOR_DELIVERY
      ).length,
      deliveredParcels: parcels.filter(p => p.status === ParcelStatus.DELIVERED).length,
      totalRevenue: parcels
        .filter(p => p.status === ParcelStatus.DELIVERED)
        .reduce((sum, p) => sum + p.totalAmount, 0)
    };
  }

  getStatusLabel(status: ParcelStatus): string {
    switch (status) {
      case ParcelStatus.BOOKED: return 'Booked';
      case ParcelStatus.PICKED: return 'Picked Up';
      case ParcelStatus.IN_TRANSIT: return 'In Transit';
      case ParcelStatus.OUT_FOR_DELIVERY: return 'Out for Delivery';
      case ParcelStatus.DELIVERED: return 'Delivered';
      case ParcelStatus.CANCELLED: return 'Cancelled';
      case ParcelStatus.RETURNED: return 'Returned';
      default: return status;
    }
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  viewParcel(parcelId: string) {
    this.router.navigate(['/admin/parcels'], { queryParams: { id: parcelId } });
  }
}