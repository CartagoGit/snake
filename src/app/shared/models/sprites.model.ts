import { BehaviorSubject } from 'rxjs';
import {
  ISnakeKindBody,
  ISprite,
  ISpriteDirection,
  ISprites,
} from '../interfaces/game.interface';

export class Sprites {
  // ANCHOR : Properties
  public readonly src: string = '/assets/images/snake-graphics.png';
  private _spritesArray!: ISprite[][];
  private _sprites!: ISprites;
  public sprites$: BehaviorSubject<ISprites> = new BehaviorSubject<ISprites>(
    this._sprites,
  );
  private _spritesPosition = {
    head: {
      up: { row: 0, col: 3 },
      right: { row: 0, col: 4 },
      down: { row: 1, col: 4 },
      left: { row: 1, col: 3 },
    },
    body: {
      vertical: { row: 1, col: 2 },
      horizontal: { row: 0, col: 1 },
    },
    tail: {
      up: { row: 2, col: 3 },
      right: { row: 2, col: 4 },
      down: { row: 3, col: 4 },
      left: { row: 3, col: 3 },
    },
    curve: {
      downLeft: { row: 2, col: 2 },
      downRight: { row: 1, col: 0 },
      upLeft: { row: 0, col: 2 },
      upRight: { row: 0, col: 0 },
    },
  };

  // ANCHOR : Constructor
  constructor() {
    this._getSprites()
      .then((spritesArray) => {
        this._spritesArray = spritesArray;
        this._assignSprites();
        // this._showTestSprites();
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
              spriteHeight,
            );
            KindSprite: for (let [keyKind, valueKind] of Object.entries(
              this._spritesPosition,
            )) {
              for (let [keyDirection, valueDirection] of Object.entries(
                valueKind,
              )) {
                if (valueDirection.row === row && valueDirection.col === col) {
                  sprites[row][col] = {
                    canvas,
                    context,
                    kind: keyKind as ISnakeKindBody,
                    direction: keyDirection as ISpriteDirection,
                  };
                  break KindSprite;
                }
              }
            }
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
        up: this._spritesArray[this._spritesPosition.head.up.row][
          this._spritesPosition.head.up.col
        ],

        right:
          this._spritesArray[this._spritesPosition.head.right.row][
            this._spritesPosition.head.right.col
          ],
        down: this._spritesArray[this._spritesPosition.head.down.row][
          this._spritesPosition.head.down.col
        ],
        left: this._spritesArray[this._spritesPosition.head.left.row][
          this._spritesPosition.head.left.col
        ],
      },
      body: {
        vertical:
          this._spritesArray[this._spritesPosition.body.vertical.row][
            this._spritesPosition.body.vertical.col
          ],
        horizontal:
          this._spritesArray[this._spritesPosition.body.horizontal.row][
            this._spritesPosition.body.horizontal.col
          ],
      },
      tail: {
        up: this._spritesArray[this._spritesPosition.tail.up.row][
          this._spritesPosition.tail.up.col
        ],
        right:
          this._spritesArray[this._spritesPosition.tail.right.row][
            this._spritesPosition.tail.right.col
          ],
        down: this._spritesArray[this._spritesPosition.tail.down.row][
          this._spritesPosition.tail.down.col
        ],
        left: this._spritesArray[this._spritesPosition.tail.left.row][
          this._spritesPosition.tail.left.col
        ],
      },
      curve: {
        upLeft:
          this._spritesArray[this._spritesPosition.curve.upLeft.row][
            this._spritesPosition.curve.upLeft.col
          ],
        upRight:
          this._spritesArray[this._spritesPosition.curve.upRight.row][
            this._spritesPosition.curve.upRight.col
          ],
        downLeft:
          this._spritesArray[this._spritesPosition.curve.downLeft.row][
            this._spritesPosition.curve.downLeft.col
          ],
        downRight:
          this._spritesArray[this._spritesPosition.curve.downRight.row][
            this._spritesPosition.curve.downRight.col
          ],
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
