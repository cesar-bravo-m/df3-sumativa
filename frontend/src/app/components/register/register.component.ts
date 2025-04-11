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
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, ValidationService.passwordValidator]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const { username, email, password } = this.registerForm.value;
      if (this.authService.register(username, password, email)) {
        this.router.navigate(['/login']);
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
}
