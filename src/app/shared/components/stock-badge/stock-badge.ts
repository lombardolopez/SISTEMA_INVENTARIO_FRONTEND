import { Component, computed, input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-stock-badge',
  standalone: true,
  imports: [NgClass],
  templateUrl: './stock-badge.html',
  styleUrl: './stock-badge.css',
})
export class StockBadge {
  currentStock = input.required<number>();
  minimumStock = input.required<number>();

  status = computed(() => {
    const current = this.currentStock();
    const minimum = this.minimumStock();

    if (current === 0) {
      return { label: 'Out of Stock', classes: 'bg-red-100 text-red-700 ring-red-600/20' };
    }
    if (current <= minimum) {
      return { label: 'Low Stock', classes: 'bg-amber-100 text-amber-700 ring-amber-600/20' };
    }
    return { label: 'In Stock', classes: 'bg-green-100 text-green-700 ring-green-600/20' };
  });
}
