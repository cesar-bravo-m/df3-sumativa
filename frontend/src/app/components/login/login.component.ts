import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email,
        this.emailWithTldValidator(),
        this.allowedTldsValidator()
      ]],
      password: ['', [Validators.required]]
    });
  }

  emailWithTldValidator() {
    return (control: any) => {
      if (!control.value) {
        return null;
      }

      const email = control.value;
      const parts = email.split('@');

      if (parts.length !== 2) {
        return { invalidFormat: true };
      }

      const domain = parts[1];
      const domainParts = domain.split('.');

      // Check if there's at least one dot in the domain part
      if (domainParts.length < 2) {
        return { noTld: true };
      }

      return null;
    };
  }

  allowedTldsValidator() {
    return (control: any) => {
      if (!control.value) {
        return null;
      }

      const email = control.value;
      const parts = email.split('@');

      if (parts.length !== 2) {
        return null; // Let the emailWithTldValidator handle this
      }

      const domain = parts[1];
      const domainParts = domain.split('.');

      if (domainParts.length < 2) {
        return null; // Let the emailWithTldValidator handle this
      }

      const tld = domainParts[domainParts.length - 1].toLowerCase();

      // Check if the TLD is one of the allowed ones
      if (['com', 'cl', 'net'].includes(tld)) {
        return null;
      }

      return { invalidTld: true };
    };
  }

  getEmailErrors(): string[] {
    const errors: string[] = [];
    const emailControl = this.loginForm.get('email');

    if (emailControl?.errors) {
      if (emailControl.errors['required']) {
        errors.push('El correo electrónico es requerido');
      }
      if (emailControl.errors['email']) {
        errors.push('Por favor ingresa un correo electrónico válido');
      }
      if (emailControl.errors['invalidFormat']) {
        errors.push('El formato del correo electrónico no es válido');
      }
      if (emailControl.errors['noTld']) {
        errors.push('El correo electrónico debe incluir un dominio con TLD (ej: .com, .cl, .net)');
      }
      if (emailControl.errors['invalidTld']) {
        errors.push('Solo se permiten dominios .com, .cl o .net');
      }
    }

    return errors;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const email = this.loginForm.get('email')?.value;
      const password = this.loginForm.get('password')?.value;

      this.authService.login(email, password).subscribe({
        next: (response) => {
          this.router.navigate(['/forum']);
        },
        error: (error) => {
          this.errorMessage = 'Correo electrónico o contraseña inválidos';
          this.isLoading = false;
        }
      });
    } else {
      this.errorMessage = 'Por favor completa todos los campos correctamente';
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  goToRecoverPassword() {
    this.router.navigate(['/recover-password']);
  }
}
