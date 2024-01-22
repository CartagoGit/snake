import {
  DIRECTIONS,
  IGameStatus,
  IPosition,
  ISprites,
} from './../interfaces/game.interface';
import { Injectable, WritableSignal, computed, signal } from '@angular/core';

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

  private _spritesModel: Sprites = new Sprites();
  public sprites!: ISprites;

  public gameStatus: WritableSignal<IGameStatus> = signal('playing');

  public ateFood = signal(0);

  public speed = computed(() => {
    const ateFood = this.ateFood();
    const startSpeed = 1000;
    const speedIncrement = 10;
    const maxSpeed = 1;
    const speed = startSpeed - ateFood * speedIncrement;
    return speed < maxSpeed ? maxSpeed : speed;
  });

  public maxPoints = signal(0);

  public readonly size: ISizeTable = {
    cols: 30,
    rows: 18,
    // cols: 5,
    // rows: 5,
  };

  public snake: WritableSignal<number[][]> = signal([]);

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

  public table: WritableSignal<ICellState[][]> = signal([]);

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
    const tailPosition = this._getPositionFromDirection({
      direction: this.opositeDirection(),
      position: { row, col },
    });
    // this.table()[row][col] = this.sprites.head[this.direction()];
    // this.table()[tailPosition.row][tailPosition.col] =
    //   this.sprites.tail[this.direction()];

    // this.direction.set(this.opositeDirection());
    this.snake.set([
      [row, col],
      [tailPosition.row, tailPosition.col],
    ]);
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
    this._createNewTable();
    this._createSnake();
    this._createFood();
  }

  public stopGame(state: IGameStatus): void {
    this.gameStatus.set(state);
  }

  public moveSnake(): void {
    console.log('moveSnake', this.direction());
    const snake = this.snake();
    const table = this.table();
    const head = snake[0];
    const newHead = this._getPositionFromDirection({
      direction: this.direction(),
      position: { row: head[0], col: head[1] },
    });
    const value = table?.[newHead.row]?.[newHead.col];
    if (value === 'food') {
      this.ateFood.set(this.ateFood() + 1);
      this._createFood();
    } else if (value !== 'empty') {
      this.stopGame('lost');
      console.log('lost');
      return;
    }
    const tail = snake.pop()!;
    table[tail[0]][tail[1]] = 'empty';
    snake.unshift([newHead.row, newHead.col]);
    console.log('snake', snake);
    // table[snake[0][0]][snake[0][1]] = this.sprites.head[this.direction()];
    // table[snake[snake.length - 1][0]][snake[snake.length - 1][1]] =
    //   this.sprites.tail.left;
    // this.table.set(table);
    // this.snake.set(snake);
  }
}
