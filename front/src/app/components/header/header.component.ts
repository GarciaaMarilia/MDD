import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/AuthService/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isMobileMenuOpen = false;
  isLoggedIn = false;
  userInfo: any = null;
  private authSubscription?: Subscription;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.isLoggedIn$.subscribe(
      (loggedIn) => {
        this.isLoggedIn = loggedIn;
        // this.userInfo = this.authService.getUserInfo();
      }
    );
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  onDisconnect() {
    this.authService.logout();
    this.closeMobileMenu();
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  navigateToArticles() {
    this.router.navigate(['/articles']);
  }

  navigateToThemes() {
    this.router.navigate(['/themes']);
  }

  navigateToProfile() {
    this.router.navigate(['/profile']);
  }

  getUserDisplayName(): string {
    if (this.userInfo?.name) {
      return this.userInfo.name;
    }
    if (this.userInfo?.email) {
      return this.userInfo.email.split('@')[0];
    }
    return 'Usuário';
  }
}
