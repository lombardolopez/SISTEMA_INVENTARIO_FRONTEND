import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, Role } from '../models/user.model';
import { AuthResponse } from '../models/auth.model';
import { ApiResponse } from '../models/api.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly url = `${environment.apiUrl}/auth`;
  private http = inject(HttpClient);

  private _currentUser = signal<User | null>(this.loadUserFromStorage());

  getCurrentUser() {
    return this._currentUser.asReadonly();
  }

  private loadUserFromStorage(): User | null {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.url}/login`, { email, password }).pipe(
      map((res) => res.data),
      tap((auth) => {
        localStorage.setItem('token', auth.token);
        localStorage.setItem('user', JSON.stringify(auth.user));
        this._currentUser.set(auth.user);
      }),
    );
  }

  getMe(): Observable<User> {
    return this.http.get<ApiResponse<User>>(`${this.url}/me`).pipe(map((res) => res.data));
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this._currentUser.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  hasRole(role: Role): boolean {
    return this._currentUser()?.role === role;
  }
}
