import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'page1',
    pathMatch: 'full',
  },
  {
    path: 'page1',
    loadComponent: () =>
      import('./Pages/login/page1.page').then((m) => m.Page1Page),
  },
  {
    path: 'page2',
    loadComponent: () =>
      import('./Pages/trainings/page2.page').then((m) => m.Page2Page),
  },
  {
    path: 'page3',
    loadComponent: () =>
      import('./Pages/page3/page3.page').then((m) => m.Page3Page),
  },
  {
    path: 'page4',
    loadComponent: () =>
      import('./Pages/Add_training/page4.page').then((m) => m.LisaaTreeni),
  },
  {
    path: 'page5',
    loadComponent: () =>
      import('./Pages/page5/page5.page').then((m) => m.Page5Page),
  },
  {
    path: 'page6',
    loadComponent: () =>
      import('./Pages/page6/page6.page').then((m) => m.Page6Page),
  },
];
