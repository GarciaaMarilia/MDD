import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { User } from 'src/app/models/User';
import { Topic } from 'src/app/models/Topic';
import { AuthService } from 'src/app/services/AuthService/auth.service';
import { SubscriptionsService } from 'src/app/services/Subscriptions/subscriptions.service';
import { filter, switchMap } from 'rxjs';

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
    private fb: FormBuilder,
    private authService: AuthService,
    private subscriptionsService: SubscriptionsService
  ) {}

  ngOnInit() {
    this.getCurrentUserAndInfos();
  }

  getCurrentUserAndInfos() {
    this.authService.userInfo$
      .pipe(
        // filtra se não houver usuário
        filter((userInfo): userInfo is User => !!userInfo),
        // para cada usuário, busca as assinaturas
        switchMap((user) => {
          this.user = user;

          // inicializa o formulário
          this.profileForm = this.fb.group({
            username: [
              this.user.username,
              [Validators.required, Validators.minLength(3)],
            ],
            email: [this.user.email, [Validators.required, Validators.email]],
            password: [
              '',
              [
                Validators.required,
                Validators.minLength(8),
                Validators.pattern(
                  /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).+$/
                ),
              ],
            ],
          });

          // retorna o observable das assinaturas
          return this.subscriptionsService.getUserSubscriptions(this.user.id);
        })
      )
      .subscribe({
        next: (subs) => {
          this.subscriptions = subs;
        },
        error: (err) => {
          console.error('Erro ao buscar informações do usuário:', err);
        },
      });
  }

  onSaveProfile(): void {
    if (this.profileForm.valid && this.user) {
      const profileData = {
        id: this.user.id,
        ...this.profileForm.value,
      };
      this.authService.update(profileData).subscribe({
        next: () => {
          alert('Profil mis à jour avec succès !');
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour du profil :', err);
          alert('Erreur lors de la mise à jour du profil.');
        },
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  onUnsubscribe(topicId: number): void {
    this.subscriptionsService
      .unsubscribe(this.user.id, topicId)
      .subscribe((user) => {
        this.user = user;
        this.getCurrentUserAndInfos();
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
