import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'stockStatus', standalone: true })
export class StockStatusPipe implements PipeTransform {
  transform(currentStock: number, minimumStock: number): string {
    if (currentStock === 0) return 'out-of-stock';
    if (currentStock <= minimumStock) return 'low-stock';
    return 'in-stock';
  }
}
