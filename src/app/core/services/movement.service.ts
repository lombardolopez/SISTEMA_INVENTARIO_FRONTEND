import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Movement, MovementType } from '../models/movement.model';
import { MOCK_MOVEMENTS } from '../data/mock-movements';

@Injectable({ providedIn: 'root' })
export class MovementService {
  private movements = [...MOCK_MOVEMENTS];

  getAll(): Observable<Movement[]> {
    return of([...this.movements].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())).pipe(delay(300));
  }

  getByProductId(productId: string): Observable<Movement[]> {
    return of(
      this.movements
        .filter(m => m.productId === productId)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    ).pipe(delay(200));
  }

  getRecent(limit: number): Observable<Movement[]> {
    return of(
      [...this.movements]
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, limit)
    ).pipe(delay(200));
  }

  getByDateRange(start: Date, end: Date): Observable<Movement[]> {
    return of(
      this.movements.filter(m => m.createdAt >= start && m.createdAt <= end)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    ).pipe(delay(200));
  }

  create(data: Omit<Movement, 'id' | 'createdAt'>): Observable<Movement> {
    const movement: Movement = {
      ...data,
      id: 'm-' + crypto.randomUUID().slice(0, 8),
      createdAt: new Date(),
    };
    this.movements.unshift(movement);
    return of(movement).pipe(delay(300));
  }
}
