export type AlertSeverity = 'critical' | 'warning';

export interface StockAlert {
  id: string;
  productId: string;
  productName: string;
  currentStock: number;
  minimumStock: number;
  severity: AlertSeverity;
  createdAt: Date;
  acknowledged: boolean;
}
