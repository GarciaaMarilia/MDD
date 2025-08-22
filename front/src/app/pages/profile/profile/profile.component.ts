import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'src/app/models/Subscription';

import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/AuthService/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  user: User = {} as User;

  profileForm!: FormGroup;

  subscriptions: Subscription[] = [
    {
      id: 1,
      title: 'Titre du thème',
      content:
        "Description: lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard...",
    },
    {
      id: 2,
      title: 'Titre du thème',
      content:
        "Description: lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard...",
    },
  ];

  constructor(private authService: AuthService, private fb: FormBuilder) {}

  ngOnInit() {
    this.authService.userInfo$.subscribe((userInfo) => {
      if (userInfo) {
        this.user = userInfo;
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

  onUnsubscribe(subscriptionId: number): void {
    const subscription = this.subscriptions.find(
      (sub) => sub.id === subscriptionId
    );

    if (
      confirm(
        `Êtes-vous sûr de vouloir vous désabonner de "${subscription?.title}" ?`
      )
    ) {
      this.subscriptions = this.subscriptions.filter(
        (sub) => sub.id !== subscriptionId
      );

      // Ici vous pouvez appeler un service pour supprimer l'abonnement
      // this.subscriptionService.unsubscribe(subscriptionId);

      console.log(`Désabonnement de l'abonnement ID: ${subscriptionId}`);
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.profileForm.controls).forEach((key) => {
      const control = this.profileForm.get(key);
      control?.markAsTouched();
    });
  }

  // Getters pour faciliter l'accès aux contrôles dans le template
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
