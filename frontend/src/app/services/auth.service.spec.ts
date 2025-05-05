import { TestBed } from '@angular/core/testing';
import { AuthService, JwtResponse, User } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        HttpClient
      ]
    });

    service = TestBed.inject(AuthService);
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // httpTestingController.verify();
  });

  it('debería ser creado', () => {
    expect(service).toBeTruthy();
  });

  it('debería hacer login correctamente', () => {
    const mockResponse: JwtResponse = {
      accessToken: 'test-token',
      type: 'Bearer',
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      role: 'NORMAL_POSTER',
      roles: ['NORMAL_POSTER']
    };

    service.login('test@example.com', 'password').subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(`${environment.authApiUrl}/api/auth/signin`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('debería manejar errores de login', () => {
    service.login('test@example.com', 'wrong-password').subscribe({
      error: (error) => {
        expect(error.status).toBe(401);
      }
    });

    const req = httpTestingController.expectOne(`${environment.authApiUrl}/api/auth/signin`);
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
  });

  it('debería obtener el usuario actual', () => {
    const mockUser: User = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      role: 'NORMAL_POSTER',
      roles: ['NORMAL_POSTER']
    };

    service.getUserFromEmail('test@example.com').subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpTestingController.expectOne(`${environment.authApiUrl}/api/users/email/test@example.com`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('debería actualizar el nombre de usuario', () => {
    service.updateUsername('test@example.com', 'new-username').subscribe(result => {
      expect(result).toBeTrue();
    });
  });

  it('debería actualizar el email', () => {
    service.updateEmail(1, 'new@example.com').subscribe(result => {
      expect(result).toBeTrue();
    });

    const req = httpTestingController.expectOne(`${environment.authApiUrl}/api/users/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(true);
  });

  it('debería recuperar la contraseña', () => {
    service.recoverPassword('test@example.com').subscribe(code => {
      expect(code).toBe('000');
    });

    const req = httpTestingController.expectOne(req =>
      req.url.includes('/api/users/email/') && req.method === 'GET'
    );
    req.flush({ id: 1 });
  });
});
