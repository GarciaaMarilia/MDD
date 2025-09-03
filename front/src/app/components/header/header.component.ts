import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

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
  private userInfoSubscription?: Subscription;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.isLoggedIn$.subscribe(
      (loggedIn) => {
        this.isLoggedIn = loggedIn;
      }
    );

    this.userInfoSubscription = this.authService.userInfo$.subscribe(
      (userInfo) => {
        this.userInfo = userInfo;
      }
    );

    if (this.authService.isLoggedIn()) {
      this.userInfo = this.authService.getCurrentUserInfo();
    }
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }

    if (this.userInfoSubscription) {
      this.userInfoSubscription.unsubscribe();
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

  navigateToTopics() {
    this.router.navigate(['/topics']);
  }

  navigateToProfile() {
    this.router.navigate(['/profile']);
  }

  isActiveRoute(route: string): boolean {
    return this.router.url === route;
  }

  getUserDisplayName(): string {
    if (this.userInfo?.name) {
      return this.userInfo.name;
    }
    if (this.userInfo?.email) {
      return this.userInfo.email.split('@')[0];
    }
    return 'User';
  }
}
