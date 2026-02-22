import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { StockAlert } from '../models/alert.model';
import { MOCK_PRODUCTS } from '../data/mock-products';

@Injectable({ providedIn: 'root' })
export class AlertService {
  private alerts: StockAlert[] = this.generateAlerts();

  private generateAlerts(): StockAlert[] {
    return MOCK_PRODUCTS
      .filter(p => p.currentStock <= p.minimumStock)
      .map((p, i) => ({
        id: `alert-${i + 1}`,
        productId: p.id,
        productName: p.name,
        currentStock: p.currentStock,
        minimumStock: p.minimumStock,
        severity: p.currentStock === 0 ? 'critical' as const : 'warning' as const,
        createdAt: new Date(p.updatedAt),
        acknowledged: false,
      }));
  }

  getAll(): Observable<StockAlert[]> {
    return of([...this.alerts]).pipe(delay(300));
  }

  getActive(): Observable<StockAlert[]> {
    return of(this.alerts.filter(a => !a.acknowledged)).pipe(delay(200));
  }

  getActiveCount(): Observable<number> {
    return of(this.alerts.filter(a => !a.acknowledged).length).pipe(delay(100));
  }

  acknowledge(id: string): Observable<void> {
    const alert = this.alerts.find(a => a.id === id);
    if (alert) alert.acknowledged = true;
    return of(undefined as void).pipe(delay(200));
  }
}
