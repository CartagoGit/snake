import { Inject, Injectable, InjectionToken } from '@angular/core';

export const BROWSER_STORAGE = new InjectionToken<Storage>('Browser Storage', {
  providedIn: 'root',
  factory: () => localStorage,
});

let localStorage: Storage;

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  // ANCHOR : Properties

  // ANCHOR : Constructor
  constructor(@Inject(BROWSER_STORAGE) public storage: Storage) {
    localStorage = this.storage;
  }

  // ANCHOR : Methods
  public saveMaxPoinst(maxPoints: number | string): void {
    localStorage.setItem('maxPoints', maxPoints.toString());
  }
  public getMaxPoints(): number | null {
    const maxPoints = localStorage.getItem('maxPoints');
    if (maxPoints) return Number(maxPoints);
    return null;
  }
}
// HACK : This is a hack to make the server side rendering work with fake localStorage
@Injectable()
export class LocalStorageSsrHackService extends LocalStorageService {
  constructor() {
    super({
      clear: () => {},
      getItem: (key: string) => JSON.stringify({ key }),
      setItem: (key: string, value: string) => JSON.stringify({ [key]: value }),
      key: (index: number) => index.toString(),
      length: 0,
      removeItem: (key: string) => JSON.stringify({ key }),
    });
  }
}
