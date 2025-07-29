import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { ParcelService } from '../../services/parcel.service';
import { Parcel, ParcelStatus } from '../../models';

@Component({
  selector: 'app-track-parcel',
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
    MatSnackBarModule,
    MatChipsModule
  ],
  template: `
    <div class="track-container">
      <mat-card class="track-card">
        <mat-card-header>
          <mat-card-title class="text-center">
            <mat-icon class="track-icon">track_changes</mat-icon>
            <h2>Track Your Parcel</h2>
          </mat-card-title>
          <mat-card-subtitle class="text-center">
            Enter your tracking ID to get real-time updates
          </mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="trackForm" (ngSubmit)="onTrack()" class="track-form">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Tracking ID</mat-label>
              <input matInput 
                     formControlName="trackingId"
                     placeholder="Enter your tracking ID (e.g., PMS001234567)">
              <mat-icon matSuffix>search</mat-icon>
              <mat-error *ngIf="trackForm.get('trackingId')?.hasError('required')">
                Tracking ID is required
              </mat-error>
            </mat-form-field>

            <button mat-raised-button 
                    color="primary" 
                    type="submit"
                    class="full-width track-button"
                    [disabled]="trackForm.invalid || isLoading">
              <mat-spinner diameter="20" *ngIf="isLoading"></mat-spinner>
              <mat-icon *ngIf="!isLoading">search</mat-icon>
              <span *ngIf="!isLoading">Track Parcel</span>
            </button>
          </form>

          <!-- Parcel Information -->
          <div *ngIf="parcel" class="parcel-info">
            <mat-card class="info-card">
              <mat-card-header>
                <mat-card-title>
                  <mat-icon>inventory</mat-icon>
                  Parcel Details
                </mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <div class="detail-row">
                  <strong>Tracking ID:</strong> {{ parcel.trackingId }}
                </div>
                <div class="detail-row">
                  <strong>Status:</strong> 
                  <mat-chip [ngClass]="'status-' + parcel.status.replace('_', '-')">
                    {{ getStatusLabel(parcel.status) }}
                  </mat-chip>
                </div>
                <div class="detail-row">
                  <strong>From:</strong> {{ parcel.senderName }} ({{ parcel.senderAddress.city }}, {{ parcel.senderAddress.state }})
                </div>
                <div class="detail-row">
                  <strong>To:</strong> {{ parcel.receiverName }} ({{ parcel.receiverAddress.city }}, {{ parcel.receiverAddress.state }})
                </div>
                <div class="detail-row">
                  <strong>Booked:</strong> {{ parcel.bookedAt | date:'medium' }}
                </div>
                <div class="detail-row">
                  <strong>Expected Delivery:</strong> {{ parcel.expectedDelivery | date:'medium' }}
                </div>
                <div class="detail-row" *ngIf="parcel.actualDelivery">
                  <strong>Delivered:</strong> {{ parcel.actualDelivery | date:'medium' }}
                </div>
              </mat-card-content>
            </mat-card>

            <!-- Tracking Timeline -->
            <mat-card class="timeline-card">
              <mat-card-header>
                <mat-card-title>
                  <mat-icon>timeline</mat-icon>
                  Tracking History
                </mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <div class="tracking-timeline">
                  <div *ngFor="let tracking of parcel.trackingHistory; let last = last" 
                       class="timeline-item"
                       [ngClass]="{
                         'timeline-completed': isStatusCompleted(tracking.status),
                         'timeline-active': tracking.status === parcel.status,
                         'timeline-pending': !isStatusCompleted(tracking.status) && tracking.status !== parcel.status
                       }">
                    <div class="timeline-icon">
                      <mat-icon>{{ getStatusIcon(tracking.status) }}</mat-icon>
                    </div>
                    <div class="timeline-content">
                      <div class="timeline-header">
                        <strong>{{ getStatusLabel(tracking.status) }}</strong>
                        <span class="timeline-date">{{ tracking.timestamp | date:'short' }}</span>
                      </div>
                      <div class="timeline-description">{{ tracking.description }}</div>
                      <div class="timeline-location">
                        <mat-icon>location_on</mat-icon>
                        {{ tracking.location }}
                      </div>
                      <div class="timeline-updater">Updated by: {{ tracking.updatedByName }}</div>
                    </div>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          </div>

          <!-- No Results -->
          <div *ngIf="searched && !parcel" class="no-results">
            <mat-icon>search_off</mat-icon>
            <h3>No parcel found</h3>
            <p>Please check your tracking ID and try again</p>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .track-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }

    .track-card {
      margin-bottom: 20px;
    }

    .track-icon {
      font-size: 48px;
      color: #1976d2;
      margin-bottom: 16px;
    }

    .track-form {
      margin: 24px 0;
    }

    .track-button {
      height: 48px;
      font-size: 16px;
      margin-top: 16px;
    }

    .parcel-info {
      margin-top: 24px;
    }

    .info-card, .timeline-card {
      margin-bottom: 20px;
    }

    .detail-row {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      padding: 8px 0;
      border-bottom: 1px solid #f0f0f0;
    }

    .detail-row:last-child {
      border-bottom: none;
    }

    .detail-row strong {
      min-width: 140px;
      margin-right: 16px;
    }

    .timeline-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .timeline-date {
      font-size: 12px;
      color: #666;
    }

    .timeline-description {
      margin-bottom: 8px;
      color: #333;
    }

    .timeline-location {
      display: flex;
      align-items: center;
      font-size: 14px;
      color: #666;
      margin-bottom: 4px;
    }

    .timeline-location mat-icon {
      font-size: 16px;
      margin-right: 4px;
    }

    .timeline-updater {
      font-size: 12px;
      color: #999;
    }

    .no-results {
      text-align: center;
      padding: 40px 20px;
      color: #666;
    }

    .no-results mat-icon {
      font-size: 64px;
      margin-bottom: 16px;
    }

    .no-results h3 {
      margin-bottom: 8px;
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
      .track-container {
        padding: 10px;
      }

      .timeline-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .detail-row {
        flex-direction: column;
        align-items: flex-start;
      }

      .detail-row strong {
        min-width: auto;
        margin-right: 0;
        margin-bottom: 4px;
      }
    }
  `]
})
export class TrackParcelComponent {
  trackForm: FormGroup;
  isLoading = false;
  parcel: Parcel | null = null;
  searched = false;

  constructor(
    private formBuilder: FormBuilder,
    private parcelService: ParcelService,
    private snackBar: MatSnackBar
  ) {
    this.trackForm = this.formBuilder.group({
      trackingId: ['', [Validators.required]]
    });
  }

  onTrack() {
    if (this.trackForm.valid) {
      this.isLoading = true;
      this.searched = false;
      this.parcel = null;

      const trackingId = this.trackForm.value.trackingId.trim();

      this.parcelService.getParcelByTrackingId(trackingId).subscribe({
        next: (parcel) => {
          this.isLoading = false;
          this.searched = true;
          this.parcel = parcel;
          
          if (!parcel) {
            this.snackBar.open('No parcel found with this tracking ID', 'Close', {
              duration: 3000
            });
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.searched = true;
          this.snackBar.open('Error tracking parcel', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
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

  getStatusIcon(status: ParcelStatus): string {
    switch (status) {
      case ParcelStatus.BOOKED: return 'book_online';
      case ParcelStatus.PICKED: return 'local_shipping';
      case ParcelStatus.IN_TRANSIT: return 'flight';
      case ParcelStatus.OUT_FOR_DELIVERY: return 'delivery_dining';
      case ParcelStatus.DELIVERED: return 'check_circle';
      case ParcelStatus.CANCELLED: return 'cancel';
      case ParcelStatus.RETURNED: return 'keyboard_return';
      default: return 'info';
    }
  }

  isStatusCompleted(status: ParcelStatus): boolean {
    const currentStatus = this.parcel?.status;
    const statusOrder = [
      ParcelStatus.BOOKED,
      ParcelStatus.PICKED,
      ParcelStatus.IN_TRANSIT,
      ParcelStatus.OUT_FOR_DELIVERY,
      ParcelStatus.DELIVERED
    ];

    const currentIndex = statusOrder.indexOf(currentStatus!);
    const checkIndex = statusOrder.indexOf(status);

    return checkIndex < currentIndex || status === ParcelStatus.DELIVERED;
  }
}