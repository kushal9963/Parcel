import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { LoginRequest, RegisterRequest, AuthResponse, TokenPayload, UserRole, User } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private tokenKey = 'pms_token';
  private refreshTokenKey = 'pms_refresh_token';

  // Mock data for demonstration
  private mockUsers: User[] = [
    {
      id: '1',
      email: 'admin@pms.com',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'User',
      phone: '+1234567890',
      role: UserRole.ADMIN,
      address: '123 Admin St',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      email: 'customer@pms.com',
      password: 'customer123',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567891',
      role: UserRole.CUSTOMER,
      address: '456 Customer Ave',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '3',
      email: 'agent@pms.com',
      password: 'agent123',
      firstName: 'Jane',
      lastName: 'Smith',
      phone: '+1234567892',
      role: UserRole.DELIVERY_AGENT,
      address: '789 Agent Blvd',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  constructor() {
    this.loadCurrentUser();
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    // Simulate API call
    const user = this.mockUsers.find(u => 
      u.email === credentials.email && u.password === credentials.password
    );

    if (!user || !user.isActive) {
      return throwError(() => new Error('Invalid credentials or inactive account'));
    }

    const authResponse: AuthResponse = {
      token: this.generateMockToken(user),
      refreshToken: this.generateMockRefreshToken(user),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      },
      expiresIn: 3600 // 1 hour
    };

    return of(authResponse).pipe(
      tap(response => {
        localStorage.setItem(this.tokenKey, response.token);
        localStorage.setItem(this.refreshTokenKey, response.refreshToken);
        this.currentUserSubject.next(user);
      })
    );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    // Check if user already exists
    const existingUser = this.mockUsers.find(u => u.email === userData.email);
    if (existingUser) {
      return throwError(() => new Error('User already exists'));
    }

    // Create new user
    const newUser: User = {
      id: (this.mockUsers.length + 1).toString(),
      email: userData.email,
      password: userData.password,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
      role: userData.role || UserRole.CUSTOMER,
      address: userData.address,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.mockUsers.push(newUser);

    const authResponse: AuthResponse = {
      token: this.generateMockToken(newUser),
      refreshToken: this.generateMockRefreshToken(newUser),
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role
      },
      expiresIn: 3600
    };

    return of(authResponse).pipe(
      tap(response => {
        localStorage.setItem(this.tokenKey, response.token);
        localStorage.setItem(this.refreshTokenKey, response.refreshToken);
        this.currentUserSubject.next(newUser);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem(this.tokenKey);
    return !!token && !this.isTokenExpired(token);
  }

  hasRole(roles: UserRole[]): boolean {
    const currentUser = this.getCurrentUser();
    return currentUser ? roles.includes(currentUser.role) : false;
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private loadCurrentUser(): void {
    const token = localStorage.getItem(this.tokenKey);
    if (token && !this.isTokenExpired(token)) {
      const payload = this.decodeToken(token);
      const user = this.mockUsers.find(u => u.id === payload.sub);
      if (user) {
        this.currentUserSubject.next(user);
      }
    }
  }

  private generateMockToken(user: User): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      sub: user.id,
      email: user.email,
      role: user.role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600
    }));
    const signature = btoa('mock-signature');
    return `${header}.${payload}.${signature}`;
  }

  private generateMockRefreshToken(user: User): string {
    return btoa(`refresh-${user.id}-${Date.now()}`);
  }

  private decodeToken(token: string): TokenPayload {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = this.decodeToken(token);
      return payload.exp < Math.floor(Date.now() / 1000);
    } catch {
      return true;
    }
  }
}