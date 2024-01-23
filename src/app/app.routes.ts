import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    async loadComponent() {
      return (await import('./pages/game/game.component')).GameComponent;
    },
  },
  { path: '**', redirectTo: '' },
];
