import {
  DIRECTIONS,
  IGameStatus,
  IPosition,
  ISprites,
} from './../interfaces/game.interface';
import { Injectable, WritableSignal, computed, signal } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { IDirection, ISizeTable } from '../interfaces/game.interface';
import { Sprites } from '../models/sprites.model';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  // ANCHOR : Properties
  public readonly title = "Cartago's Snake";

  private _spritesModel: Sprites = new Sprites();
  public sprites!: ISprites;

  public readonly size: ISizeTable = {
    cols: 30,
    rows: 18,
    // cols: 5,
    // rows: 5,
  };

  public gameStatus: WritableSignal<IGameStatus> = signal('playing');
  public snake: WritableSignal<number[][]> = signal([]);
  public ateFood = signal(0);

  public food = signal<IPosition>(this._createFood());

  public speed = computed(() => {
    const ateFood = this.ateFood();
    const startSpeed = 1000;
    const speedIncrement = 10;
    const maxSpeed = 1;
    const speed = startSpeed - ateFood * speedIncrement;
    return speed < maxSpeed ? maxSpeed : speed;
  });

  public maxPoints = signal(0);

  private _oposite: Record<IDirection, IDirection> = {
    up: 'down',
    down: 'up',
    left: 'right',
    right: 'left',
  };

  public direction: WritableSignal<IDirection> = signal(
    this._getRandomDirection()
  );
  public opositeDirection = computed(() => this._oposite[this.direction()]);

  // public table: WritableSignal<ICellState[][]> = signal([]);
  public table: null[][] = new Array(this.size.rows).fill(
    new Array(this.size.cols).fill(null)
  );

  // ANCHOR : Constructor
  constructor(private _localstorageSvc: LocalStorageService) {
    this._getDataFromLocalStorage();
    this._spritesModel.sprites$.subscribe((sprites) => {
      if (!sprites) return;
      this.sprites = sprites;
      this.startGame();
      setInterval(() => {
        this.moveSnake();
      }, 1000);
    });
  }

  // ANCHOR : Private Methods
  private _getDataFromLocalStorage(): void {
    this.maxPoints.set(this._localstorageSvc.getMaxPoints() || 0);
  }

  private _saveDataToLocalStorage(): void {
    this._localstorageSvc.saveMaxPoinst(this.maxPoints());
  }

  private _createFood(): IPosition {
    const row = Math.floor(Math.random() * this.size.rows);
    const col = Math.floor(Math.random() * this.size.cols);
    const isFilled = this.snake().some(
      (position) => position[0] === row && position[1] === col
    );
    if (isFilled) return this._createFood();
    return { row, col };
  }

  private _createSnake(): IPosition[] {
    const limitBetweenWalls = 2;
    const row =
      Math.floor(Math.random() * (this.size.rows - limitBetweenWalls * 2)) +
      limitBetweenWalls;
    const col =
      Math.floor(Math.random() * (this.size.cols - limitBetweenWalls * 2)) +
      limitBetweenWalls;
    const headPosition = { row, col };
    const tailPosition = this._getPositionFromDirection({
      direction: this.opositeDirection(),
      position: headPosition,
    });

    return [{ row, col }, tailPosition];
  }

  private _getRandomDirection(): IDirection {
    const index = Math.floor(Math.random() * 4);
    return DIRECTIONS[index];
  }

  private _getPositionFromDirection(data: {
    direction: IDirection;
    position: IPosition;
  }): IPosition {
    const { direction, position } = data;
    const { row, col } = position;
    const newPosition = {
      up: { row: row - 1, col },
      down: { row: row + 1, col },
      left: { row, col: col - 1 },
      right: { row, col: col + 1 },
    };
    return newPosition[direction];
  }

  // ANCHOR : Public Methods
  public startGame(): void {
    this._createSnake();
    this._createFood();
  }

  public stopGame(state: IGameStatus): void {
    this.gameStatus.set(state);
  }

  public moveSnake(): void {}
}
