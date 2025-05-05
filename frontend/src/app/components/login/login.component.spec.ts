import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService, JwtResponse } from '../../services/auth.service';
import { of } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router: Router;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterTestingModule,
        LoginComponent
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Validation', () => {
    it('should initialize with empty form', () => {
      expect(component.loginForm.get('email')?.value).toBe('');
      expect(component.loginForm.get('password')?.value).toBe('');
    });

    it('should mark email as invalid when empty', () => {
      const emailControl = component.loginForm.get('email');
      emailControl?.setValue('');
      expect(emailControl?.valid).toBeFalse();
      expect(emailControl?.errors?.['required']).toBeTruthy();
    });

    it('should mark email as invalid with incorrect format', () => {
      const emailControl = component.loginForm.get('email');
      emailControl?.setValue('invalid-email');
      expect(emailControl?.valid).toBeFalse();
      expect(emailControl?.errors?.['email']).toBeTruthy();
    });

    it('should mark email as invalid without TLD', () => {
      const emailControl = component.loginForm.get('email');
      emailControl?.setValue('test@domain');
      expect(emailControl?.valid).toBeFalse();
      expect(emailControl?.errors?.['noTld']).toBeTruthy();
    });

    it('should mark email as invalid with disallowed TLD', () => {
      const emailControl = component.loginForm.get('email');
      emailControl?.setValue('test@domain.org');
      expect(emailControl?.valid).toBeFalse();
      expect(emailControl?.errors?.['invalidTld']).toBeTruthy();
    });

    it('should accept valid email with allowed TLD', () => {
      const emailControl = component.loginForm.get('email');
      emailControl?.setValue('test@domain.com');
      expect(emailControl?.valid).toBeTrue();
    });

    it('should mark password as invalid when empty', () => {
      const passwordControl = component.loginForm.get('password');
      passwordControl?.setValue('');
      expect(passwordControl?.valid).toBeFalse();
      expect(passwordControl?.errors?.['required']).toBeTruthy();
    });
  });

  describe('Form Submission', () => {
    it('should not submit when form is invalid', () => {
      const navigateSpy = spyOn(router, 'navigate');
      component.onSubmit();
      expect(navigateSpy).not.toHaveBeenCalled();
      expect(component.errorMessage).toBe('Por favor completa todos los campos correctamente');
    });

    it('should handle successful login', () => {
      const navigateSpy = spyOn(router, 'navigate');
      authService.login.and.returnValue(of({} as JwtResponse));

      component.loginForm.setValue({
        email: 'test@domain.com',
        password: 'password123'
      });

      component.onSubmit();

      expect(authService.login).toHaveBeenCalledWith('test@domain.com', 'password123');
      expect(navigateSpy).toHaveBeenCalledWith(['/forum']);
      expect(component.errorMessage).toBe('');
    });

    it('should handle failed login', () => {
      const navigateSpy = spyOn(router, 'navigate');
      authService.login.and.returnValue(of({} as JwtResponse));

      component.loginForm.setValue({
        email: 'test@domain.com',
        password: 'wrongpassword'
      });

      component.onSubmit();

      expect(authService.login).toHaveBeenCalledWith('test@domain.com', 'wrongpassword');
    });
  });

  describe('Navigation', () => {
    it('should navigate to register page', () => {
      const navigateSpy = spyOn(router, 'navigate');
      component.goToRegister();
      expect(navigateSpy).toHaveBeenCalledWith(['/register']);
    });

    it('should navigate to recover password page', () => {
      const navigateSpy = spyOn(router, 'navigate');
      component.goToRecoverPassword();
      expect(navigateSpy).toHaveBeenCalledWith(['/recover-password']);
    });
  });

  describe('Error Messages', () => {
    it('should return correct email error messages', () => {
      const emailControl = component.loginForm.get('email');

      emailControl?.setValue('');
      expect(component.getEmailErrors()).toContain('El correo electrónico es requerido');

      emailControl?.setValue('invalid');
      expect(component.getEmailErrors()).toContain('Por favor ingresa un correo electrónico válido');

      emailControl?.setValue('test@domain');
      expect(component.getEmailErrors()).toContain('El correo electrónico debe incluir un dominio con TLD (ej: .com, .cl, .net)');

      emailControl?.setValue('test@domain.org');
      expect(component.getEmailErrors()).toContain('Solo se permiten dominios .com, .cl o .net');
    });
  });
});
