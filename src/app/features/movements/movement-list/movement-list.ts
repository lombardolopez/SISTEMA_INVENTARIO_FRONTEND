import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Movement, MovementType } from '../../../core/models/movement.model';
import { MovementService } from '../../../core/services/movement.service';

@Component({
  selector: 'app-movement-list',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './movement-list.html',
  styleUrl: './movement-list.css',
})
export class MovementList implements OnInit {
  private movementService = inject(MovementService);
  private router = inject(Router);

  movements = signal<Movement[]>([]);
  filteredMovements = signal<Movement[]>([]);
  loading = signal(false);
  typeFilter = signal<'all' | MovementType>('all');
  searchTerm = signal('');

  ngOnInit(): void {
    this.loading.set(true);
    this.movementService.getAll().subscribe((paged) => {
      this.movements.set(paged.content);
      this.filteredMovements.set(paged.content);
      this.loading.set(false);
    });
  }

  onTypeFilter(type: 'all' | MovementType): void {
    this.typeFilter.set(type);
    this.applyFilters();
  }

  onSearch(event: Event): void {
    this.searchTerm.set((event.target as HTMLInputElement).value.toLowerCase());
    this.applyFilters();
  }

  private applyFilters(): void {
    let result = this.movements();
    const type = this.typeFilter();
    const term = this.searchTerm();

    if (type !== 'all') {
      result = result.filter((m) => m.type === type);
    }
    if (term) {
      result = result.filter((m) => m.productName.toLowerCase().includes(term));
    }
    this.filteredMovements.set(result);
  }

  navigateToCreate(): void {
    this.router.navigate(['/movements/new']);
  }
}
