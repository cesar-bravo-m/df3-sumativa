import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ValidationService } from '../../services/validation.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(12),
        Validators.pattern('^[a-zA-Z0-9]+$')
      ]],
      email: ['', [
        Validators.required,
        Validators.email,
        this.emailWithTldValidator(),
        this.allowedTldsValidator()
      ]],
      password: ['', [Validators.required, ValidationService.passwordValidator]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
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
        return null;
      }

      const domain = parts[1];
      const domainParts = domain.split('.');

      if (domainParts.length < 2) {
        return null;
      }

      const tld = domainParts[domainParts.length - 1].toLowerCase();

      if (['com', 'cl', 'net'].includes(tld)) {
        return null;
      }

      return { invalidTld: true };
    };
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const { username, email, password } = this.registerForm.value;
      if (this.authService.register(username, password, email)) {
        this.authService.login(email, password).subscribe({
          next: (response) => {
            this.router.navigate(['/forum']);
          },
          error: (error) => {
            this.router.navigate(['/login']);
          }
        });
      } else {
        this.errorMessage = 'El nombre de usuario ya existe';
      }
    }
  }

  getPasswordErrors(): string[] {
    const errors: string[] = [];
    const passwordControl = this.registerForm.get('password');

    if (passwordControl?.errors) {
      if (passwordControl.errors['minLength']) {
        errors.push('La contraseña debe tener al menos 8 caracteres');
      }
      if (passwordControl.errors['maxLength']) {
        errors.push('La contraseña no debe exceder 32 caracteres');
      }
      if (passwordControl.errors['requireLetter']) {
        errors.push('La contraseña debe contener al menos una letra');
      }
      if (passwordControl.errors['requireNumber']) {
        errors.push('La contraseña debe contener al menos un número');
      }
      if (passwordControl.errors['requireSpecialChar']) {
        errors.push('La contraseña debe contener al menos un carácter especial');
      }
    }

    return errors;
  }

  getUsernameErrors(): string[] {
    const errors: string[] = [];
    const usernameControl = this.registerForm.get('username');

    if (usernameControl?.errors) {
      if (usernameControl.errors['required']) {
        errors.push('El nombre de usuario es requerido');
      }
      if (usernameControl.errors['minlength']) {
        errors.push('El nombre de usuario debe tener al menos 3 caracteres');
      }
      // if (usernameControl.errors['maxlength']) {
      //   errors.push('El nombre de usuario no debe exceder 32 caracteres');
      // }
      if (usernameControl.errors['pattern']) {
        errors.push('El nombre de usuario no puede contener caracteres especiales');
      }
    }

    return errors;
  }

  getEmailErrors(): string[] {
    const errors: string[] = [];
    const emailControl = this.registerForm.get('email');

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

  hasUsernameMinLength(): boolean {
    const username = this.registerForm.get('username')?.value || '';
    return username.length >= 3;
  }

  hasUsernameMaxLength(): boolean {
    const username = this.registerForm.get('username')?.value || '';
    return username.length <= 12;
  }

  hasValidUsernameChars(): boolean {
    const username = this.registerForm.get('username')?.value || '';
    return /^[a-zA-Z0-9]+$/.test(username);
  }

  hasValidEmailFormat(): boolean {
    const email = this.registerForm.get('email')?.value || '';
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  hasValidTld(): boolean {
    const email = this.registerForm.get('email')?.value || '';
    const tld = email.split('.').pop()?.toLowerCase();
    return ['com', 'cl', 'net'].includes(tld || '');
  }

  hasMinLength(): boolean {
    const password = this.registerForm.get('password')?.value || '';
    return password.length >= 8;
  }

  hasMaxLength(): boolean {
    const password = this.registerForm.get('password')?.value || '';
    return password.length <= 32;
  }

  hasLetter(): boolean {
    const password = this.registerForm.get('password')?.value || '';
    return /[A-Za-z]/.test(password);
  }

  hasNumber(): boolean {
    const password = this.registerForm.get('password')?.value || '';
    return /[0-9]/.test(password);
  }

  hasSpecialChar(): boolean {
    const password = this.registerForm.get('password')?.value || '';
    return /[!@#$%^&*(),.?":{}|<>]/.test(password);
  }
}
