import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/AuthService/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const formData = this.loginForm.value;
      this.authService.login({ ...formData }).subscribe({
        next: (res) => {
          console.log('Login OK', res);
          localStorage.setItem('token', res.token);
          this.navigateToArticles();
        },
        error: (err) => console.error('Login error', err),
      });
    } else {
      console.log('Formulário inválido');
      this.markFormGroupTouched();
    }
  }

  navigateToArticles(): void {
    this.router.navigate(['/articles']);
  }

  private markFormGroupTouched() {
    Object.keys(this.loginForm.controls).forEach((key) => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  goBack() {
    this.location.back();
  }

  ngOnInit(): void {}
}
