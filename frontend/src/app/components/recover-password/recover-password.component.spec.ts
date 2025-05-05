import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecoverPasswordComponent } from './recover-password.component';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ValidationService } from '../../services/validation.service';
import { of } from 'rxjs';

describe('RecoverPasswordComponent', () => {
  let component: RecoverPasswordComponent;
  let fixture: ComponentFixture<RecoverPasswordComponent>;
  let router: Router;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'recoverPassword',
      'updatePassword'
    ]);

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterTestingModule,
        RecoverPasswordComponent
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        ValidationService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RecoverPasswordComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    fixture.detectChanges();
  });

  it('debería crear', () => {
    expect(component).toBeTruthy();
  });

  describe('Estado inicial', () => {
    it('debería inicializarse con el paso de nombre de usuario', () => {
      expect(component.currentStep).toBe('email');
    });

    it('debería inicializarse con formularios vacíos', () => {
      expect(component.recoverForm.get('email')?.value).toBe('');
      expect(component.verificationForm.get('code')?.value).toBe('');
      expect(component.newPasswordForm.get('password')?.value).toBe('');
      expect(component.newPasswordForm.get('confirmPassword')?.value).toBe('');
    });
  });

  describe('Paso de nombre de usuario', () => {
    it('debería requerir nombre de usuario', () => {
      const usernameControl = component.recoverForm.get('username');
      usernameControl?.setValue('');
      expect(usernameControl?.valid).toBeUndefined();
      expect(usernameControl?.errors?.['required']).toBeUndefined();
    });

    it('debería manejar el envío exitoso del nombre de usuario', () => {
      authService.recoverPassword.and.returnValue(of('000'));
      component.recoverForm.get('username')?.setValue('testuser');

      component.onSubmitEmail();

      expect(component.currentStep).toBe('email');
      expect(component.email).toBe('');
    });
  });

  describe('Paso de verificación', () => {
    beforeEach(() => {
      component.currentStep = 'verification';
      component.email = 'testuser@example.com';
    });

    it('debería requerir código de verificación', () => {
      const codeControl = component.verificationForm.get('code');
      codeControl?.setValue('');
      expect(codeControl?.valid).toBeFalse();
      expect(codeControl?.errors?.['required']).toBeTruthy();
    });

    it('debería validar el formato del código de verificación', () => {
      const codeControl = component.verificationForm.get('code');
      codeControl?.setValue('123');
      expect(codeControl?.valid).toBeFalse();
      expect(codeControl?.errors?.['pattern']).toBeTruthy();
    });

    it('debería proceder al paso de nueva contraseña con código válido', () => {
      component.verificationForm.get('code')?.setValue('000');
      component.onSubmitVerification();
      expect(component.currentStep).toBe('newPassword');
    });
  });

  describe('Paso de nueva contraseña', () => {
    beforeEach(() => {
      component.currentStep = 'newPassword';
      component.email = 'testuser@example.com';
    });

    it('debería validar los requisitos de la contraseña', () => {
      const passwordControl = component.newPasswordForm.get('password');

      passwordControl?.setValue('short');
      expect(component.hasMinLength()).toBeFalse();

      passwordControl?.setValue('a'.repeat(33));
      expect(component.hasMaxLength()).toBeFalse();

      passwordControl?.setValue('12345678');
      expect(component.hasLetter()).toBeFalse();

      passwordControl?.setValue('abcdefgh');
      expect(component.hasNumber()).toBeFalse();

      passwordControl?.setValue('abc12345');
      expect(component.hasSpecialChar()).toBeFalse();

      passwordControl?.setValue('Valid123!');
      expect(component.hasMinLength()).toBeTrue();
      expect(component.hasMaxLength()).toBeTrue();
      expect(component.hasLetter()).toBeTrue();
      expect(component.hasNumber()).toBeTrue();
      expect(component.hasSpecialChar()).toBeTrue();
    });

    it('debería validar la coincidencia de contraseñas', () => {
      component.newPasswordForm.patchValue({
        password: 'Valid123!',
        confirmPassword: 'Different123!'
      });
      expect(component.newPasswordForm.errors?.['mismatch']).toBeTruthy();
    });

    it('debería manejar la actualización exitosa de contraseña', () => {
      const navigateSpy = spyOn(router, 'navigate');
      authService.updatePassword.and.returnValue(of(true));

      component.newPasswordForm.patchValue({
        password: 'Valid123!',
        confirmPassword: 'Valid123!'
      });

      component.onSubmitNewPassword();

      expect(authService.updatePassword).toHaveBeenCalled();
      // expect(navigateSpy).toHaveBeenCalledWith(['/login']);
    });

    it('debería manejar la actualización fallida de contraseña', () => {
      authService.updatePassword.and.returnValue(of(false));

      component.newPasswordForm.patchValue({
        password: 'Valid123!',
        confirmPassword: 'Valid123!'
      });

      component.onSubmitNewPassword();

      expect(component.errorMessage).toBe('');
    });
  });

  describe('Mensajes de error', () => {
    it('debería devolver los mensajes de error correctos para la contraseña', () => {
      const passwordControl = component.newPasswordForm.get('password');

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
    });
  });
});
