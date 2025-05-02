import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecoverPasswordComponent } from './recover-password.component';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ValidationService } from '../../services/validation.service';

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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initial State', () => {
    it('should initialize with username step', () => {
      expect(component.currentStep).toBe('username');
    });

    it('should initialize with empty forms', () => {
      expect(component.recoverForm.get('username')?.value).toBe('');
      expect(component.verificationForm.get('code')?.value).toBe('');
      expect(component.newPasswordForm.get('password')?.value).toBe('');
      expect(component.newPasswordForm.get('confirmPassword')?.value).toBe('');
    });
  });

  describe('Username Step', () => {
    it('should require username', () => {
      const usernameControl = component.recoverForm.get('username');
      usernameControl?.setValue('');
      expect(usernameControl?.valid).toBeFalse();
      expect(usernameControl?.errors?.['required']).toBeTruthy();
    });

    it('should handle successful username submission', () => {
      authService.recoverPassword.and.returnValue('123456');
      component.recoverForm.get('username')?.setValue('testuser');

      component.onSubmitUsername();

      expect(authService.recoverPassword).toHaveBeenCalledWith('testuser');
      expect(component.currentStep).toBe('verification');
      expect(component.username).toBe('testuser');
    });
  });

  describe('Verification Step', () => {
    beforeEach(() => {
      component.currentStep = 'verification';
      component.username = 'testuser';
    });

    it('should require verification code', () => {
      const codeControl = component.verificationForm.get('code');
      codeControl?.setValue('');
      expect(codeControl?.valid).toBeFalse();
      expect(codeControl?.errors?.['required']).toBeTruthy();
    });

    it('should validate verification code format', () => {
      const codeControl = component.verificationForm.get('code');
      codeControl?.setValue('123');
      expect(codeControl?.valid).toBeFalse();
      expect(codeControl?.errors?.['pattern']).toBeTruthy();
    });

    it('should proceed to new password step with valid code', () => {
      component.verificationForm.get('code')?.setValue('000');
      component.onSubmitVerification();
      expect(component.currentStep).toBe('newPassword');
    });
  });

  describe('New Password Step', () => {
    beforeEach(() => {
      component.currentStep = 'newPassword';
      component.username = 'testuser';
    });

    it('should validate password requirements', () => {
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

    it('should validate password match', () => {
      component.newPasswordForm.patchValue({
        password: 'Valid123!',
        confirmPassword: 'Different123!'
      });
      expect(component.newPasswordForm.errors?.['mismatch']).toBeTruthy();
    });

    it('should handle successful password update', () => {
      const navigateSpy = spyOn(router, 'navigate');
      authService.updatePassword.and.returnValue(true);

      component.newPasswordForm.patchValue({
        password: 'Valid123!',
        confirmPassword: 'Valid123!'
      });

      component.onSubmitNewPassword();

      expect(authService.updatePassword).toHaveBeenCalledWith('testuser', 'Valid123!');
      expect(navigateSpy).toHaveBeenCalledWith(['/login']);
    });

    it('should handle failed password update', () => {
      authService.updatePassword.and.returnValue(false);

      component.newPasswordForm.patchValue({
        password: 'Valid123!',
        confirmPassword: 'Valid123!'
      });

      component.onSubmitNewPassword();

      expect(component.errorMessage).toBe('Error al actualizar la contraseña');
    });
  });

  describe('Error Messages', () => {
    it('should return correct password error messages', () => {
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
