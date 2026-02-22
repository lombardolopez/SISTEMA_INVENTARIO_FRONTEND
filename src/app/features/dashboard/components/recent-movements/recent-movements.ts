import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Movement } from '../../../../core/models/movement.model';
import { MovementService } from '../../../../core/services/movement.service';

@Component({
  selector: 'app-recent-movements',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './recent-movements.html',
  styleUrl: './recent-movements.css',
})
export class RecentMovements implements OnInit {
  private movementService = inject(MovementService);
  movements = signal<Movement[]>([]);

  ngOnInit(): void {
    this.movementService.getRecent(10).subscribe(m => this.movements.set(m));
  }
}
