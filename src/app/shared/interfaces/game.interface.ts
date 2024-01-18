export type IGameStatus = 'playing' | 'won' | 'lost' | 'stoped';

export interface ISizeTable {
  rows: number;
  cols: number;
}

export interface IPosition {
  row: number;
  col: number;
}

export type ICellState = 'snake' | 'empty' | 'food';

export type IKeys = 'ArrowLeft' | 'ArrowRight' | 'ArrowDown' | 'ArrowUp';

export const DIRECTIONS = ['left', 'right', 'down', 'up'] as const;
export type IDirection = (typeof DIRECTIONS)[number];
