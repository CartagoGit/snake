import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IDirection, IKeys } from './shared/interfaces/game.interface';
import { StateService } from './shared/services/state.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    const { code } = event;
    const possibleKeys: IKeys[] = [
      'ArrowLeft',
      'ArrowRight',
      'ArrowDown',
      'ArrowUp',
    ];

    if (!(possibleKeys as string[]).includes(code)) return;
    const key = code as IKeys;
    event.preventDefault();
    const direction: Record<IKeys, IDirection> = {
      ArrowLeft: 'left',
      ArrowRight: 'right',
      ArrowDown: 'down',
      ArrowUp: 'up',
    };

    this._stateSvc.direction.set(direction[key]);
  }

  constructor(private _stateSvc: StateService) {}
}
