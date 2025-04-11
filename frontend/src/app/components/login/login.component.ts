import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

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
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      // Simulate API call
      setTimeout(() => {
        this.isLoading = false;

        // For demo purposes, accept any valid email/password
        if (this.loginForm.get('email')?.valid && this.loginForm.get('password')?.valid) {
          // Store user info in localStorage for demo
          localStorage.setItem('currentUser', JSON.stringify({
            email: this.loginForm.get('email')?.value,
            name: 'Usuario Demo',
            avatar: 'https://ui-avatars.com/api/?name=Usuario+Demo&background=667eea&color=fff'
          }));

          // Redirect to forum page
          this.router.navigate(['/forum']);
        } else {
          this.errorMessage = 'Correo electrónico o contraseña inválidos';
        }
      }, 1000);
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
