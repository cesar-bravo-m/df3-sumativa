import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  username: string;
  password: string;
  email?: string;
}

const storedUsers = [
  {
    username: 'admin',
    password: 'admin',
    email: 'admin@example.com'
  },
]

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private users: User[] = [];
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      this.users = storedUsers;
      localStorage.setItem('users', JSON.stringify(this.users));
    }

    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  login(email: string, password: string): boolean {
    const user = this.users.find(u => u.email === email && u.password === password);
    if (user) {
      this.currentUserSubject.next(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    return false;
  }

  register(username: string, password: string, email: string): boolean {
    if (this.users.some(u => u.email === email)) {
      return false;
    }
    const newUser: User = { username, password, email };
    this.users.push(newUser);
    localStorage.setItem('users', JSON.stringify(this.users));
    return true;
  }

  recoverPassword(email: string): string {
    const user = this.users.find(u => u.email === email);
    if (user) {
      return '000'; // Dummy verification code
    }
    return '';
  }

  updatePassword(email: string, newPassword: string): boolean {
    const userIndex = this.users.findIndex(u => u.email === email);
    if (userIndex !== -1) {
      this.users[userIndex].password = newPassword;
      if (this.currentUserSubject.value?.email === email) {
        this.currentUserSubject.next({ ...this.users[userIndex] });
        localStorage.setItem('currentUser', JSON.stringify(this.users[userIndex]));
      }
      return true;
    }
    return false;
  }

  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }
}
