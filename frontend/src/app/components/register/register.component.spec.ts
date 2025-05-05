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

  it('debería crear', () => {
    expect(component).toBeTruthy();
  });

  describe('Estado inicial', () => {
    it('debería inicializarse con el formulario vacío', () => {
      expect(component.registerForm.get('username')?.value).toBe('');
      expect(component.registerForm.get('email')?.value).toBe('');
      expect(component.registerForm.get('password')?.value).toBe('');
      expect(component.registerForm.get('confirmPassword')?.value).toBe('');
    });
  });

  describe('Validación de nombre de usuario', () => {
    it('debería requerir nombre de usuario', () => {
      const usernameControl = component.registerForm.get('username');
      usernameControl?.setValue('');
      expect(usernameControl?.valid).toBeFalse();
      expect(usernameControl?.errors?.['required']).toBeTruthy();
    });

    it('debería validar la longitud mínima', () => {
      const usernameControl = component.registerForm.get('username');
      usernameControl?.setValue('ab');
      expect(usernameControl?.valid).toBeFalse();
      expect(usernameControl?.errors?.['minlength']).toBeTruthy();
    });

    it('debería validar la longitud máxima', () => {
      const usernameControl = component.registerForm.get('username');
      usernameControl?.setValue('abcdefghijklm');
      expect(usernameControl?.valid).toBeFalse();
      expect(usernameControl?.errors?.['maxlength']).toBeTruthy();
    });

    it('debería validar el patrón (solo alfanumérico)', () => {
      const usernameControl = component.registerForm.get('username');
      usernameControl?.setValue('test@user');
      expect(usernameControl?.valid).toBeFalse();
      expect(usernameControl?.errors?.['pattern']).toBeTruthy();
    });

    it('debería devolver los mensajes de error correctos para el nombre de usuario', () => {
      const usernameControl = component.registerForm.get('username');

      usernameControl?.setValue('');
      expect(component.getUsernameErrors()).toContain('El nombre de usuario es requerido');

      usernameControl?.setValue('ab');
      expect(component.getUsernameErrors()).toContain('El nombre de usuario debe tener al menos 3 caracteres');

      // usernameControl?.setValue('abcdefghijklm');
      // expect(component.getUsernameErrors()).toContain('El nombre de usuario no debe exceder 12 caracteres');

      usernameControl?.setValue('test@user');
      expect(component.getUsernameErrors()).toContain('El nombre de usuario no puede contener caracteres especiales');
    });
  });

  describe('Validación de email', () => {
    it('debería requerir email', () => {
      const emailControl = component.registerForm.get('email');
      emailControl?.setValue('');
      expect(emailControl?.valid).toBeFalse();
      expect(emailControl?.errors?.['required']).toBeTruthy();
    });

    it('debería validar el formato del email', () => {
      const emailControl = component.registerForm.get('email');
      emailControl?.setValue('invalid-email');
      expect(emailControl?.valid).toBeFalse();
      expect(emailControl?.errors?.['email']).toBeTruthy();
    });

    it('debería validar la presencia del TLD', () => {
      const emailControl = component.registerForm.get('email');
      emailControl?.setValue('test@domain');
      expect(emailControl?.valid).toBeFalse();
      expect(emailControl?.errors?.['noTld']).toBeTruthy();
    });

    it('debería validar los TLDs permitidos', () => {
      const emailControl = component.registerForm.get('email');
      emailControl?.setValue('test@domain.org');
      expect(emailControl?.valid).toBeFalse();
      expect(emailControl?.errors?.['invalidTld']).toBeTruthy();
    });

    it('debería aceptar TLDs válidos', () => {
      const emailControl = component.registerForm.get('email');
      emailControl?.setValue('test@domain.com');
      expect(emailControl?.valid).toBeTrue();
      emailControl?.setValue('test@domain.cl');
      expect(emailControl?.valid).toBeTrue();
      emailControl?.setValue('test@domain.net');
      expect(emailControl?.valid).toBeTrue();
    });

    it('debería devolver los mensajes de error correctos para el email', () => {
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

  describe('Validación de contraseña', () => {
    it('debería requerir contraseña', () => {
      const passwordControl = component.registerForm.get('password');
      passwordControl?.setValue('');
      expect(passwordControl?.valid).toBeFalse();
      expect(passwordControl?.errors?.['required']).toBeTruthy();
    });

    it('debería validar los requisitos de la contraseña a través de mensajes de error', () => {
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

    it('debería validar la coincidencia de contraseñas', () => {
      component.registerForm.patchValue({
        password: 'Valid123!',
        confirmPassword: 'Different123!'
      });
      expect(component.registerForm.errors?.['mismatch']).toBeTruthy();
    });

  });

  describe('Envío del formulario', () => {
    // it('debería manejar el registro exitoso', () => {
    //   const navigateSpy = spyOn(router, 'navigate');
    //   authService.register.and.returnValue(true);

    //   component.registerForm.patchValue({
    //     username: 'testuser',
    //     email: 'test@domain.com',
    //     password: 'Valid123!',
    //     confirmPassword: 'Valid123!'
    //   });

    //   component.onSubmit();

    //   expect(authService.register).toHaveBeenCalledWith('testuser', 'Valid123!', 'test@domain.com');
    //   expect(navigateSpy).toHaveBeenCalledWith(['/login']);
    //   expect(component.errorMessage).toBe('');
    // });

    it('debería manejar un nombre de usuario existente', () => {
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

    it('no debería enviar un formulario inválido', () => {
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

  describe('Métodos de validación', () => {
    describe('Validación de nombre de usuario', () => {
      beforeEach(() => {
        component.registerForm.patchValue({ username: '' });
      });

      it('debería validar la longitud mínima del nombre de usuario', () => {
        component.registerForm.patchValue({ username: 'ab' });
        expect(component.hasUsernameMinLength()).toBeFalse();

        component.registerForm.patchValue({ username: 'abc' });
        expect(component.hasUsernameMinLength()).toBeTrue();
      });

      it('debería validar la longitud máxima del nombre de usuario', () => {
        component.registerForm.patchValue({ username: 'abcdefghijklm' });
        expect(component.hasUsernameMaxLength()).toBeFalse();

        component.registerForm.patchValue({ username: 'abcdefghijkl' });
        expect(component.hasUsernameMaxLength()).toBeTrue();
      });

      it('debería validar los caracteres permitidos en el nombre de usuario', () => {
        component.registerForm.patchValue({ username: 'test@user' });
        expect(component.hasValidUsernameChars()).toBeFalse();

        component.registerForm.patchValue({ username: 'testuser123' });
        expect(component.hasValidUsernameChars()).toBeTrue();
      });
    });

    describe('Validación de email', () => {
      beforeEach(() => {
        component.registerForm.patchValue({ email: '' });
      });

      it('debería validar el formato del email', () => {
        component.registerForm.patchValue({ email: 'invalid-email' });
        expect(component.hasValidEmailFormat()).toBeFalse();

        component.registerForm.patchValue({ email: 'test@domain.com' });
        expect(component.hasValidEmailFormat()).toBeTrue();
      });

      it('debería validar los TLDs permitidos', () => {
        component.registerForm.patchValue({ email: 'test@domain.org' });
        expect(component.hasValidTld()).toBeFalse();

        component.registerForm.patchValue({ email: 'test@domain.com' });
        expect(component.hasValidTld()).toBeTrue();

        component.registerForm.patchValue({ email: 'test@domain.cl' });
        expect(component.hasValidTld()).toBeTrue();

        component.registerForm.patchValue({ email: 'test@domain.net' });
        expect(component.hasValidTld()).toBeTrue();
      });
    });

    describe('Validación de contraseña', () => {
      beforeEach(() => {
        component.registerForm.patchValue({ password: '' });
      });

      it('debería validar la longitud mínima de la contraseña', () => {
        component.registerForm.patchValue({ password: '1234567' });
        expect(component.hasMinLength()).toBeFalse();

        component.registerForm.patchValue({ password: '12345678' });
        expect(component.hasMinLength()).toBeTrue();
      });

      it('debería validar la longitud máxima de la contraseña', () => {
        component.registerForm.patchValue({ password: 'a'.repeat(33) });
        expect(component.hasMaxLength()).toBeFalse();

        component.registerForm.patchValue({ password: 'a'.repeat(32) });
        expect(component.hasMaxLength()).toBeTrue();
      });

      it('debería validar la presencia de letras en la contraseña', () => {
        component.registerForm.patchValue({ password: '12345678' });
        expect(component.hasLetter()).toBeFalse();

        component.registerForm.patchValue({ password: '1234567a' });
        expect(component.hasLetter()).toBeTrue();
      });

      it('debería validar la presencia de números en la contraseña', () => {
        component.registerForm.patchValue({ password: 'abcdefgh' });
        expect(component.hasNumber()).toBeFalse();

        component.registerForm.patchValue({ password: 'abcdefg1' });
        expect(component.hasNumber()).toBeTrue();
      });

      it('debería validar la presencia de caracteres especiales en la contraseña', () => {
        component.registerForm.patchValue({ password: 'abc12345' });
        expect(component.hasSpecialChar()).toBeFalse();

        component.registerForm.patchValue({ password: 'abc12345!' });
        expect(component.hasSpecialChar()).toBeTrue();
      });
    });
  });
});
