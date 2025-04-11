import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  username: string;
  password: string;
  email?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private users: User[] = [
    { username: 'admin@example.com', password: 'admin' }
  ];
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  login(username: string, password: string): boolean {
    const user = this.users.find(u => u.username === username && u.password === password);
    if (user) {
      this.currentUserSubject.next(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    return false;
  }

  register(username: string, password: string, email: string): boolean {
    if (this.users.some(u => u.username === username)) {
      return false;
    }
    const newUser: User = { username, password, email };
    this.users.push(newUser);
    return true;
  }

  recoverPassword(username: string): string {
    const user = this.users.find(u => u.username === username);
    if (user) {
      return '000'; // Dummy verification code
    }
    return '';
  }

  updatePassword(username: string, newPassword: string): boolean {
    const userIndex = this.users.findIndex(u => u.username === username);
    if (userIndex !== -1) {
      this.users[userIndex].password = newPassword;
      if (this.currentUserSubject.value?.username === username) {
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