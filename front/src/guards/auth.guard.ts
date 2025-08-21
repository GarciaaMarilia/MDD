import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from 'src/app/services/AuthService/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    return this.checkAuthStatus(state.url);
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    return this.canActivate(childRoute, state);
  }

  private checkAuthStatus(url: string): boolean {
    if (this.authService.isLoggedIn()) {
      return true;
    }

    // Salva a URL que o usuário tentou acessar para redirecionar após login
    localStorage.setItem('redirectUrl', url);

    // Redireciona para a página de login
    this.router.navigate(['/login']);
    return false;
  }
}
