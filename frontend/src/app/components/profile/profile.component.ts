import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ValidationService } from '../../services/validation.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  currentUser: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      username: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(12),
        Validators.pattern('^[a-zA-Z0-9]+$')
      ]],
      currentPassword: ['', [Validators.required]],
      newPassword: [''],
      confirmPassword: ['']
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      if (!user) {
        this.router.navigate(['/login']);
        return;
      }
      this.currentUser = user;
      this.profileForm.patchValue({
        username: user.username
      });
    });

    this.profileForm.get('newPassword')?.valueChanges.subscribe(value => {
      const confirmPasswordControl = this.profileForm.get('confirmPassword');
      if (value && value.length > 0) {
        confirmPasswordControl?.setValidators([Validators.required]);
      } else {
        confirmPasswordControl?.clearValidators();
      }
      confirmPasswordControl?.updateValueAndValidity();
    });
  }

  passwordMatchValidator(g: FormGroup) {
    const newPassword = g.get('newPassword')?.value;
    const confirmPassword = g.get('confirmPassword')?.value;

    if (newPassword && newPassword.length > 0) {
      return newPassword === confirmPassword
        ? null
        : { mismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      const { username, currentPassword, newPassword } = this.profileForm.value;

      if (this.authService.login(this.currentUser.email, currentPassword)) {
        let updateSuccess = true;

        if (username !== this.currentUser.username) {
          if (!this.authService.updateUsername(this.currentUser.email, username)) {
            this.errorMessage = 'Error al actualizar el nombre de usuario';
            this.successMessage = '';
            updateSuccess = false;
          }
        }

        if (newPassword && newPassword.length > 0 && updateSuccess) {
          if (this.authService.updatePassword(this.currentUser.email, newPassword)) {
            this.successMessage = 'Perfil actualizado exitosamente';
            this.errorMessage = '';
            this.profileForm.patchValue({
              currentPassword: '',
              newPassword: '',
              confirmPassword: ''
            });
          } else {
            this.errorMessage = 'Error al actualizar la contraseña';
            this.successMessage = '';
          }
        } else if (updateSuccess) {
          this.successMessage = 'Nombre de usuario actualizado exitosamente';
          this.errorMessage = '';
          this.profileForm.patchValue({
            currentPassword: ''
          });
        }
      } else {
        this.errorMessage = 'La contraseña actual es incorrecta';
        this.successMessage = '';
      }
    }
  }

  getPasswordErrors(): string[] {
    const errors: string[] = [];
    const passwordControl = this.profileForm.get('newPassword');

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
    const password = this.profileForm.get('newPassword')?.value || '';
    return password.length >= 8;
  }

  hasMaxLength(): boolean {
    const password = this.profileForm.get('newPassword')?.value || '';
    return password.length <= 32;
  }

  hasLetter(): boolean {
    const password = this.profileForm.get('newPassword')?.value || '';
    return /[A-Za-z]/.test(password);
  }

  hasNumber(): boolean {
    const password = this.profileForm.get('newPassword')?.value || '';
    return /[0-9]/.test(password);
  }

  hasSpecialChar(): boolean {
    const password = this.profileForm.get('newPassword')?.value || '';
    return /[!@#$%^&*(),.?":{}|<>]/.test(password);
  }

  getUsernameErrors(): string[] {
    const errors: string[] = [];
    const usernameControl = this.profileForm.get('username');

    if (usernameControl?.errors) {
      if (usernameControl.errors['required']) {
        errors.push('El nombre de usuario es requerido');
      }
      if (usernameControl.errors['minlength']) {
        errors.push('El nombre de usuario debe tener al menos 3 caracteres');
      }
      if (usernameControl.errors['maxlength']) {
        errors.push('El nombre de usuario no debe exceder 12 caracteres');
      }
      if (usernameControl.errors['pattern']) {
        errors.push('El nombre de usuario no puede contener caracteres especiales');
      }
    }

    return errors;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
