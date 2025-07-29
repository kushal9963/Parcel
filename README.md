# Parcel Management System (PMS)

A comprehensive Angular-based parcel management system that efficiently handles the complete parcel lifecycle including booking, tracking, delivery status updates, and customer communication. The system provides role-based access for Admins, Customers, and Delivery Agents.

## 🚀 Features

### 👥 User Roles & Authentication

#### **Admin**
- Comprehensive dashboard with system statistics
- Manage all parcels across the system
- User and delivery agent management
- Assign parcels to delivery agents
- Update delivery statuses
- Access full parcel tracking history
- Revenue and performance analytics

#### **Customer**
- User registration and secure login
- Book parcels with detailed sender/receiver information
- Real-time parcel tracking via tracking ID
- View complete parcel history
- Download invoices (feature planned)
- Personal dashboard with parcel statistics

#### **Delivery Agent**
- View assigned parcels
- Update delivery status (Picked → In Transit → Delivered)
- Agent-specific dashboard
- Track delivery performance

### 📦 Core Functionality

- **Parcel Booking**: Complete parcel registration with sender/receiver details
- **Real-time Tracking**: Public tracking interface with detailed timeline
- **Status Management**: Comprehensive status workflow
- **Role-based Access Control**: Secure authentication with route guards
- **Responsive Design**: Modern UI with Angular Material
- **Mock Data System**: Pre-populated data for testing

## 🛠️ Technology Stack

- **Frontend**: Angular 17+ with Standalone Components
- **UI Framework**: Angular Material
- **Styling**: SCSS with custom utility classes
- **State Management**: RxJS Observables
- **Authentication**: JWT-based (mock implementation)
- **Routing**: Angular Router with Guards
- **Forms**: Reactive Forms with Validation

## 🏗️ Project Structure

```
src/
├── app/
│   ├── models/                 # TypeScript interfaces and enums
│   │   ├── user.model.ts
│   │   ├── parcel.model.ts
│   │   └── auth.model.ts
│   ├── services/               # Business logic services
│   │   ├── auth.service.ts
│   │   └── parcel.service.ts
│   ├── guards/                 # Route protection
│   │   ├── auth.guard.ts
│   │   └── role.guard.ts
│   ├── components/             # Shared components
│   │   ├── login/
│   │   ├── register/
│   │   ├── dashboard/
│   │   └── track-parcel/
│   ├── admin/                  # Admin-specific components
│   │   ├── admin-dashboard/
│   │   ├── parcel-management/
│   │   ├── user-management/
│   │   └── agent-management/
│   ├── customer/               # Customer-specific components
│   │   ├── customer-dashboard/
│   │   ├── book-parcel/
│   │   ├── my-parcels/
│   │   └── customer-profile/
│   └── delivery-agent/         # Agent-specific components
│       ├── agent-dashboard/
│       ├── assigned-parcels/
│       └── agent-profile/
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd parcel-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   ng serve
   ```

4. **Access the application**
   - Open your browser and navigate to `http://localhost:4200`

## 🔑 Demo Credentials

The system comes with pre-configured demo accounts:

### Admin Account
- **Email**: `admin@pms.com`
- **Password**: `admin123`
- **Access**: Full system administration

### Customer Account
- **Email**: `customer@pms.com`
- **Password**: `customer123`
- **Access**: Parcel booking and tracking

### Delivery Agent Account
- **Email**: `agent@pms.com`
- **Password**: `agent123`
- **Access**: Assigned parcel management

## 📱 Key Features Demonstrated

### 1. **Authentication & Authorization**
- Secure login/logout functionality
- Role-based route protection
- JWT token management (mock)
- Automatic role-based dashboard redirection

### 2. **Admin Dashboard**
- Real-time statistics display
- Recent parcels overview
- Quick action buttons
- Comprehensive system metrics

### 3. **Parcel Tracking**
- Public tracking interface
- Detailed tracking timeline
- Status-based visual indicators
- Location and timestamp information

### 4. **Responsive Design**
- Mobile-first approach
- Adaptive layouts
- Touch-friendly interfaces
- Material Design principles

### 5. **Modern Angular Practices**
- Standalone components
- Reactive forms
- RxJS observables
- TypeScript strict mode
- Modular architecture

## 🎨 UI/UX Features

- **Material Design**: Consistent and modern interface
- **Responsive Layout**: Works on all device sizes
- **Intuitive Navigation**: Role-based sidebar navigation
- **Visual Feedback**: Loading states, success/error messages
- **Accessibility**: ARIA labels and keyboard navigation
- **Status Indicators**: Color-coded parcel statuses
- **Timeline View**: Visual tracking history

## 🔧 Development Features

- **Hot Reload**: Instant development feedback
- **TypeScript**: Type safety and better IDE support
- **Modular Services**: Separation of concerns
- **Mock Data**: Realistic test data for development
- **Route Guards**: Secure route protection
- **Lazy Loading**: Optimized bundle sizes

## 📊 System Capabilities

### Parcel Status Workflow
1. **Booked** - Initial parcel registration
2. **Picked** - Collected from sender
3. **In Transit** - En route to destination
4. **Out for Delivery** - Final delivery attempt
5. **Delivered** - Successfully delivered
6. **Cancelled** - Booking cancelled
7. **Returned** - Returned to sender

### User Management
- Role-based access control
- User registration and authentication
- Profile management
- Activity tracking

### Parcel Management
- Comprehensive parcel information
- Real-time status updates
- Tracking history
- Cost calculation
- Insurance options

## 🚧 Future Enhancements

- **Payment Integration**: Online payment processing
- **SMS/Email Notifications**: Real-time updates
- **Advanced Analytics**: Detailed reporting
- **Mobile App**: Native mobile applications
- **API Integration**: Third-party logistics APIs
- **Multi-language Support**: Internationalization
- **Advanced Search**: Complex filtering options
- **Bulk Operations**: Batch processing capabilities

## 🤝 Contributing

This is a demonstration project showcasing Angular development capabilities. The codebase demonstrates:

- Modern Angular architecture
- TypeScript best practices
- Material Design implementation
- Responsive web design
- Authentication patterns
- State management with RxJS

## 📝 Notes

- This is a **demonstration project** with mock data
- Authentication uses local storage (not production-ready)
- All data is simulated and resets on page refresh
- Designed to showcase Angular development skills
- Ready for backend integration

## 🎯 Project Goals

This project demonstrates proficiency in:
- Angular framework and ecosystem
- TypeScript development
- Material Design implementation
- Responsive web design
- Authentication and authorization
- State management
- Modern web development practices

---

**Built with ❤️ using Angular 17+ and Angular Material**