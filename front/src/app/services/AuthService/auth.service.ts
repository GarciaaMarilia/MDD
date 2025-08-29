import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  UpdateRequest,
  UpdateResponse,
} from 'src/app/models/Auth';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

import { User } from 'src/app/models/User';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  private isLoggedInSubject = new BehaviorSubject<boolean>(
    this.hasValidToken()
  );
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private userInfoSubject = new BehaviorSubject<User | null>(null);
  public userInfo$ = this.userInfoSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, data).pipe(
      tap((response) => {
        this.setToken(response.token, response.user);
      })
    );
  }

  register(data: RegisterRequest): Observable<RegisterResponse> {
    return this.http
      .post<RegisterResponse>(`${this.apiUrl}/register`, data)
      .pipe(
        tap((response) => {
          this.setToken(response.token, response.user);
        })
      );
  }

  update(data: UpdateRequest): Observable<UpdateResponse> {
    return this.http.put<UpdateResponse>(`${this.apiUrl}/update`, data).pipe(
      tap((response) => {
        this.setToken(response.token, response.user);
      })
    );
  }

  private setToken(token: string, user: User): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.userInfoSubject.next(user);

    this.updateAuthState();
  }

  private updateAuthState(): void {
    const isLoggedIn = this.hasValidToken();
    this.isLoggedInSubject.next(isLoggedIn);
  }

  public checkAuthStatus(): void {
    this.updateAuthState();
  }

  isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }

  getCurrentUserInfo(): User | null {
    return this.userInfoSubject.value;
  }

  private hasValidToken(): boolean {
    const token = this.getToken();

    if (!token) {
      return false;
    }

    try {
      const payload = this.decodeJWT(token);
      const currentTime = Math.floor(Date.now() / 1000);

      if (payload.exp && payload.exp < currentTime) {
        this.clearAuth();
        return false;
      }

      return true;
    } catch (error) {
      this.clearAuth();
      return false;
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private decodeJWT(token: string): any {
    try {
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload);
      return JSON.parse(decodedPayload);
    } catch (error) {
      throw new Error('Invalid Token');
    }
  }

  private clearAuth(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.isLoggedInSubject.next(false);
    this.userInfoSubject.next(null);
  }

  logout(): void {
    this.router.navigate(['']);
    this.clearAuth();
  }
}
