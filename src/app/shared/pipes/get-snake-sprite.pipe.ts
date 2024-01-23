import { Pipe, PipeTransform } from '@angular/core';
import { IPosition, ISnakeBody, ISprite } from '../interfaces/game.interface';

@Pipe({
  name: 'getSnakeSprite',
  standalone: true,
})
export class GetSnakeSpritePipe implements PipeTransform {
  transform(data: {
    snake: ISnakeBody[];
    cellPos: IPosition;
  }): HTMLCanvasElement {
    const {
      snake,
      cellPos: { col, row },
    } = data;
    const part = snake.find(
      (part) => part.position.row === row && part.position.col === col,
    )!;
    const { sprite } = part;

    return sprite.canvas;
  }
}
