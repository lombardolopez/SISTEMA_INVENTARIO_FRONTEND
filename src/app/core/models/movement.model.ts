export type MovementType = 'entry' | 'exit';
export type MovementReason = 'purchase' | 'production' | 'sale' | 'adjustment' | 'return';

export interface Movement {
  id: string;
  productId: string;
  productName: string;
  type: MovementType;
  quantity: number;
  reason: MovementReason;
  notes: string;
  performedBy: string;
  createdAt: Date;
}
