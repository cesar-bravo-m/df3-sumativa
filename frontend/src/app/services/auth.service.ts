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
  token: string;
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
    console.log("### SERVICE login with email", email, "and password", password);
    return this.http.post<JwtResponse>(`${this.API_URL}/api/auth/signin`, { email, password })
      .pipe(
        tap(response => {
          const user: User = {
            id: response.id,
            username: response.username,
            email: response.email,
            role: response.role,
            moderator: response.moderator ? response.moderator : false,
            roles: response.roles
          };
          console.log("### response", response);
          this.currentUserSubject.next(user);
          // localStorage.setItem('currentUser', JSON.stringify(user));
          // localStorage.setItem('token', response.token);
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
      console.log("### response", response);
      if (response && response.message === "User registered successfully!") {
        return true;
      }
      return false;
    });
    return true;
  }

  getUserIdFromEmail(email: string): Observable<number> {
    console.log("### getUserIdFrom Email ", email);
    return this.http.get(`${this.API_URL}/api/users/email/${email}`).pipe(
      map((response: any) => response.id)
    );
  }

  updatePassword(email: string, password: string): Observable<boolean> {
    return this.getUserIdFromEmail(email).pipe(
      switchMap((userId: number) => this.http.put<boolean>(`${this.API_URL}/api/auth/update/${userId}`, { password }))
    );
  }

  recoverPassword(username: string): string {
    // this.http.post(`${this.API_URL}/api/auth/recover/${username}`, {}).subscribe((response: any) => {
    //   console.log("### response", response);
    //   if (response && response.message === "Password recovered successfully!") {
    //     return true;
    //   }
    // });
    // return false;
    return '000'
  }

  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUser(): User | null {
    return this.currentUserSubject.value;
  }

  isModerator(): boolean {
    return this.currentUserSubject.value?.role === 'MODERATOR';
  }

  // The endpoint for all "updateXXX" methods is /api/users/{id}
  updateUsername(id: number, newUsername: string): Observable<any> {
    return this.http.put(`${this.API_URL}/api/users/${id}`, { username: newUsername });
  }

  updateEmail(id: number, newEmail: string): Observable<any> {
    return this.http.put(`${this.API_URL}/api/users/${id}`, { email: newEmail });
  }
}
