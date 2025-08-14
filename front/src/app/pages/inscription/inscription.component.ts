import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.scss'],
})
export class InscriptionComponent {
  inscriptionForm: FormGroup;

  constructor(private fb: FormBuilder, private location: Location) {
    this.inscriptionForm = this.fb.group({
      nomUtilisateur: ['', [Validators.required, Validators.minLength(3)]],
      adresseEmail: ['', [Validators.required, Validators.email]],
      motDePasse: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.inscriptionForm.valid) {
      const formData = this.inscriptionForm.value;
      console.log('Dados do formulário:', formData);
    } else {
      console.log('Formulário inválido');
      this.markFormGroupTouched();
    }
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
