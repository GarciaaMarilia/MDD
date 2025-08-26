import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { User } from 'src/app/models/User';
import { Topic } from 'src/app/models/Topic';
import { AuthService } from 'src/app/services/AuthService/auth.service';
import { SubscriptionsService } from 'src/app/services/Subscriptions/subscriptions.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  user: User = {} as User;

  profileForm!: FormGroup;

  subscriptions: Topic[] = [];

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private subscriptionsService: SubscriptionsService
  ) {}

  ngOnInit() {
    this.authService.userInfo$.subscribe((userInfo) => {
      if (userInfo) {
        this.user = userInfo;

        this.subscriptionsService
          .getUserSubscriptions(this.user.id)
          .subscribe((subs) => {
            this.subscriptions = subs;
          });

        this.profileForm = this.fb.group({
          username: [
            this.user.username,
            [Validators.required, Validators.minLength(3)],
          ],
          email: [this.user.email, [Validators.required, Validators.email]],
          password: ['', [Validators.required, Validators.minLength(6)]],
        });
      }
    });
  }

  onSaveProfile(): void {
    if (this.profileForm.valid) {
      const profileData = this.profileForm.value;
      console.log('Profil sauvegardé:', profileData);

      // Ici vous pouvez appeler un service pour sauvegarder le profil
      // this.userService.updateProfile(profileData);

      alert('Profil sauvegardé avec succès!');
    } else {
      this.markFormGroupTouched();
    }
  }

  onUnsubscribe(topicId: number): void {
    this.subscriptionsService
      .unsubscribe(this.user.id, topicId)
      .subscribe((user) => {
        this.user = user;
      });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.profileForm.controls).forEach((key) => {
      const control = this.profileForm.get(key);
      control?.markAsTouched();
    });
  }

  get username() {
    return this.profileForm.get('username');
  }
  get email() {
    return this.profileForm.get('email');
  }
  get password() {
    return this.profileForm.get('password');
  }
}
