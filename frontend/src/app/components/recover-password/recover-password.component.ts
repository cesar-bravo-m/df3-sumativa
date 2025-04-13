import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ValidationService } from '../../services/validation.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recover-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.scss']
})
export class RecoverPasswordComponent {
  recoverForm: FormGroup;
  verificationForm: FormGroup;
  newPasswordForm: FormGroup;
  currentStep: 'username' | 'verification' | 'newPassword' = 'username';
  errorMessage: string = '';
  username: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.recoverForm = this.fb.group({
      username: ['', [Validators.required]]
    });

    this.verificationForm = this.fb.group({
      code: ['', [Validators.required, Validators.pattern('^000$')]]
    });

    this.newPasswordForm = this.fb.group({
      password: ['', [Validators.required, ValidationService.passwordValidator]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  onSubmitUsername(): void {
    if (this.recoverForm.valid) {
      this.username = this.recoverForm.get('username')?.value;
      const code = this.authService.recoverPassword(this.username);
      if (code) {
        this.currentStep = 'verification';
      } else {
        this.errorMessage = 'Nombre de usuario no encontrado';
      }
    }
  }

  onSubmitVerification(): void {
    if (this.verificationForm.valid) {
      this.currentStep = 'newPassword';
    }
  }

  onSubmitNewPassword(): void {
    if (this.newPasswordForm.valid) {
      const { password } = this.newPasswordForm.value;
      if (this.authService.updatePassword(this.username, password)) {
        this.router.navigate(['/login']);
      } else {
        this.errorMessage = 'Error al actualizar la contraseña';
      }
    }
  }

  getPasswordErrors(): string[] {
    const errors: string[] = [];
    const passwordControl = this.newPasswordForm.get('password');

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

  // Individual password validation checks
  hasMinLength(): boolean {
    const password = this.newPasswordForm.get('password')?.value || '';
    return password.length >= 8;
  }

  hasMaxLength(): boolean {
    const password = this.newPasswordForm.get('password')?.value || '';
    return password.length <= 32;
  }

  hasLetter(): boolean {
    const password = this.newPasswordForm.get('password')?.value || '';
    return /[A-Za-z]/.test(password);
  }

  hasNumber(): boolean {
    const password = this.newPasswordForm.get('password')?.value || '';
    return /[0-9]/.test(password);
  }

  hasSpecialChar(): boolean {
    const password = this.newPasswordForm.get('password')?.value || '';
    return /[!@#$%^&*(),.?":{}|<>]/.test(password);
  }
}
