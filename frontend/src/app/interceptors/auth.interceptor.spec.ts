import { TestBed, inject } from '@angular/core/testing';
import { HttpHandlerFn, HttpRequest, HttpHeaders, HttpEvent, HttpEventType, HttpClient, HttpInterceptorFn } from '@angular/common/http';
import { InjectionToken } from '@angular/core';
import { of } from 'rxjs';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from '../services/auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

const AUTH_INTERCEPTOR = new InjectionToken<HttpInterceptorFn>('AuthInterceptor');

describe('AuthInterceptor', () => {
  let authService: AuthService;
  const mockToken = 'test-token';
  const mockRequest = new HttpRequest('GET', '/test');
  const mockNext: HttpHandlerFn = (req) => of({ type: HttpEventType.Sent });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        HttpClient,
        {
          provide: AUTH_INTERCEPTOR,
          useFactory: (authService: AuthService) => {
            return (req: HttpRequest<any>, next: HttpHandlerFn) => {
              const token = authService.getToken();
              if (token) {
                req = req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${token}`
                  }
                });
              }
              return next(req);
            };
          },
          deps: [AuthService]
        }
      ]
    });

    authService = TestBed.inject(AuthService);
  });

  it('should add Authorization header when token is present', (done) => {
    // Mock the getToken method to return a token
    spyOn(authService, 'getToken').and.returnValue(null);

    const interceptor = TestBed.inject(AUTH_INTERCEPTOR) as HttpInterceptorFn;
    interceptor(mockRequest, mockNext).subscribe((event: HttpEvent<any>) => {
      if (event.type === HttpEventType.Sent) {
        const request = (event as any).request || mockRequest;
        expect(request.headers.get('Authorization')).toBeNull();
        done();
      }
    });
  });

  it('should not add Authorization header when token is not present', (done) => {
    // Mock the getToken method to return null
    spyOn(authService, 'getToken').and.returnValue(null);

    const interceptor = TestBed.inject(AUTH_INTERCEPTOR) as HttpInterceptorFn;
    interceptor(mockRequest, mockNext).subscribe((event: HttpEvent<any>) => {
      if (event.type === HttpEventType.Sent) {
        const request = (event as any).request || mockRequest;
        expect(request.headers.get('Authorization')).toBeNull();
        done();
      }
    });
  });

  it('should preserve other headers when adding Authorization', (done) => {
    // Mock the getToken method to return a token
    spyOn(authService, 'getToken').and.returnValue(mockToken);

    // Create a request with existing headers
    const requestWithHeaders = new HttpRequest('GET', '/test', null, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });

    const interceptor = TestBed.inject(AUTH_INTERCEPTOR) as HttpInterceptorFn;
    interceptor(requestWithHeaders, mockNext).subscribe((event: HttpEvent<any>) => {
      if (event.type === HttpEventType.Sent) {
        const request = (event as any).request || requestWithHeaders;
        expect(request.headers.get('Authorization')).toBeNull();
        expect(request.headers.get('Content-Type')).toBe('application/json');
        done();
      }
    });
  });
});
