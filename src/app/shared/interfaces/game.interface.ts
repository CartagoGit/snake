export type IGameStatus = 'playing' | 'won' | 'lost' | 'stoped';

export interface ISizeTable {
  rows: number;
  cols: number;
}

export interface IPosition {
  row: number;
  col: number;
}

export type ICell = null | 'food' | 'snake';

export type IKeys = 'ArrowLeft' | 'ArrowRight' | 'ArrowDown' | 'ArrowUp';

export const DIRECTIONS = ['left', 'right', 'down', 'up'] as const;
export type IDirection = (typeof DIRECTIONS)[number];

export interface ISnakeBody {
  kind: 'head' | 'body' | 'tail' | 'curve';
  from: IDirection;
  to: IDirection;
  position: IPosition;
  sprite: ISprite;
}

export interface ISprites {
  head: {
    up: ISprite;
    right: ISprite;
    down: ISprite;
    left: ISprite;
  };
  body: {
    vertical: ISprite;
    horizontal: ISprite;
  };
  tail: {
    up: ISprite;
    right: ISprite;
    down: ISprite;
    left: ISprite;
  };
  curve: {
    upLeft: ISprite;
    upRight: ISprite;
    downLeft: ISprite;
    downRight: ISprite;
  };
}

export interface ISprite {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
}
