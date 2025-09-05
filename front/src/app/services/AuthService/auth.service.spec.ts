import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import {
  LoginRequest,
  RegisterRequest,
  UpdateRequest,
  AuthResponse,
} from 'src/app/models/Auth';
import { User } from 'src/app/models/User';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerMock: Partial<Router>;

  const mockUser: User = {
    id: 1,
    username: 'John Doe',
    email: 'john@example.com',
  };
  const mockResponse: AuthResponse = {
    token: 'fake.jwt.token',
    user: mockUser,
  };
  const updatedMockResponse: User = {
    ...mockUser,
  };
  beforeEach(() => {
    routerMock = { navigate: jest.fn() };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService, { provide: Router, useValue: routerMock }],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login and store token/user', () => {
    const loginData: LoginRequest = {
      email: 'john@example.com',
      password: '123456',
    };

    service.login(loginData).subscribe((res) => {
      expect(res).toEqual(mockResponse);
      expect(localStorage.getItem('token')).toBe(mockResponse.token);
      expect(localStorage.getItem('user')).toBe(JSON.stringify(mockUser));
      expect(service.isLoggedIn()).toBe(true);
      expect(service.getCurrentUserInfo()).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should register and store token/user', () => {
    const registerData: RegisterRequest = {
      username: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    };

    service.register(registerData).subscribe((res) => {
      expect(res).toEqual(mockResponse);
      expect(service.isLoggedIn()).toBe(true);
      expect(service.getCurrentUserInfo()).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/register`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should update user info and token', () => {
    const updateData: UpdateRequest = {
      id: 1,
      email: 'john.updated@example.com',
      username: 'JohnUpdated',
      password: 'newpassword123',
    };
    service.update(updateData).subscribe((res) => {
      expect(res).toEqual(updatedMockResponse);
      expect(service.isLoggedIn()).toBe(true);
      expect(service.getCurrentUserInfo()).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/update`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockResponse);
  });

  it('should logout and clear auth', () => {
    localStorage.setItem('token', 'fake.jwt.token');
    localStorage.setItem('user', JSON.stringify(mockUser));
    service.logout();

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
    expect(service.isLoggedIn()).toBe(false);
    expect(service.getCurrentUserInfo()).toBeNull();
    expect(routerMock.navigate).toHaveBeenCalledWith(['']);
  });
});
