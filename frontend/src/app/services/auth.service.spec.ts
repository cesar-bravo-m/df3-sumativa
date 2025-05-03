import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { BehaviorSubject } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let localStorageSpy: jasmine.SpyObj<Storage>;
  let currentUserSubject: BehaviorSubject<any>;

  const mockUser = {
    username: 'testuser',
    password: 'testpass',
    email: 'test@example.com'
  };

  const mockUsers = [mockUser];

  beforeEach(() => {
    localStorageSpy = jasmine.createSpyObj('localStorage', ['getItem', 'setItem', 'removeItem']);
    Object.defineProperty(window, 'localStorage', { value: localStorageSpy });

    // Mock initial users array
    (AuthService as any).storedUsers = mockUsers;
    localStorageSpy.getItem.withArgs('users').and.returnValue(JSON.stringify(mockUsers));
    localStorageSpy.getItem.withArgs('currentUser').and.returnValue(null);

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

    it('debería cargar el usuario actual desde localStorage si está disponible', () => {
      localStorageSpy.getItem.withArgs('currentUser').and.returnValue(JSON.stringify(mockUser));
      const newService = new AuthService();
      expect(newService.isLoggedIn()).toBeTrue();
      expect((newService as any).currentUserSubject.value).toEqual(mockUser);
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
      expect(localStorageSpy.setItem).not.toHaveBeenCalledWith('currentUser', jasmine.any(String));
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
      expect(localStorageSpy.setItem).toHaveBeenCalledWith('users', jasmine.any(String));
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
      const code = service.recoverPassword(mockUser.email);
      expect(code).toBe('000');
    });

    it('debería devolver una cadena vacía para un email inexistente', () => {
      const code = service.recoverPassword('nonexistent@example.com');
      expect(code).toBe('');
    });
  });

  describe('Actualización de contraseña', () => {
    beforeEach(() => {
      service.login(mockUser.email, mockUser.password);
    });

    // it('debería actualizar la contraseña exitosamente', () => {
    //   const newPassword = 'newpass123';
    //   (service as any).users = [mockUser];
    //   const result = service.updatePassword(mockUser.email, newPassword);
    //   expect(result).toBeTrue();
    //   expect(localStorageSpy.setItem).toHaveBeenCalledWith('users', JSON.stringify({ ...mockUser, password: newPassword }));
    //   expect(localStorageSpy.setItem).toHaveBeenCalledWith('users', JSON.stringify([{ ...mockUser, password: newPassword }]));
    // });

    it('debería fallar la actualización de contraseña para un email inexistente', () => {
      const result = service.updatePassword('nonexistent@example.com', 'newpass');
      expect(result).toBeFalse();
      expect(localStorageSpy.setItem).not.toHaveBeenCalledWith('currentUser', jasmine.any(Object));
      expect(localStorageSpy.setItem).not.toHaveBeenCalledWith('users', jasmine.any(Object));
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
      expect(localStorageSpy.setItem).toHaveBeenCalledWith('users', JSON.stringify([updatedUser]));
    });

    it('debería fallar la actualización de nombre de usuario para un email inexistente', () => {
      const result = service.updateUsername('nonexistent@example.com', 'newusername');
      (service as any).users = [mockUser];
      expect(result).toBeFalse();
      expect(localStorageSpy.setItem).not.toHaveBeenCalledWith('currentUser', jasmine.any(Object));
      expect(localStorageSpy.setItem).not.toHaveBeenCalledWith('users', jasmine.any(Object));
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
      expect(localStorageSpy.removeItem).toHaveBeenCalledWith('currentUser');
    });
  });
});
