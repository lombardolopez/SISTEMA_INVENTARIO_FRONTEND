import { Injectable, signal } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';
import { User, Role } from '../models/user.model';
import { MOCK_USERS } from '../data/mock-users';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUser = signal<User | null>(MOCK_USERS[0]);

  getCurrentUser() {
    return this.currentUser.asReadonly();
  }

  login(email: string, _password: string): Observable<User> {
    const user = MOCK_USERS.find(u => u.email === email && u.isActive);
    if (user) {
      this.currentUser.set(user);
      return of(user).pipe(delay(500));
    }
    return throwError(() => new Error('Invalid credentials'));
  }

  logout(): void {
    this.currentUser.set(null);
  }

  hasRole(...roles: Role[]): boolean {
    const user = this.currentUser();
    return user ? roles.includes(user.role) : false;
  }

  isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }
}
