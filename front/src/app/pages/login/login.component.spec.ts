import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { LoginComponent } from './login.component';
import { AuthService } from 'src/app/services/AuthService/auth.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceMock: any;
  let routerMock: any;
  let locationMock: any;

  beforeEach(async () => {
    authServiceMock = { login: jest.fn() };
    routerMock = { navigate: jest.fn() };
    locationMock = { back: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [LoginComponent],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: Location, useValue: locationMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create form with email and password', () => {
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.get('email')).toBeDefined();
    expect(component.loginForm.get('password')).toBeDefined();
  });

  it('should login successfully and navigate', () => {
    const mockResponse = { token: 'fake-token' };
    authServiceMock.login.mockReturnValue(of(mockResponse));

    component.loginForm.setValue({
      email: 'test@test.com',
      password: '123456',
    });
    component.onSubmit();

    expect(authServiceMock.login).toHaveBeenCalledWith({
      email: 'test@test.com',
      password: '123456',
    });
    expect(localStorage.getItem('token')).toBe('fake-token');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/articles']);
  });

  it('should handle login error', () => {
    const consoleSpy = spyOn(console, 'error').and.callThrough();
    authServiceMock.login.and.returnValue(
      throwError(() => new Error('Login failed'))
    );

    component.loginForm.setValue({
      email: 'test@test.com',
      password: '123456',
    });
    component.onSubmit();

    expect(consoleSpy).toHaveBeenCalledWith('Login error', jasmine.any(Error));
    consoleSpy.and.callThrough();
  });

  it('should call location.back() on goBack', () => {
    component.goBack();
    expect(locationMock.back).toHaveBeenCalled();
  });
});
