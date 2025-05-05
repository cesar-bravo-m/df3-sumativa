import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { BehaviorSubject } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let currentUserSubject: BehaviorSubject<any>;

  const mockUser = {
    id: 1,
    username: 'testuser',
    password: 'testpass',
    email: 'test@example.com',
    moderator: false,
    roles: ['NORMAL_POSTER']
  };

  const mockUsers = [mockUser];

  beforeEach(() => {
    (AuthService as any).storedUsers = mockUsers;
    TestBed.configureTestingModule({
      providers: [AuthService]
    });

    service = TestBed.inject(AuthService);
    currentUserSubject = (service as any).currentUserSubject;
  });

  it('debería ser creado', () => {
    expect(service).toBeTruthy();
  });

  describe('Inicialización', () => {
    it('debería inicializarse sin usuario actual', () => {
      expect(service.isLoggedIn()).toBeFalse();
      expect(currentUserSubject.value).toBeNull();
    });

  });

  describe('Inicio de sesión', () => {
    it('debería iniciar sesión exitosamente con credenciales correctas', () => {
      (service as any).users = [mockUser];
      const result = service.login(mockUser.email, mockUser.password);
      expect(result).toBeTrue();
    });

    it('debería fallar el inicio de sesión con credenciales incorrectas', () => {
      const result = service.login('wrong@email.com', 'wrongpass');
      expect(result).toBeFalse();
      expect(service.isLoggedIn()).toBeFalse();
      expect(currentUserSubject.value).toBeNull();
    });
  });

  describe('Registro', () => {
    it('debería registrar un nuevo usuario exitosamente', () => {
      const newUser = {
        username: 'newuser',
        password: 'newpass',
        email: 'new@example.com'
      };

      const result = service.register(newUser.username, newUser.password, newUser.email);
      expect(result).toBeTrue();
    });

    it('debería fallar el registro con un email existente', () => {
      (service as any).users = [mockUser];
      const result = service.register('newuser', 'newpass', mockUser.email);
      expect(result).toBeFalse();
    });
  });

  describe('Recuperación de contraseña', () => {
    it('debería devolver el código de verificación para un email existente', () => {
      (service as any).users = [mockUser];
      service.recoverPassword(mockUser.email).subscribe((code) => {
        expect(code).toBe('000');
      });
    });

    it('debería devolver una cadena vacía para un email inexistente', () => {
      service.recoverPassword('nonexistent@example.com').subscribe((code) => {
        expect(code).not.toBe('000');
      });
    });
  });

  describe('Actualización de contraseña', () => {
    beforeEach(() => {
      service.login(mockUser.email, mockUser.password);
    });

    it('debería fallar la actualización de contraseña para un email inexistente', () => {
      const result = service.updatePassword('nonexistent@example.com', 'newpass');
      expect(result).toBeFalse();
    });
  });

  describe('Actualización de nombre de usuario', () => {
    beforeEach(() => {
      service.login(mockUser.email, mockUser.password);
    });

    it('debería actualizar el nombre de usuario exitosamente', () => {
      (service as any).users = [mockUser];
      const newUsername = 'newusername';
      const result = service.updateUsername(mockUser.email, newUsername);
      expect(result).toBeTrue();
      const updatedUser = { ...mockUser, username: newUsername };
    });

    it('debería fallar la actualización de nombre de usuario para un email inexistente', () => {
      const result = service.updateUsername('nonexistent@example.com', 'newusername');
      (service as any).users = [mockUser];
      expect(result).toBeFalse();
    });
  });

  describe('Cierre de sesión', () => {
    beforeEach(() => {
      service.login(mockUser.email, mockUser.password);
    });

    it('debería cerrar sesión exitosamente', () => {
      service.logout();
      expect(service.isLoggedIn()).toBeFalse();
      expect(currentUserSubject.value).toBeNull();
    });
  });
});
