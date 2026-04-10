import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'configurator',
    loadComponent: () =>
      import('./pages/configurator/configurator.page').then(
        (m) => m.ConfiguratorPage
      ),
  },
  {
    path: 'results',
    loadComponent: () =>
      import('./pages/results/results.page').then((m) => m.ResultsPage),
  },
];