import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeaderComponent } from './../../components/header/header.component';
import { TableComponent } from '../../components/table/table.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { StateService } from '../../shared/services/state.service';

import { CommonModule } from '@angular/common';
import { Snake } from '../../shared/models/snake.model';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    HeaderComponent,
    TableComponent,
    FooterComponent,
    CommonModule
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameComponent {
  constructor(public stateSvc: StateService) {
    const snake = new Snake();
  }
}
