import { BehaviorSubject } from 'rxjs';
import { ISprite, ISprites } from '../interfaces/game.interface';

export class Sprites {
  // ANCHOR : Properties
  public readonly src: string = '/assets/images/snake-graphics.png';
  private _spritesArray!: ISprite[][];
  private _sprites!: ISprites;
  public sprites$: BehaviorSubject<ISprites> = new BehaviorSubject<ISprites>(
    this._sprites
  );

  // ANCHOR : Constructor
  constructor() {
    this._getSprites()
      .then((spritesArray) => {
        this._spritesArray = spritesArray;
        this._assignSprites();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // ANCHOR : Methods
  private _getSprites(): Promise<ISprite[][]> {
    return new Promise((resolve, reject) => {
      const columns = 5;
      const rows = 4;
      let sprites: ISprite[][] = [];
      let spriteSheetImage = new Image();
      spriteSheetImage.src = this.src;

      spriteSheetImage.onload = () => {
        const spriteWidth = spriteSheetImage.width / columns;
        const spriteHeight = spriteSheetImage.height / rows;
        for (let row = 0; row < rows; row++) {
          sprites[row] = [];
          for (let col = 0; col < columns; col++) {
            let canvas = document.createElement('canvas');
            canvas.width = spriteWidth;
            canvas.height = spriteHeight;
            canvas.className = 'cell sprite';
            let context = canvas.getContext('2d')!;
            context.drawImage(
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
              canvas,
              context,
            };
          }
        }
        resolve(sprites);
      };
      spriteSheetImage.onerror = (error) => {
        reject(error);
      };
    });
  }

  private _assignSprites(): ISprites {
    this._sprites = {
      head: {
        up: this._spritesArray[0][3],
        right: this._spritesArray[0][4],
        down: this._spritesArray[1][4],
        left: this._spritesArray[1][3],
      },
      body: {
        vertical: this._spritesArray[0][1],
        horizontal: this._spritesArray[1][2],
      },
      tail: {
        up: this._spritesArray[2][3],
        right: this._spritesArray[2][4],
        down: this._spritesArray[3][4],
        left: this._spritesArray[3][3],
      },
      curve: {
        upLeft: this._spritesArray[2][2],
        upRight: this._spritesArray[0][1],
        downLeft: this._spritesArray[0][2],
        downRight: this._spritesArray[0][0],
      },
    };
    this.sprites$.next(this._sprites);
    return this._sprites;
  }

  // Method to show the sprites in the DOM to test correct sprites from the sprite sheet
  private _showTestSprites(): void {
    for (const kindSprite in this._sprites) {
      const kindSpriteValue = this._sprites[kindSprite as keyof ISprites];
      for (const sprite in kindSpriteValue) {
        const spriteValue: ISprite =
          kindSpriteValue[sprite as keyof typeof kindSpriteValue];
        document.body.appendChild(spriteValue.canvas);
      }
    }
  }
}
