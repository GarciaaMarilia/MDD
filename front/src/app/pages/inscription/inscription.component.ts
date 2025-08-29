import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from 'src/app/services/AuthService/auth.service';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.scss'],
})
export class InscriptionComponent {
  inscriptionForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private authService: AuthService,
    private router: Router
  ) {
    this.inscriptionForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
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
  }

  onSubmit() {
    if (this.inscriptionForm.valid) {
      const formData = this.inscriptionForm.value;
      this.authService.register({ ...formData }).subscribe({
        next: (res) => {
          localStorage.setItem('token', res.token);
          this.navigateToArticles();
        },
        error: (err) => console.error('Register error', err),
      });
    } else {
      console.log('Invalid form');
      this.markFormGroupTouched();
    }
  }

  navigateToArticles(): void {
    this.router.navigate(['/articles']);
  }

  private markFormGroupTouched() {
    Object.keys(this.inscriptionForm.controls).forEach((key) => {
      const control = this.inscriptionForm.get(key);
      control?.markAsTouched();
    });
  }

  goBack() {
    this.location.back();
  }
}
