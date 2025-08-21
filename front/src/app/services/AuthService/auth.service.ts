import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from 'src/app/models/Auth';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  // BehaviorSubject para o estado de login
  private isLoggedInSubject = new BehaviorSubject<boolean>(
    this.hasValidToken()
  );
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  // BehaviorSubject para informações do usuário
  private userInfoSubject = new BehaviorSubject<any>(
    this.getUserInfoFromToken()
  );
  public userInfo$ = this.userInfoSubject.asObservable();

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }),
  };

  constructor(private http: HttpClient, private router: Router) {}

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, data, this.httpOptions)
      .pipe(
        tap((response) => {
          this.setToken(response.token);
        })
      );
  }

  register(data: RegisterRequest): Observable<RegisterResponse> {
    return this.http
      .post<RegisterResponse>(`${this.apiUrl}/register`, data, this.httpOptions)
      .pipe(
        tap((response) => {
          this.setToken(response.token);
        })
      );
  }

  private setToken(token: string): void {
    localStorage.setItem('token', token);
    this.updateAuthState();
  }

  private updateAuthState(): void {
    const isLoggedIn = this.hasValidToken();
    const userInfo = this.getUserInfoFromToken();

    this.isLoggedInSubject.next(isLoggedIn);
    this.userInfoSubject.next(userInfo);
  }

  public checkAuthStatus(): void {
    this.updateAuthState();
  }

  isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }

  getCurrentUserInfo(): any {
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

  private getUserInfoFromToken(): any {
    const token = this.getToken();

    if (!token) {
      return null;
    }

    try {
      return this.decodeJWT(token);
    } catch (error) {
      return null;
    }
  }

  private decodeJWT(token: string): any {
    try {
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload);
      return JSON.parse(decodedPayload);
    } catch (error) {
      throw new Error('Token inválido');
    }
  }

  private clearAuth(): void {
    localStorage.removeItem('token');
    this.isLoggedInSubject.next(false);
    this.userInfoSubject.next(null);
  }

  logout(): void {
    this.router.navigate(['']);
    this.clearAuth();
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    });
  }
}
