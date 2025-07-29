export enum ParcelStatus {
  BOOKED = 'booked',
  PICKED = 'picked',
  IN_TRANSIT = 'in_transit',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  RETURNED = 'returned'
}

export enum ParcelType {
  DOCUMENT = 'document',
  PACKAGE = 'package',
  FRAGILE = 'fragile',
  LIQUID = 'liquid',
  ELECTRONICS = 'electronics'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  REFUNDED = 'refunded'
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  landmark?: string;
}

export interface ParcelTracking {
  id: string;
  status: ParcelStatus;
  timestamp: Date;
  location: string;
  description: string;
  updatedBy: string; // user ID
  updatedByName: string;
}

export interface Parcel {
  id: string;
  trackingId: string;
  
  // Sender Information
  senderName: string;
  senderPhone: string;
  senderEmail: string;
  senderAddress: Address;
  
  // Receiver Information
  receiverName: string;
  receiverPhone: string;
  receiverEmail?: string;
  receiverAddress: Address;
  
  // Parcel Details
  type: ParcelType;
  weight: number; // in kg
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  description: string;
  value: number; // declared value
  
  // Status and Tracking
  status: ParcelStatus;
  trackingHistory: ParcelTracking[];
  
  // Assignment
  customerId: string;
  assignedAgentId?: string;
  assignedAgentName?: string;
  
  // Pricing
  shippingCost: number;
  additionalCharges: number;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  
  // Timestamps
  bookedAt: Date;
  expectedDelivery: Date;
  actualDelivery?: Date;
  createdAt: Date;
  updatedAt: Date;
  
  // Additional
  specialInstructions?: string;
  isInsured: boolean;
  insuranceAmount?: number;
}