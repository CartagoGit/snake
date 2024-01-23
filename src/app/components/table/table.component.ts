import { ChangeDetectionStrategy, Component } from '@angular/core';
import { StateService } from '../../shared/services/state.service';
import { CommonModule } from '@angular/common';

import { GetSnakeSpritePipe } from '../../shared/pipes/get-snake-sprite.pipe';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, GetSnakeSpritePipe],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent {
  // ANCHOR : Constructor
  constructor(public stateSvc: StateService) {}

  // ANCHOR : Methods
}
