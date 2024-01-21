import {
  IBody,
  ICurve,
  IDirection,
  IKindSprite,
  ISprite,
} from '../interfaces/game.interface';

export class Snake {
  // ANCHOR : Properties
  private _spriteSheetSrc: string = 'src/assets/images/snake-graphics.png';
  private _spriteSheet!: ISprite[][];
  private _sprite!: Record<
    IKindSprite,
    | Record<IDirection, ISprite>
    | Record<IBody, ISprite>
    | Record<ICurve, ISprite>
  >;

  // ANCHOR : Constructor
  constructor() {
    this._getSprites().then((spriteSheet) => {
      this._spriteSheet = spriteSheet;
      this._assignSprites();
    });
  }

  // ANCHOR : Methods
  private _getSprites(): Promise<ISprite[][]> {
    return new Promise((resolve, reject) => {
      const columns = 5;
      const rows = 4;
      let sprites: ISprite[][] = [];
      let spriteSheetImage = new Image();
      spriteSheetImage.src = this._spriteSheetSrc;
      spriteSheetImage.onload = () => {
        const spriteWidth = spriteSheetImage.width / columns;
        const spriteHeight = spriteSheetImage.height / rows;
        for (let row = 0; row < rows; row++) {
          sprites[row] = [];
          for (let col = 0; col < columns; col++) {
            let canvas = document.createElement('canvas');
            canvas.width = spriteWidth;
            canvas.height = spriteHeight;
            let ctx = canvas.getContext('2d')!;
            ctx.drawImage(
              spriteSheetImage,
              col * spriteWidth,
              row * spriteHeight,
              spriteWidth,
              spriteHeight,
              0,
              0,
              spriteWidth,
              spriteHeight
            );
            sprites[row][col] = {
              image: canvas,
              kind: 'head',
              direction: 'up',
            };
          }
        }
        resolve(spriteSheetImage);
      };
      spriteSheetImage.onerror = (error) => {
        reject(error);
      };
    });
  }

  private _assignSprites(): void {
    this._sprite = {
      head: {
        up: this._spriteSheet[0][3],
        right: this._spriteSheet[0][4],
        down: this._spriteSheet[1][4],
        left: this._spriteSheet[1][3],
      },
      body: {
        vertical: this._spriteSheet[0][1],
        horizontal: this._spriteSheet[1][2],
      },
      tail: {
        up: this._spriteSheet[2][3],
        right: this._spriteSheet[2][4],
        down: this._spriteSheet[3][4],
        left: this._spriteSheet[3][3],
      },
      curve: {
        upLeft: this._spriteSheet[2][2],
        upRight: this._spriteSheet[0][1],
        downLeft: this._spriteSheet[0][2],
        downRight: this._spriteSheet[0][0],
      },
    };
  }
}
