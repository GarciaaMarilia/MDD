import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { of, throwError } from 'rxjs';

import { LoginComponent } from './login.component';
import { AuthService } from 'src/app/services/AuthService/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: any;
  let mockRouter: any;
  let mockLocation: any;

  beforeEach(async () => {
    mockAuthService = {
      login: jest.fn(),
    };
    mockRouter = {
      navigate: jest.fn(),
    };
    mockLocation = {
      back: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        ReactiveFormsModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: Location, useValue: mockLocation },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with email and password controls', () => {
    expect(component.loginForm.contains('email')).toBe(true);
    expect(component.loginForm.contains('password')).toBe(true);
  });

  it('should call authService.login and navigate on successful login', () => {
    const fakeResponse = { token: '12345' };
    mockAuthService.login.mockReturnValue(of(fakeResponse));
    component.loginForm.setValue({
      email: 'test@test.com',
      password: 'Abcd123!',
    });

    component.onSubmit();

    expect(mockAuthService.login).toHaveBeenCalledWith({
      email: 'test@test.com',
      password: 'Abcd123!',
    });
    expect(localStorage.getItem('token')).toBe('12345');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/articles']);
  });

  it('should alert and log error on failed login', () => {
    const error = { message: 'Invalid credentials' };
    mockAuthService.login.mockReturnValue(throwError(() => error));
    component.loginForm.setValue({
      email: 'test@test.com',
      password: 'Abcd123!',
    });

    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    component.onSubmit();

    expect(alertSpy).toHaveBeenCalledWith('Login error');
    expect(consoleSpy).toHaveBeenCalledWith('Login error', error);
  });

  it('should navigate back when goBack is called', () => {
    component.goBack();
    expect(mockLocation.back).toHaveBeenCalled();
  });
});
