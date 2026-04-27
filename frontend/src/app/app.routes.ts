import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'page1',
    pathMatch: 'full',
  },
  {
    path: 'page1',
    loadComponent: () => import('./page1/page1.page').then((m) => m.Page1Page),
  },
  {
    path: 'page2',
    loadComponent: () => import('./page2/page2.page').then((m) => m.Page2Page),
  },
  {
    path: 'page3',
    loadComponent: () => import('./page3/page3.page').then((m) => m.Page3Page),
  },
  {
    path: 'page4',
    loadComponent: () => import('./page4/page4.page').then((m) => m.Page4Page),
  },
  {
    path: 'page5',
    loadComponent: () => import('./page5/page5.page').then((m) => m.Page5Page),
  },
];
