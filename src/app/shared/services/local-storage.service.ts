import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  // ANCHOR : Properties

  // ANCHOR : Constructor
  constructor() {}

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
