import {
  DIRECTIONS,
  ICell,
  IGameStatus,
  IPosition,
  ISnakeBody,
  ISnakeKindBody,
  ISprite,
  ISpriteDirection,
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
  public spritesArray: ISprite[] = [];

  public readonly size: ISizeTable = {
    cols: 30,
    rows: 18,
    // cols: 10,
    // rows: 10,
  };

  public gameStatus: WritableSignal<IGameStatus> = signal('playing');
  public snake: WritableSignal<ISnakeBody[]> = signal([]);
  public ateFood = signal(0);
  public food: WritableSignal<IPosition | undefined> = signal(undefined);

  public speed = computed(() => {
    const ateFood = this.ateFood();
    const startSpeed = 1000;
    const speedIncrement = 10;
    const maxSpeed = 1;
    const speed = startSpeed - ateFood * speedIncrement;
    return speed < maxSpeed ? maxSpeed : speed;
  });

  public maxPoints = signal(0);

  private _opposite: Record<IDirection, IDirection> = {
    up: 'down',
    down: 'up',
    left: 'right',
    right: 'left',
  };

  public direction: WritableSignal<IDirection> = signal(
    this._getRandomDirection(),
  );
  public oppositeDirection = computed(() => this._opposite[this.direction()]);

  public table: WritableSignal<ICell[][]> = signal([]);

  // ANCHOR : Constructor
  constructor(private _localstorageSvc: LocalStorageService) {
    this._getDataFromLocalStorage();
    this._spritesModel.sprites$.subscribe((sprites) => {
      if (!sprites) return;
      this.sprites = sprites;
      // NOTE FOR TESTING
      for (let kindSprites of Object.values(sprites)) {
        for (let spriteDirection of Object.values(kindSprites)) {
          const sprite = spriteDirection as ISprite;
          this.spritesArray.push(sprite);
        }
      }
      this.startGame();
      setInterval(() => {
        this.moveSnake();
      }, 300);
    });
  }

  // ANCHOR : Private Methods
  private _getDataFromLocalStorage(): void {
    this.maxPoints.set(this._localstorageSvc.getMaxPoints() || 0);
  }

  private _saveDataToLocalStorage(): void {
    this._localstorageSvc.saveMaxPoinst(this.maxPoints());
  }

  private _createNewTable(): ICell[][] {
    return new Array(this.size.rows)
      .fill(null)
      .map(() => new Array(this.size.cols).fill(null));
  }

  private _createFood(): IPosition {
    const row = Math.floor(Math.random() * this.size.rows);
    const col = Math.floor(Math.random() * this.size.cols);
    const isFilled = this.snake().some(
      ({ position: snakePosition }) =>
        snakePosition.row === row && snakePosition.col === col,
    );
    if (isFilled) return this._createFood();
    return { row, col };
  }

  private _createSnake(): ISnakeBody[] {
    const limitBetweenWalls = 2;
    const row =
      Math.floor(Math.random() * (this.size.rows - limitBetweenWalls * 2)) +
      limitBetweenWalls;
    const col =
      Math.floor(Math.random() * (this.size.cols - limitBetweenWalls * 2)) +
      limitBetweenWalls;
    const headPosition = { row, col };
    const tailPosition = this._getPositionFromDirection({
      direction: this.oppositeDirection(),
      position: headPosition,
    });
    const head: ISnakeBody = {
      kind: 'head',
      from: this.oppositeDirection(),
      to: this.direction(),
      position: headPosition,
      sprite: this.sprites.head[this.direction()],
    };
    const tail: ISnakeBody = {
      kind: 'tail',
      from: this.oppositeDirection(),
      to: this.direction(),
      position: tailPosition,
      sprite: this.sprites.tail[this.direction()],
    };

    return [head, tail];
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

  private _getBodySnake(data: {
    beforeHead: ISnakeBody;
    newHead: ISnakeBody;
    snake: ISnakeBody[];
  }): ISnakeBody {
    const { newHead, snake, beforeHead } = data;

    const before = snake[1];
    const actual = snake[0];
    const next = newHead;
    const { row: beforeRow, col: beforeCol } = before.position;
    const { row: actualRow, col: actualCol } = actual.position;
    const { row: nextRow, col: nextCol } = next.position;

    const isBody =
      (beforeRow === actualRow && actualRow === nextRow) ||
      (beforeCol === actualCol && actualCol === nextCol);

    const kindBody: 'body' | 'curve' = isBody ? 'body' : 'curve';

    if (kindBody === 'body') {
      const kindSprite =
        newHead.to === 'up' || newHead.to === 'down'
          ? 'vertical'
          : 'horizontal';
      snake[0] = {
        ...snake[0],
        kind: 'body',
        sprite: this.sprites[kindBody][kindSprite],
      };
    } else if (kindBody === 'curve') {
      let betweenBeforeAndActual: IDirection;
      if (beforeRow === actualRow) {
        betweenBeforeAndActual = beforeCol < actualCol ? 'right' : 'left';
      } else if (beforeCol === actualCol) {
        betweenBeforeAndActual = beforeRow < actualRow ? 'down' : 'up';
      }
      let betweenActualAndNext: IDirection;
      if (actualRow === nextRow) {
        betweenActualAndNext = actualCol < nextCol ? 'right' : 'left';
      } else if (actualCol === nextCol) {
        betweenActualAndNext = actualRow < nextRow ? 'down' : 'up';
      }
      const vertical = (['up', 'down'] as IDirection[]).includes(
        betweenBeforeAndActual!,
      )
        ? betweenBeforeAndActual!
        : betweenActualAndNext!;

      const horizontal = (['left', 'right'] as IDirection[]).includes(
        betweenBeforeAndActual!,
      )
        ? betweenBeforeAndActual!
        : betweenActualAndNext!;
      let kindSprite = (vertical +
        horizontal[0].toUpperCase() +
        horizontal.slice(1)) as 'upLeft' | 'upRight' | 'downLeft' | 'downRight';
      console.log({
        vertical,
        horizontal,
        kindSprite,
        kindBody,
      });
      console.log({
        sprite: JSON.parse(JSON.stringify(this.sprites[kindBody][kindSprite])),
      });
      snake[0] = {
        ...snake[0],
        kind: 'body',
        sprite: this.sprites[kindBody][kindSprite],
      };
    }
    return snake[0];
  }

  // ANCHOR : Public Methods
  public startGame(): void {
    this._createFood();
    const newTable = this._createNewTable();
    this.snake.set(this._createSnake());
    this.snake().forEach((part) => {
      newTable[part.position.row][part.position.col] = 'snake';
    });
    const food = this._createFood();
    this.food.set(food);
    newTable[food.row][food.col] = 'food';
    this.table.set(newTable);
  }

  public stopGame(state: IGameStatus): void {
    this.gameStatus.set(state);
  }

  public moveSnake(): void {
    const snake = this.snake();
    const head = snake[0];
    const tail = snake[snake.length - 1];
    const newHeadPosition = this._getPositionFromDirection({
      direction: this.direction(),
      position: head.position,
    });
    const newHead: ISnakeBody = {
      kind: 'head',
      from: this.oppositeDirection(),
      to: this.direction(),
      position: newHeadPosition,
      sprite: this.sprites.head[this.direction()],
    };
    if (
      newHeadPosition.row < 0 ||
      newHeadPosition.row >= this.size.rows ||
      newHeadPosition.col < 0 ||
      newHeadPosition.col >= this.size.cols
    ) {
      this.stopGame('lost');
      return;
    }
    const lastBodyPart = snake[snake.length - 2];
    const tailDirection = this.ateFood() === 0 ? this.direction() : tail.to;
    const newTail: ISnakeBody = {
      kind: 'tail',
      from: lastBodyPart.from,
      to: tailDirection,
      position: lastBodyPart.position,
      sprite: this.sprites.tail[tailDirection],
    };
    // TODO Si la serpiente ha ocupado todos los caminos controlar que se ha ganado y no se puede generar comida
    const food = this.food();
    if (
      food &&
      newHeadPosition.row === food.row &&
      newHeadPosition.col === food.col
    ) {
      this.ateFood.update((ateFood) => ateFood + 1);
      this.snake.update((snake) => {
        const newBodySnake = this._getBodySnake({
          beforeHead: head,
          newHead,
          snake,
        });
        snake[0] = newBodySnake;
        // snake[snake.length - 1] = newTail;
        snake.unshift(newHead);
        console.log(snake);
        return [...snake];
      });
      this.table.update((table) => {
        table[food.row][food.col] = null;
        const newFood = this._createFood();
        this.food.set(newFood);
        table[newFood.row][newFood.col] = 'food';
        table[newHeadPosition.row][newHeadPosition.col] = 'snake';
        return [...table];
      });
      return;
    }

    this.snake.update((snake) => {
      if (snake.length > 2) {
        snake[0] = this._getBodySnake({
          beforeHead: head,
          newHead,
          snake,
        });
      }
      snake.pop();
      snake[snake.length - 1] = newTail;

      snake.unshift(newHead);
      return [...snake];
    });
    this.table.update((table) => {
      table[tail.position.row][tail.position.col] = null;
      table[newHeadPosition.row][newHeadPosition.col] = 'snake';
      return [...table];
    });
  }
}
