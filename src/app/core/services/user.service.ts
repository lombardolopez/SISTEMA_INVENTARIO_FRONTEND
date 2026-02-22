import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { User } from '../models/user.model';
import { MOCK_USERS } from '../data/mock-users';

@Injectable({ providedIn: 'root' })
export class UserService {
  private users = [...MOCK_USERS];

  getAll(): Observable<User[]> {
    return of([...this.users]).pipe(delay(300));
  }

  getById(id: string): Observable<User | undefined> {
    return of(this.users.find(u => u.id === id)).pipe(delay(200));
  }

  create(data: Omit<User, 'id' | 'createdAt'>): Observable<User> {
    const user: User = {
      ...data,
      id: 'u-' + crypto.randomUUID().slice(0, 8),
      createdAt: new Date(),
    };
    this.users.push(user);
    return of(user).pipe(delay(300));
  }

  update(id: string, data: Partial<User>): Observable<User> {
    const index = this.users.findIndex(u => u.id === id);
    this.users[index] = { ...this.users[index], ...data };
    return of(this.users[index]).pipe(delay(300));
  }

  delete(id: string): Observable<void> {
    this.users = this.users.filter(u => u.id !== id);
    return of(undefined as void).pipe(delay(300));
  }
}
