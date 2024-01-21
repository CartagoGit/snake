import { DIRECTIONS, IGameStatus } from './../interfaces/game.interface';
import { Injectable, WritableSignal, signal } from '@angular/core';

import { LocalStorageService } from './local-storage.service';
import {
  ICellState,
  IDirection,
  ISizeTable,
} from '../interfaces/game.interface';
import { Sprites } from '../models/sprites.model';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  // ANCHOR : Properties
  public readonly title = "Cartago's Snake";

  public sprites : Sprites = new Sprites();

  public gameStatus: WritableSignal<IGameStatus> = signal('playing');



  public maxPoints = signal(0);

  public readonly size: ISizeTable = {
    cols: 30,
    rows: 18,
    // cols: 5,
    // rows: 5,
  };

  public snake: WritableSignal<number[][]> = signal([]);

  public direction: WritableSignal<IDirection> = signal('up');

  public table: WritableSignal<ICellState[][]> = signal([]);

  // ANCHOR : Constructor
  constructor(private _localstorageSvc: LocalStorageService) {
    this._getDataFromLocalStorage();
    this.startGame();
    console.log(this.sprites);
  }

  // ANCHOR : Private Methods
  private _getDataFromLocalStorage(): void {
    this.maxPoints.set(this._localstorageSvc.getMaxPoints() || 0);
  }

  private _saveDataToLocalStorage(): void {
    this._localstorageSvc.saveMaxPoinst(this.maxPoints());
  }

  private _createNewTable(): void {
    this.table.set(
      new Array(this.size.rows)
        .fill([])
        .map(() => new Array<ICellState>(this.size.cols).fill('empty'))
    );
  }

  private _createFood(): void {
    const row = Math.floor(Math.random() * this.size.rows);
    const col = Math.floor(Math.random() * this.size.cols);
    const table = this.table();
    const value = table[row][col];
    if (value === 'empty') table[row][col] = 'food';
    else this._createFood();
  }

  private _createSnake(): void {
    const limitBetweenWalls = 2;
    const row =
      Math.floor(Math.random() * (this.size.rows - limitBetweenWalls * 2)) +
      limitBetweenWalls;
    const col =
      Math.floor(Math.random() * (this.size.cols - limitBetweenWalls * 2)) +
      limitBetweenWalls;
    this.table()[row][col] = 'snake';
    this.direction.set(this._getRandomDirection());
    this.snake.set([[row, col]]);
  }

  private _getRandomDirection(): IDirection {
    const index = Math.floor(Math.random() * 4);
    return DIRECTIONS[index];
  }

  // ANCHOR : Public Methods
  public startGame(): void {
    this._createNewTable();
    this._createSnake();
    this._createFood();
  }

  public stopGame(state: IGameStatus): void {
    this.gameStatus.set(state);
  }
}
