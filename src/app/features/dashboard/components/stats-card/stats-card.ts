import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-stats-card',
  standalone: true,
  imports: [],
  templateUrl: './stats-card.html',
  styleUrl: './stats-card.css',
})
export class StatsCard {
  title = input.required<string>();
  value = input.required<string>();
  icon = input.required<string>();
  trend = input<string>();
  color = input.required<string>();

  iconBgClass = computed(() => {
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-100',
      red: 'bg-red-100',
      amber: 'bg-amber-100',
      green: 'bg-green-100',
      indigo: 'bg-indigo-100',
      purple: 'bg-purple-100',
    };
    return colorMap[this.color()] ?? 'bg-slate-100';
  });

  iconClass = computed(() => {
    const colorMap: Record<string, string> = {
      blue: 'text-blue-600',
      red: 'text-red-600',
      amber: 'text-amber-600',
      green: 'text-green-600',
      indigo: 'text-indigo-600',
      purple: 'text-purple-600',
    };
    return colorMap[this.color()] ?? 'text-slate-600';
  });
}
