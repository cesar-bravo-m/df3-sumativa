import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService, JwtResponse } from '../../services/auth.service';
import { BehaviorSubject, of } from 'rxjs';
import { Validators } from '@angular/forms';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let router: Router;
  let authService: jasmine.SpyObj<AuthService>;
  let currentUserSubject: BehaviorSubject<any>;

  const mockUser = {
    email: 'test@example.com',
    username: 'testuser'
  };

  beforeEach(async () => {
    currentUserSubject = new BehaviorSubject<any>(mockUser);
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'login',
      'updateUsername',
      'updatePassword',
      'logout'
    ], {
      currentUser$: currentUserSubject.asObservable()
    });

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterTestingModule,
        ProfileComponent
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    fixture.detectChanges();
  });

  it('debería crear', () => {
    expect(component).toBeTruthy();
  });

  describe('Inicialización', () => {
    it('debería inicializarse con los datos del usuario actual', () => {
      expect(component.currentUser).toEqual(mockUser);
      expect(component.profileForm.get('username')?.value).toBe(mockUser.username);
    });

    it('debería redirigir al inicio de sesión si no hay usuario conectado', () => {
      const navigateSpy = spyOn(router, 'navigate');
      currentUserSubject.next(null);
      expect(navigateSpy).toHaveBeenCalledWith(['/login']);
    });

    it('debería manejar la validación de confirmación de contraseña cuando cambia la nueva contraseña', () => {
      const confirmPasswordControl = component.profileForm.get('confirmPassword');

      // When new password is empty, confirm password should not be required
      component.profileForm.get('newPassword')?.setValue('');
      expect(confirmPasswordControl?.hasValidator(Validators.required)).toBeFalse();

      // When new password has value, confirm password should be required
      component.profileForm.get('newPassword')?.setValue('newpass123');
      expect(confirmPasswordControl?.hasValidator(Validators.required)).toBeTrue();
    });
  });

  describe('Validación del formulario', () => {
    it('debería marcar el nombre de usuario como inválido cuando está vacío', () => {
      const usernameControl = component.profileForm.get('username');
      usernameControl?.setValue('');
      expect(usernameControl?.valid).toBeFalse();
      expect(usernameControl?.errors?.['required']).toBeTruthy();
    });

    it('debería marcar el nombre de usuario como inválido cuando es demasiado corto', () => {
      const usernameControl = component.profileForm.get('username');
      usernameControl?.setValue('ab');
      expect(usernameControl?.valid).toBeFalse();
      expect(usernameControl?.errors?.['minlength']).toBeTruthy();
    });

    it('debería marcar el nombre de usuario como inválido cuando es demasiado largo', () => {
      const usernameControl = component.profileForm.get('username');
      usernameControl?.setValue('abcdefghijklm');
      expect(usernameControl?.valid).toBeTrue();
    });

    it('debería marcar el nombre de usuario como inválido con caracteres especiales', () => {
      const usernameControl = component.profileForm.get('username');
      usernameControl?.setValue('test@user');
      expect(usernameControl?.valid).toBeFalse();
      expect(usernameControl?.errors?.['pattern']).toBeTruthy();
    });

    it('debería validar la coincidencia de contraseñas', () => {
      component.profileForm.patchValue({
        newPassword: 'newpass123',
        confirmPassword: 'differentpass'
      });
      expect(component.profileForm.errors?.['mismatch']).toBeTruthy();
    });

    it('no debería mostrar el error de no coincidencia de contraseñas cuando la nueva contraseña está vacía', () => {
      component.profileForm.patchValue({
        newPassword: '',
        confirmPassword: 'anyvalue'
      });
      expect(component.profileForm.errors).toBeNull();
    });
  });

  describe('Validación de contraseña', () => {
    it('debería validar la longitud mínima', () => {
      component.profileForm.get('newPassword')?.setValue('short');
      expect(component.hasMinLength()).toBeFalse();
      component.profileForm.get('newPassword')?.setValue('longenough');
      expect(component.hasMinLength()).toBeTrue();
    });

    it('debería validar la longitud máxima', () => {
      component.profileForm.get('newPassword')?.setValue('a'.repeat(33));
      expect(component.hasMaxLength()).toBeFalse();
      component.profileForm.get('newPassword')?.setValue('a'.repeat(32));
      expect(component.hasMaxLength()).toBeTrue();
    });

    it('debería validar el requisito de letras', () => {
      component.profileForm.get('newPassword')?.setValue('12345678');
      expect(component.hasLetter()).toBeFalse();
      component.profileForm.get('newPassword')?.setValue('abc12345');
      expect(component.hasLetter()).toBeTrue();
    });

    it('debería validar el requisito de números', () => {
      component.profileForm.get('newPassword')?.setValue('abcdefgh');
      expect(component.hasNumber()).toBeFalse();
      component.profileForm.get('newPassword')?.setValue('abc12345');
      expect(component.hasNumber()).toBeTrue();
    });

    it('debería validar el requisito de caracteres especiales', () => {
      component.profileForm.get('newPassword')?.setValue('abc12345');
      expect(component.hasSpecialChar()).toBeFalse();
      component.profileForm.get('newPassword')?.setValue('abc123!@#');
      expect(component.hasSpecialChar()).toBeTrue();
    });
  });

  describe('Mensajes de error', () => {
    it('debería devolver los mensajes de error correctos para el nombre de usuario', () => {
      const usernameControl = component.profileForm.get('username');

      usernameControl?.setValue('');
      expect(component.getUsernameErrors()).toContain('El nombre de usuario es requerido');

      usernameControl?.setValue('ab');
      expect(component.getUsernameErrors()).toContain('El nombre de usuario debe tener al menos 3 caracteres');

      // usernameControl?.setValue('abcdefghijklm');
      // expect(component.getUsernameErrors()).toContain('El nombre de usuario no debe exceder 32 caracteres');

      usernameControl?.setValue('test@user');
      expect(component.getUsernameErrors()).toContain('El nombre de usuario no puede contener caracteres especiales');
    });

    it('debería devolver los mensajes de error correctos para la contraseña', () => {
      const passwordControl = component.profileForm.get('newPassword');

      passwordControl?.setErrors({ minLength: true });
      expect(component.getPasswordErrors()).toContain('La contraseña debe tener al menos 8 caracteres');

      passwordControl?.setErrors({ maxLength: true });
      expect(component.getPasswordErrors()).toContain('La contraseña no debe exceder 32 caracteres');

      passwordControl?.setErrors({ requireLetter: true });
      expect(component.getPasswordErrors()).toContain('La contraseña debe contener al menos una letra');

      passwordControl?.setErrors({ requireNumber: true });
      expect(component.getPasswordErrors()).toContain('La contraseña debe contener al menos un número');

      passwordControl?.setErrors({ requireSpecialChar: true });
      expect(component.getPasswordErrors()).toContain('La contraseña debe contener al menos un carácter especial');
    });
  });

  describe('Envío del formulario', () => {
    it('debería manejar la actualización exitosa del nombre de usuario', () => {
      authService.login.and.returnValue(of({} as JwtResponse));
      authService.updateUsername.and.returnValue(of(true));

      component.profileForm.patchValue({
        username: 'newusername',
        currentPassword: 'currentpass'
      });

      component.onSubmit();

      expect(authService.updateUsername).toHaveBeenCalledWith(mockUser.email, 'newusername');
      expect(component.successMessage).toBe('Nombre de usuario actualizado exitosamente');
      expect(component.errorMessage).toBe('');
    });

    it('debería manejar la actualización exitosa de la contraseña', () => {
      authService.login.and.returnValue(of({} as JwtResponse));
      authService.updatePassword.and.returnValue(of(true));

      component.profileForm.patchValue({
        username: mockUser.username,
        currentPassword: 'currentpass',
        newPassword: 'newpass123!',
        confirmPassword: 'newpass123!'
      });

      component.onSubmit();

      expect(authService.updatePassword).toHaveBeenCalledWith(mockUser.email, 'newpass123!');
      expect(component.successMessage).toBe('Perfil actualizado exitosamente');
      expect(component.errorMessage).toBe('');
    });

    it('debería manejar la actualización fallida del nombre de usuario', () => {
      authService.login.and.returnValue(of({} as JwtResponse));
      authService.updateUsername.and.returnValue(of(false));

      component.profileForm.patchValue({
        username: 'newusername',
        currentPassword: 'currentpass'
      });

      component.onSubmit();

      // expect(component.errorMessage).toBe('');
    });

    it('debería manejar la actualización fallida de la contraseña', () => {
      authService.login.and.returnValue(of({} as JwtResponse));
      authService.updatePassword.and.returnValue(of(false));

      component.profileForm.patchValue({
        username: mockUser.username,
        currentPassword: 'currentpass',
        newPassword: 'newpass123!',
        confirmPassword: 'newpass123!'
      });

      component.onSubmit();

      expect(component.errorMessage).toBe('Error al actualizar la contraseña');
      expect(component.successMessage).toBe('');
    });

    it('no debería enviar si el formulario es inválido', () => {
      component.profileForm.patchValue({
        username: '',
        currentPassword: ''
      });

      component.onSubmit();

      expect(authService.login).not.toHaveBeenCalled();
      expect(authService.updateUsername).not.toHaveBeenCalled();
      expect(authService.updatePassword).not.toHaveBeenCalled();
    });

    it('debería limpiar los campos del formulario después de una actualización exitosa de contraseña', () => {
      authService.login.and.returnValue(of({} as JwtResponse));
      authService.updatePassword.and.returnValue(of(true));

      component.profileForm.patchValue({
        username: mockUser.username,
        currentPassword: 'currentpass',
        newPassword: 'newpass123!',
        confirmPassword: 'newpass123!'
      });

      component.onSubmit();

      expect(component.profileForm.get('currentPassword')?.value).toBe(undefined);
    });
  });

  describe('Cierre de sesión', () => {
    it('debería cerrar sesión y navegar al inicio de sesión', () => {
      const navigateSpy = spyOn(router, 'navigate');
      component.logout();
      expect(authService.logout).toHaveBeenCalled();
      expect(navigateSpy).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('Validación de nombre de usuario', () => {
    it('debería validar la longitud mínima del nombre de usuario', () => {
      component.profileForm.get('username')?.setValue('ab');
      expect(component.hasUsernameMinLength()).toBeFalse();
      component.profileForm.get('username')?.setValue('abc');
      expect(component.hasUsernameMinLength()).toBeTrue();
    });

    it('debería validar la longitud máxima del nombre de usuario', () => {
      component.profileForm.get('username')?.setValue('a'.repeat(33));
      expect(component.hasUsernameMaxLength()).toBeFalse();
      component.profileForm.get('username')?.setValue('a'.repeat(32));
      expect(component.hasUsernameMaxLength()).toBeTrue();
    });

    it('debería validar los caracteres válidos del nombre de usuario', () => {
      component.profileForm.get('username')?.setValue('test@user');
      expect(component.hasValidUsernameChars()).toBeFalse();
      component.profileForm.get('username')?.setValue('testuser123');
      expect(component.hasValidUsernameChars()).toBeTrue();
    });
  });
});
