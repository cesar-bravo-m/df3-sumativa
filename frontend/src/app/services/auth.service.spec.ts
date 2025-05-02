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

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should initialize with no current user', () => {
      expect(service.isLoggedIn()).toBeFalse();
      expect(currentUserSubject.value).toBeNull();
    });

    it('should load current user from localStorage if available', () => {
      localStorageSpy.getItem.withArgs('currentUser').and.returnValue(JSON.stringify(mockUser));
      const newService = new AuthService();
      expect(newService.isLoggedIn()).toBeTrue();
      expect((newService as any).currentUserSubject.value).toEqual(mockUser);
    });

  });

  describe('Login', () => {
    it('should login successfully with correct credentials', () => {
      (service as any).users = [mockUser];
      const result = service.login(mockUser.email, mockUser.password);
      expect(result).toBeTrue();
    });

    it('should fail login with incorrect credentials', () => {
      const result = service.login('wrong@email.com', 'wrongpass');
      expect(result).toBeFalse();
      expect(service.isLoggedIn()).toBeFalse();
      expect(currentUserSubject.value).toBeNull();
      expect(localStorageSpy.setItem).not.toHaveBeenCalledWith('currentUser', jasmine.any(String));
    });
  });

  describe('Registration', () => {
    it('should register new user successfully', () => {
      const newUser = {
        username: 'newuser',
        password: 'newpass',
        email: 'new@example.com'
      };

      const result = service.register(newUser.username, newUser.password, newUser.email);
      expect(result).toBeTrue();
      expect(localStorageSpy.setItem).toHaveBeenCalledWith('users', jasmine.any(String));
    });

    it('should fail registration with existing email', () => {
      (service as any).users = [mockUser];
      const result = service.register('newuser', 'newpass', mockUser.email);
      expect(result).toBeFalse();
    });
  });

  describe('Password Recovery', () => {
    it('should return verification code for existing email', () => {
      (service as any).users = [mockUser];
      const code = service.recoverPassword(mockUser.email);
      expect(code).toBe('000');
    });

    it('should return empty string for non-existent email', () => {
      const code = service.recoverPassword('nonexistent@example.com');
      expect(code).toBe('');
    });
  });

  describe('Password Update', () => {
    beforeEach(() => {
      service.login(mockUser.email, mockUser.password);
    });

    // it('should update password successfully', () => {
    //   const newPassword = 'newpass123';
    //   (service as any).users = [mockUser];
    //   const result = service.updatePassword(mockUser.email, newPassword);
    //   expect(result).toBeTrue();
    //   expect(localStorageSpy.setItem).toHaveBeenCalledWith('users', JSON.stringify({ ...mockUser, password: newPassword }));
    //   expect(localStorageSpy.setItem).toHaveBeenCalledWith('users', JSON.stringify([{ ...mockUser, password: newPassword }]));
    // });

    it('should fail password update for non-existent email', () => {
      const result = service.updatePassword('nonexistent@example.com', 'newpass');
      expect(result).toBeFalse();
      expect(localStorageSpy.setItem).not.toHaveBeenCalledWith('currentUser', jasmine.any(Object));
      expect(localStorageSpy.setItem).not.toHaveBeenCalledWith('users', jasmine.any(Object));
    });
  });

  describe('Username Update', () => {
    beforeEach(() => {
      service.login(mockUser.email, mockUser.password);
    });

    it('should update username successfully', () => {
      (service as any).users = [mockUser];
      const newUsername = 'newusername';
      const result = service.updateUsername(mockUser.email, newUsername);
      expect(result).toBeTrue();
      const updatedUser = { ...mockUser, username: newUsername };
      expect(localStorageSpy.setItem).toHaveBeenCalledWith('users', JSON.stringify([updatedUser]));
    });

    it('should fail username update for non-existent email', () => {
      const result = service.updateUsername('nonexistent@example.com', 'newusername');
      (service as any).users = [mockUser];
      expect(result).toBeFalse();
      expect(localStorageSpy.setItem).not.toHaveBeenCalledWith('currentUser', jasmine.any(Object));
      expect(localStorageSpy.setItem).not.toHaveBeenCalledWith('users', jasmine.any(Object));
    });
  });

  describe('Logout', () => {
    beforeEach(() => {
      service.login(mockUser.email, mockUser.password);
    });

    it('should logout successfully', () => {
      service.logout();
      expect(service.isLoggedIn()).toBeFalse();
      expect(currentUserSubject.value).toBeNull();
      expect(localStorageSpy.removeItem).toHaveBeenCalledWith('currentUser');
    });
  });
});
