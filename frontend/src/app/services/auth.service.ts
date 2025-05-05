import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, tap, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface User {
  id: number;
  username: string;
  email: string;
  role: 'MODERATOR' | 'NORMAL_POSTER';
  roles?: string[];
  moderator?: boolean;
  token?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
  role: 'MODERATOR' | 'NORMAL_POSTER';
}

export interface JwtResponse {
  accessToken: string;
  type: string;
  id: number;
  username: string;
  email: string;
  role: 'MODERATOR' | 'NORMAL_POSTER';
  roles: string[];
  moderator?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private readonly API_URL = environment.authApiUrl;

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  login(email: string, password: string): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(`${this.API_URL}/api/auth/signin`, { email, password })
      .pipe(
        tap(response => {
          const user: User = {
            id: response.id,
            username: response.username,
            email: response.email,
            role: response.role,
            moderator: response.moderator ? response.moderator : false,
            roles: response.roles,
            token: response.accessToken
          };
          this.currentUserSubject.next(user);
          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.setItem('token', response.accessToken);
        })
      );
  }

  register(username: string, password: string, email: string): boolean {
    const signupRequest: SignupRequest = {
      username: username,
      email: email,
      password: password,
      role: 'NORMAL_POSTER'
    };
    this.http.post(`${this.API_URL}/api/auth/signup`, signupRequest).subscribe((response: any) => {
      if (response && response.message === "User registered successfully!") {
        return true;
      }
      return false;
    });
    return true;
  }

  getUserFromEmail(email: string): Observable<User> {
    const token = this.getToken();
    const response = this.http.get(`${this.API_URL}/api/users/email/${email}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).pipe(
      map((response: any) => response)
    );
    return response;
  }

  updatePassword(email: string, password: string): Observable<boolean> {
    return this.getUserFromEmail(email).pipe(
      tap(user => console.log("### updatePassword - Got user:", user)),
      switchMap((user: User) => {
        return this.http.put<boolean>(`${this.API_URL}/api/users/${user.id}`,
          {
            username: user.username,
            email: user.email,
            role: user.role,
            password: password
          });
      })
    );
  }

  recoverPassword(email: string): Observable<string> {
    return this.getUserFromEmail(email).pipe(
      map((user: User) => {
        return '000';
      })
    );
  }

  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  updateUsername(email: string, newUsername: string): Observable<any> {
    return this.getUserFromEmail(email).pipe(
      tap(user => console.log("### updateUsername - Got user:", user)),
      switchMap((user: User) => this.http.put<boolean>(`${this.API_URL}/api/users/${user.id}`,
        {
          username: newUsername,
          email: user.email,
          role: user.role,
          password: 'null' // valor mágico para que no se actualice la contraseña
        }))
    );
  }

  updateEmail(id: number, newEmail: string): Observable<any> {
    return this.http.put(`${this.API_URL}/api/users/${id}`, { email: newEmail });
  }
}
