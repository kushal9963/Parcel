export enum UserRole {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
  DELIVERY_AGENT = 'delivery_agent'
}

export interface User {
  id: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: UserRole;
  address?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer extends User {
  role: UserRole.CUSTOMER;
  customerCode: string;
}

export interface DeliveryAgent extends User {
  role: UserRole.DELIVERY_AGENT;
  agentCode: string;
  vehicleNumber?: string;
  isAvailable: boolean;
  assignedParcels: string[]; // parcel IDs
}

export interface Admin extends User {
  role: UserRole.ADMIN;
  adminLevel: 'super' | 'regular';
}