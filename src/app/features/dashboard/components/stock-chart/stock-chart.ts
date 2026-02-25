import { Component, OnInit, inject, signal } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js';
import { ChartConfiguration } from 'chart.js';
import { DashboardService, CategoryStock } from '../../../../core/services/dashboard.service';

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

@Component({
  selector: 'app-stock-chart',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './stock-chart.html',
  styleUrl: './stock-chart.css',
})
export class StockChart implements OnInit {
  private dashboardService = inject(DashboardService);

  chartConfig = signal<ChartConfiguration<'doughnut'> | null>(null);

  ngOnInit(): void {
    this.dashboardService.getStockByCategory().subscribe((data) => {
      this.chartConfig.set({
        type: 'doughnut',
        data: {
          labels: data.map((c) => c.name),
          datasets: [
            {
              data: data.map((c) => c.totalStock),
              backgroundColor: data.map((c) => c.color),
              borderWidth: 2,
              borderColor: '#ffffff',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                padding: 16,
                usePointStyle: true,
                pointStyle: 'circle',
              },
            },
            tooltip: {
              callbacks: {
                label: (ctx) => `${ctx.label}: ${ctx.parsed} units`,
              },
            },
          },
        },
      });
    });
  }
}
