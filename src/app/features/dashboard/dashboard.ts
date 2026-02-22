import { Component, OnInit, inject, signal } from '@angular/core';
import { DashboardService, DashboardStats } from '../../core/services/dashboard.service';
import { StockChart } from './components/stock-chart/stock-chart';
import { MovementsChart } from './components/movements-chart/movements-chart';
import { RecentMovements } from './components/recent-movements/recent-movements';
import { LowStockList } from './components/low-stock-list/low-stock-list';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [StockChart, MovementsChart, RecentMovements, LowStockList],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private dashboardService = inject(DashboardService);
  stats = signal<DashboardStats | null>(null);

  ngOnInit(): void {
    this.dashboardService.getStats().subscribe(s => this.stats.set(s));
  }
}
