import { Injectable } from '@angular/core';
import { AuthService } from '../AuthService/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AppInitService {
  constructor(private authService: AuthService) {}

  init(): Promise<void> {
    return new Promise((resolve) => {
      this.authService.checkAuthStatus();

      resolve();
    });
  }
}
