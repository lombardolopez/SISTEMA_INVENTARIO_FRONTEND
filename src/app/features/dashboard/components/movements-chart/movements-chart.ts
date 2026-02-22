import { Component, OnInit, inject, signal } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { ChartConfiguration } from 'chart.js';
import { DashboardService } from '../../../../core/services/dashboard.service';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

@Component({
  selector: 'app-movements-chart',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './movements-chart.html',
  styleUrl: './movements-chart.css',
})
export class MovementsChart implements OnInit {
  private dashboardService = inject(DashboardService);

  chartConfig = signal<ChartConfiguration<'bar'> | null>(null);

  ngOnInit(): void {
    this.dashboardService.getMovementsByDay(7).subscribe(data => {
      this.chartConfig.set({
        type: 'bar',
        data: {
          labels: data.map(d => d.date),
          datasets: [
            {
              label: 'Entries',
              data: data.map(d => d.entries),
              backgroundColor: '#10b981',
              borderRadius: 4,
            },
            {
              label: 'Exits',
              data: data.map(d => d.exits),
              backgroundColor: '#ef4444',
              borderRadius: 4,
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
          },
          scales: {
            x: {
              grid: { display: false },
            },
            y: {
              beginAtZero: true,
              ticks: { stepSize: 1 },
            },
          },
        },
      });
    });
  }
}
