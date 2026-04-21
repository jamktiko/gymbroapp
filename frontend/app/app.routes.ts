import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'game-screen',
    pathMatch: 'full',
  },
  {
    path: 'game-screen',
    loadComponent: () =>
      import('./game-screen/game-screen.page').then((m) => m.GameScreenPage),
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'levels',
    loadComponent: () =>
      import('./levels/levels.page').then((m) => m.LevelsPage),
  },
  {
    path: 'stats',
    loadComponent: () => import('./stats/stats.page').then((m) => m.StatsPage),
  },
];
