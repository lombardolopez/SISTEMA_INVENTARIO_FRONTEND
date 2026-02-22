import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { StockAlert, AlertSeverity } from '../../../core/models/alert.model';
import { AlertService } from '../../../core/services/alert.service';

type FilterType = 'all' | 'critical' | 'warning' | 'acknowledged';

@Component({
  selector: 'app-alert-list',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './alert-list.html',
  styleUrl: './alert-list.css',
})
export class AlertList implements OnInit {
  private alertService = inject(AlertService);

  alerts = signal<StockAlert[]>([]);
  loading = signal(false);
  filter = signal<FilterType>('all');

  criticalCount = computed(() => this.alerts().filter(a => a.severity === 'critical' && !a.acknowledged).length);
  warningCount = computed(() => this.alerts().filter(a => a.severity === 'warning' && !a.acknowledged).length);

  filteredAlerts = computed(() => {
    const f = this.filter();
    const list = this.alerts();
    switch (f) {
      case 'critical': return list.filter(a => a.severity === 'critical' && !a.acknowledged);
      case 'warning': return list.filter(a => a.severity === 'warning' && !a.acknowledged);
      case 'acknowledged': return list.filter(a => a.acknowledged);
      default: return list;
    }
  });

  ngOnInit(): void {
    this.loading.set(true);
    this.alertService.getAll().subscribe(a => {
      this.alerts.set(a);
      this.loading.set(false);
    });
  }

  onFilter(f: FilterType): void {
    this.filter.set(f);
  }

  acknowledge(id: string): void {
    this.alertService.acknowledge(id).subscribe(() => {
      this.alerts.update(list => list.map(a => a.id === id ? { ...a, acknowledged: true } : a));
    });
  }
}
