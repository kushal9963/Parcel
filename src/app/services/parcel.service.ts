import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Parcel, ParcelStatus, ParcelType, PaymentStatus, ParcelTracking, Address } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ParcelService {
  private parcelsSubject = new BehaviorSubject<Parcel[]>([]);
  public parcels$ = this.parcelsSubject.asObservable();

  // Mock data for demonstration
  private mockParcels: Parcel[] = [
    {
      id: '1',
      trackingId: 'PMS001234567',
      senderName: 'John Doe',
      senderPhone: '+1234567891',
      senderEmail: 'john@example.com',
      senderAddress: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'USA'
      },
      receiverName: 'Jane Smith',
      receiverPhone: '+1234567892',
      receiverEmail: 'jane@example.com',
      receiverAddress: {
        street: '456 Oak Ave',
        city: 'Los Angeles',
        state: 'CA',
        postalCode: '90001',
        country: 'USA'
      },
      type: ParcelType.PACKAGE,
      weight: 2.5,
      dimensions: { length: 30, width: 20, height: 15 },
      description: 'Electronics package',
      value: 500,
      status: ParcelStatus.IN_TRANSIT,
      trackingHistory: [
        {
          id: '1',
          status: ParcelStatus.BOOKED,
          timestamp: new Date('2024-01-01T10:00:00'),
          location: 'New York, NY',
          description: 'Parcel booked successfully',
          updatedBy: '2',
          updatedByName: 'John Doe'
        },
        {
          id: '2',
          status: ParcelStatus.PICKED,
          timestamp: new Date('2024-01-01T14:00:00'),
          location: 'New York, NY',
          description: 'Parcel picked up from sender',
          updatedBy: '3',
          updatedByName: 'Jane Smith'
        },
        {
          id: '3',
          status: ParcelStatus.IN_TRANSIT,
          timestamp: new Date('2024-01-02T08:00:00'),
          location: 'Chicago, IL',
          description: 'Parcel in transit',
          updatedBy: '3',
          updatedByName: 'Jane Smith'
        }
      ],
      customerId: '2',
      assignedAgentId: '3',
      assignedAgentName: 'Jane Smith',
      shippingCost: 25.99,
      additionalCharges: 5.00,
      totalAmount: 30.99,
      paymentStatus: PaymentStatus.PAID,
      bookedAt: new Date('2024-01-01T10:00:00'),
      expectedDelivery: new Date('2024-01-05T18:00:00'),
      createdAt: new Date('2024-01-01T10:00:00'),
      updatedAt: new Date('2024-01-02T08:00:00'),
      isInsured: true,
      insuranceAmount: 50
    }
  ];

  constructor() {
    this.parcelsSubject.next(this.mockParcels);
  }

  // Get all parcels (Admin only)
  getAllParcels(): Observable<Parcel[]> {
    return of([...this.mockParcels]);
  }

  // Get parcels by customer ID
  getParcelsByCustomerId(customerId: string): Observable<Parcel[]> {
    const customerParcels = this.mockParcels.filter(p => p.customerId === customerId);
    return of(customerParcels);
  }

  // Get parcels assigned to delivery agent
  getParcelsByAgentId(agentId: string): Observable<Parcel[]> {
    const agentParcels = this.mockParcels.filter(p => p.assignedAgentId === agentId);
    return of(agentParcels);
  }

  // Get parcel by tracking ID
  getParcelByTrackingId(trackingId: string): Observable<Parcel | null> {
    const parcel = this.mockParcels.find(p => p.trackingId === trackingId);
    return of(parcel || null);
  }

  // Get parcel by ID
  getParcelById(id: string): Observable<Parcel | null> {
    const parcel = this.mockParcels.find(p => p.id === id);
    return of(parcel || null);
  }

  // Create new parcel
  createParcel(parcelData: Partial<Parcel>): Observable<Parcel> {
    const newParcel: Parcel = {
      id: (this.mockParcels.length + 1).toString(),
      trackingId: this.generateTrackingId(),
      senderName: parcelData.senderName!,
      senderPhone: parcelData.senderPhone!,
      senderEmail: parcelData.senderEmail!,
      senderAddress: parcelData.senderAddress!,
      receiverName: parcelData.receiverName!,
      receiverPhone: parcelData.receiverPhone!,
      receiverEmail: parcelData.receiverEmail,
      receiverAddress: parcelData.receiverAddress!,
      type: parcelData.type!,
      weight: parcelData.weight!,
      dimensions: parcelData.dimensions!,
      description: parcelData.description!,
      value: parcelData.value!,
      status: ParcelStatus.BOOKED,
      trackingHistory: [{
        id: '1',
        status: ParcelStatus.BOOKED,
        timestamp: new Date(),
        location: parcelData.senderAddress!.city + ', ' + parcelData.senderAddress!.state,
        description: 'Parcel booked successfully',
        updatedBy: parcelData.customerId!,
        updatedByName: parcelData.senderName!
      }],
      customerId: parcelData.customerId!,
      shippingCost: this.calculateShippingCost(parcelData.weight!, parcelData.type!),
      additionalCharges: parcelData.isInsured ? 10 : 0,
      totalAmount: 0, // Will be calculated
      paymentStatus: PaymentStatus.PENDING,
      bookedAt: new Date(),
      expectedDelivery: this.calculateExpectedDelivery(),
      createdAt: new Date(),
      updatedAt: new Date(),
      specialInstructions: parcelData.specialInstructions,
      isInsured: parcelData.isInsured || false,
      insuranceAmount: parcelData.insuranceAmount
    };

    newParcel.totalAmount = newParcel.shippingCost + newParcel.additionalCharges;

    this.mockParcels.push(newParcel);
    this.parcelsSubject.next([...this.mockParcels]);

    return of(newParcel);
  }

  // Update parcel status
  updateParcelStatus(parcelId: string, newStatus: ParcelStatus, updatedBy: string, updatedByName: string, location?: string): Observable<Parcel> {
    const parcelIndex = this.mockParcels.findIndex(p => p.id === parcelId);
    if (parcelIndex === -1) {
      return throwError(() => new Error('Parcel not found'));
    }

    const parcel = this.mockParcels[parcelIndex];
    parcel.status = newStatus;
    parcel.updatedAt = new Date();

    // Add tracking entry
    const trackingEntry: ParcelTracking = {
      id: (parcel.trackingHistory.length + 1).toString(),
      status: newStatus,
      timestamp: new Date(),
      location: location || 'Location not specified',
      description: this.getStatusDescription(newStatus),
      updatedBy,
      updatedByName
    };

    parcel.trackingHistory.push(trackingEntry);

    // Set delivery date if delivered
    if (newStatus === ParcelStatus.DELIVERED) {
      parcel.actualDelivery = new Date();
    }

    this.mockParcels[parcelIndex] = parcel;
    this.parcelsSubject.next([...this.mockParcels]);

    return of(parcel);
  }

  // Assign parcel to delivery agent
  assignParcelToAgent(parcelId: string, agentId: string, agentName: string): Observable<Parcel> {
    const parcelIndex = this.mockParcels.findIndex(p => p.id === parcelId);
    if (parcelIndex === -1) {
      return throwError(() => new Error('Parcel not found'));
    }

    const parcel = this.mockParcels[parcelIndex];
    parcel.assignedAgentId = agentId;
    parcel.assignedAgentName = agentName;
    parcel.updatedAt = new Date();

    this.mockParcels[parcelIndex] = parcel;
    this.parcelsSubject.next([...this.mockParcels]);

    return of(parcel);
  }

  // Calculate shipping cost based on weight and type
  private calculateShippingCost(weight: number, type: ParcelType): number {
    let baseCost = 10;
    let weightCost = weight * 5;
    
    switch (type) {
      case ParcelType.DOCUMENT:
        baseCost = 5;
        break;
      case ParcelType.FRAGILE:
      case ParcelType.ELECTRONICS:
        baseCost = 15;
        break;
      case ParcelType.LIQUID:
        baseCost = 20;
        break;
    }

    return baseCost + weightCost;
  }

  // Calculate expected delivery date
  private calculateExpectedDelivery(): Date {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3); // 3 days from now
    return deliveryDate;
  }

  // Generate unique tracking ID
  private generateTrackingId(): string {
    const prefix = 'PMS';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `${prefix}${timestamp}${random}`;
  }

  // Get status description
  private getStatusDescription(status: ParcelStatus): string {
    switch (status) {
      case ParcelStatus.BOOKED:
        return 'Parcel booking confirmed';
      case ParcelStatus.PICKED:
        return 'Parcel picked up from sender';
      case ParcelStatus.IN_TRANSIT:
        return 'Parcel is in transit';
      case ParcelStatus.OUT_FOR_DELIVERY:
        return 'Parcel out for delivery';
      case ParcelStatus.DELIVERED:
        return 'Parcel delivered successfully';
      case ParcelStatus.CANCELLED:
        return 'Parcel booking cancelled';
      case ParcelStatus.RETURNED:
        return 'Parcel returned to sender';
      default:
        return 'Status updated';
    }
  }

  // Get parcels by status
  getParcelsByStatus(status: ParcelStatus): Observable<Parcel[]> {
    const filteredParcels = this.mockParcels.filter(p => p.status === status);
    return of(filteredParcels);
  }

  // Search parcels
  searchParcels(query: string): Observable<Parcel[]> {
    const searchResults = this.mockParcels.filter(p => 
      p.trackingId.toLowerCase().includes(query.toLowerCase()) ||
      p.senderName.toLowerCase().includes(query.toLowerCase()) ||
      p.receiverName.toLowerCase().includes(query.toLowerCase()) ||
      p.senderPhone.includes(query) ||
      p.receiverPhone.includes(query)
    );
    return of(searchResults);
  }
}