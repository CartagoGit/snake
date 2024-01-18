import { Injectable, WritableSignal, signal } from '@angular/core';

import { LocalStorageService } from './local-storage.service';
import { ICellState, ISizeTable } from '../interfaces/game.interface';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  // ANCHOR : Properties
  public readonly title = "Cartago's Snake";

  public maxPoints = signal(0);

  public readonly size: ISizeTable = {
    cols: 50,
    rows: 20,
  };

  public table: WritableSignal<ICellState[][]> = signal([]);

  // ANCHOR : Constructor
  constructor(private _localstorageSvc: LocalStorageService) {
    this._getDataFromLocalStorage();
    this._createNewTable();
  }

  // ANCHOR : Private Methods
  private _getDataFromLocalStorage(): void {
    this.maxPoints.set(this._localstorageSvc.getMaxPoints() || 0);
  }

  private _createNewTable(): void {
    this.table.set(new Array(this.size.rows)
      .fill([])
      .map(() => new Array<ICellState>(this.size.cols).fill('empty')))
  }

  // ANCHOR : Public Methods
}
