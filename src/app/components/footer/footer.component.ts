import { ChangeDetectionStrategy, Component } from '@angular/core';
import { StateService } from '../../shared/services/state.service';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [TitleCasePipe],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  // ANCHOR : Constructor
  constructor(public stateSvc: StateService) {}
}
