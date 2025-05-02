import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ValidationService } from '../../services/validation.service';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let router: Router;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['register']);

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterTestingModule,
        RegisterComponent
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        ValidationService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initial State', () => {
    it('should initialize with empty form', () => {
      expect(component.registerForm.get('username')?.value).toBe('');
      expect(component.registerForm.get('email')?.value).toBe('');
      expect(component.registerForm.get('password')?.value).toBe('');
      expect(component.registerForm.get('confirmPassword')?.value).toBe('');
    });
  });

  describe('Username Validation', () => {
    it('should require username', () => {
      const usernameControl = component.registerForm.get('username');
      usernameControl?.setValue('');
      expect(usernameControl?.valid).toBeFalse();
      expect(usernameControl?.errors?.['required']).toBeTruthy();
    });

    it('should validate minimum length', () => {
      const usernameControl = component.registerForm.get('username');
      usernameControl?.setValue('ab');
      expect(usernameControl?.valid).toBeFalse();
      expect(usernameControl?.errors?.['minlength']).toBeTruthy();
    });

    it('should validate maximum length', () => {
      const usernameControl = component.registerForm.get('username');
      usernameControl?.setValue('abcdefghijklm');
      expect(usernameControl?.valid).toBeFalse();
      expect(usernameControl?.errors?.['maxlength']).toBeTruthy();
    });

    it('should validate pattern (alphanumeric only)', () => {
      const usernameControl = component.registerForm.get('username');
      usernameControl?.setValue('test@user');
      expect(usernameControl?.valid).toBeFalse();
      expect(usernameControl?.errors?.['pattern']).toBeTruthy();
    });

    it('should return correct username error messages', () => {
      const usernameControl = component.registerForm.get('username');

      usernameControl?.setValue('');
      expect(component.getUsernameErrors()).toContain('El nombre de usuario es requerido');

      usernameControl?.setValue('ab');
      expect(component.getUsernameErrors()).toContain('El nombre de usuario debe tener al menos 3 caracteres');

      usernameControl?.setValue('abcdefghijklm');
      expect(component.getUsernameErrors()).toContain('El nombre de usuario no debe exceder 12 caracteres');

      usernameControl?.setValue('test@user');
      expect(component.getUsernameErrors()).toContain('El nombre de usuario no puede contener caracteres especiales');
    });
  });

  describe('Email Validation', () => {
    it('should require email', () => {
      const emailControl = component.registerForm.get('email');
      emailControl?.setValue('');
      expect(emailControl?.valid).toBeFalse();
      expect(emailControl?.errors?.['required']).toBeTruthy();
    });

    it('should validate email format', () => {
      const emailControl = component.registerForm.get('email');
      emailControl?.setValue('invalid-email');
      expect(emailControl?.valid).toBeFalse();
      expect(emailControl?.errors?.['email']).toBeTruthy();
    });

    it('should validate TLD presence', () => {
      const emailControl = component.registerForm.get('email');
      emailControl?.setValue('test@domain');
      expect(emailControl?.valid).toBeFalse();
      expect(emailControl?.errors?.['noTld']).toBeTruthy();
    });

    it('should validate allowed TLDs', () => {
      const emailControl = component.registerForm.get('email');
      emailControl?.setValue('test@domain.org');
      expect(emailControl?.valid).toBeFalse();
      expect(emailControl?.errors?.['invalidTld']).toBeTruthy();
    });

    it('should accept valid TLDs', () => {
      const emailControl = component.registerForm.get('email');
      emailControl?.setValue('test@domain.com');
      expect(emailControl?.valid).toBeTrue();
      emailControl?.setValue('test@domain.cl');
      expect(emailControl?.valid).toBeTrue();
      emailControl?.setValue('test@domain.net');
      expect(emailControl?.valid).toBeTrue();
    });

    it('should return correct email error messages', () => {
      const emailControl = component.registerForm.get('email');

      emailControl?.setValue('');
      expect(component.getEmailErrors()).toContain('El correo electrónico es requerido');

      emailControl?.setValue('invalid-email');
      expect(component.getEmailErrors()).toContain('Por favor ingresa un correo electrónico válido');

      emailControl?.setValue('test@domain');
      expect(component.getEmailErrors()).toContain('El correo electrónico debe incluir un dominio con TLD (ej: .com, .cl, .net)');

      emailControl?.setValue('test@domain.org');
      expect(component.getEmailErrors()).toContain('Solo se permiten dominios .com, .cl o .net');
    });
  });

  describe('Password Validation', () => {
    it('should require password', () => {
      const passwordControl = component.registerForm.get('password');
      passwordControl?.setValue('');
      expect(passwordControl?.valid).toBeFalse();
      expect(passwordControl?.errors?.['required']).toBeTruthy();
    });

    it('should validate password requirements through error messages', () => {
      const passwordControl = component.registerForm.get('password');

      passwordControl?.setValue('short');
      expect(component.getPasswordErrors()).toContain('La contraseña debe tener al menos 8 caracteres');

      passwordControl?.setValue('a'.repeat(33));
      expect(component.getPasswordErrors()).toContain('La contraseña no debe exceder 32 caracteres');

      passwordControl?.setValue('12345678');
      expect(component.getPasswordErrors()).toContain('La contraseña debe contener al menos una letra');

      passwordControl?.setValue('abcdefgh');
      expect(component.getPasswordErrors()).toContain('La contraseña debe contener al menos un número');

      passwordControl?.setValue('abc12345');
      expect(component.getPasswordErrors()).toContain('La contraseña debe contener al menos un carácter especial');

      passwordControl?.setValue('Valid123!');
      expect(component.getPasswordErrors()).toEqual([]);
    });

    it('should validate password match', () => {
      component.registerForm.patchValue({
        password: 'Valid123!',
        confirmPassword: 'Different123!'
      });
      expect(component.registerForm.errors?.['mismatch']).toBeTruthy();
    });

  });

  describe('Form Submission', () => {
    it('should handle successful registration', () => {
      const navigateSpy = spyOn(router, 'navigate');
      authService.register.and.returnValue(true);

      component.registerForm.patchValue({
        username: 'testuser',
        email: 'test@domain.com',
        password: 'Valid123!',
        confirmPassword: 'Valid123!'
      });

      component.onSubmit();

      expect(authService.register).toHaveBeenCalledWith('testuser', 'Valid123!', 'test@domain.com');
      expect(navigateSpy).toHaveBeenCalledWith(['/login']);
      expect(component.errorMessage).toBe('');
    });

    it('should handle existing username', () => {
      authService.register.and.returnValue(false);

      component.registerForm.patchValue({
        username: 'existinguser',
        email: 'test@domain.com',
        password: 'Valid123!',
        confirmPassword: 'Valid123!'
      });

      component.onSubmit();

      expect(component.errorMessage).toBe('El nombre de usuario ya existe');
    });

    it('should not submit invalid form', () => {
      component.registerForm.patchValue({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      });

      component.onSubmit();

      expect(authService.register).not.toHaveBeenCalled();
    });
  });
});
