import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { BehaviorSubject } from 'rxjs';

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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should initialize with current user data', () => {
      expect(component.currentUser).toEqual(mockUser);
      expect(component.profileForm.get('username')?.value).toBe(mockUser.username);
    });

    it('should redirect to login if no user is logged in', () => {
      const navigateSpy = spyOn(router, 'navigate');
      currentUserSubject.next(null);
      expect(navigateSpy).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('Form Validation', () => {
    it('should mark username as invalid when empty', () => {
      const usernameControl = component.profileForm.get('username');
      usernameControl?.setValue('');
      expect(usernameControl?.valid).toBeFalse();
      expect(usernameControl?.errors?.['required']).toBeTruthy();
    });

    it('should mark username as invalid when too short', () => {
      const usernameControl = component.profileForm.get('username');
      usernameControl?.setValue('ab');
      expect(usernameControl?.valid).toBeFalse();
      expect(usernameControl?.errors?.['minlength']).toBeTruthy();
    });

    it('should mark username as invalid when too long', () => {
      const usernameControl = component.profileForm.get('username');
      usernameControl?.setValue('abcdefghijklm');
      expect(usernameControl?.valid).toBeFalse();
      expect(usernameControl?.errors?.['maxlength']).toBeTruthy();
    });

    it('should mark username as invalid with special characters', () => {
      const usernameControl = component.profileForm.get('username');
      usernameControl?.setValue('test@user');
      expect(usernameControl?.valid).toBeFalse();
      expect(usernameControl?.errors?.['pattern']).toBeTruthy();
    });

    it('should require current password', () => {
      const passwordControl = component.profileForm.get('currentPassword');
      passwordControl?.setValue('');
      expect(passwordControl?.valid).toBeFalse();
      expect(passwordControl?.errors?.['required']).toBeTruthy();
    });

    it('should validate password match', () => {
      component.profileForm.patchValue({
        newPassword: 'newpass123',
        confirmPassword: 'differentpass'
      });
      expect(component.profileForm.errors?.['mismatch']).toBeTruthy();
    });
  });

  describe('Password Validation', () => {
    it('should validate minimum length', () => {
      component.profileForm.get('newPassword')?.setValue('short');
      expect(component.hasMinLength()).toBeFalse();
      component.profileForm.get('newPassword')?.setValue('longenough');
      expect(component.hasMinLength()).toBeTrue();
    });

    it('should validate maximum length', () => {
      component.profileForm.get('newPassword')?.setValue('a'.repeat(33));
      expect(component.hasMaxLength()).toBeFalse();
      component.profileForm.get('newPassword')?.setValue('a'.repeat(32));
      expect(component.hasMaxLength()).toBeTrue();
    });

    it('should validate letter requirement', () => {
      component.profileForm.get('newPassword')?.setValue('12345678');
      expect(component.hasLetter()).toBeFalse();
      component.profileForm.get('newPassword')?.setValue('abc12345');
      expect(component.hasLetter()).toBeTrue();
    });

    it('should validate number requirement', () => {
      component.profileForm.get('newPassword')?.setValue('abcdefgh');
      expect(component.hasNumber()).toBeFalse();
      component.profileForm.get('newPassword')?.setValue('abc12345');
      expect(component.hasNumber()).toBeTrue();
    });

    it('should validate special character requirement', () => {
      component.profileForm.get('newPassword')?.setValue('abc12345');
      expect(component.hasSpecialChar()).toBeFalse();
      component.profileForm.get('newPassword')?.setValue('abc123!@#');
      expect(component.hasSpecialChar()).toBeTrue();
    });
  });

  describe('Form Submission', () => {
    it('should handle successful username update', () => {
      authService.login.and.returnValue(true);
      authService.updateUsername.and.returnValue(true);

      component.profileForm.patchValue({
        username: 'newusername',
        currentPassword: 'currentpass'
      });

      component.onSubmit();

      expect(authService.updateUsername).toHaveBeenCalledWith(mockUser.email, 'newusername');
      expect(component.successMessage).toBe('Nombre de usuario actualizado exitosamente');
      expect(component.errorMessage).toBe('');
    });

    it('should handle successful password update', () => {
      authService.login.and.returnValue(true);
      authService.updatePassword.and.returnValue(true);

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

    it('should handle incorrect current password', () => {
      authService.login.and.returnValue(false);

      component.profileForm.patchValue({
        username: 'newusername',
        currentPassword: 'wrongpass'
      });

      component.onSubmit();

      expect(component.errorMessage).toBe('La contraseña actual es incorrecta');
      expect(component.successMessage).toBe('');
    });

    it('should handle failed username update', () => {
      authService.login.and.returnValue(true);
      authService.updateUsername.and.returnValue(false);

      component.profileForm.patchValue({
        username: 'newusername',
        currentPassword: 'currentpass'
      });

      component.onSubmit();

      expect(component.errorMessage).toBe('Error al actualizar el nombre de usuario');
      expect(component.successMessage).toBe('');
    });

    it('should handle failed password update', () => {
      authService.login.and.returnValue(true);
      authService.updatePassword.and.returnValue(false);

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
  });

  describe('Logout', () => {
    it('should logout and navigate to login', () => {
      const navigateSpy = spyOn(router, 'navigate');
      component.logout();
      expect(authService.logout).toHaveBeenCalled();
      expect(navigateSpy).toHaveBeenCalledWith(['/login']);
    });
  });
});
