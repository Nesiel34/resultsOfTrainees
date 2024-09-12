import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'data', loadComponent:()=>import('./components/pages/data-page/data-page.component').then(c=>c.DataPageComponent)},
  { path: 'analysis',loadComponent:()=>import('./components/pages/analysis-page/analysis-page.component').then(c=>c.AnalysisPageComponent) },
  { path: 'monitor',loadComponent:()=>import('./components/pages/monitor-page/monitor-page.component').then(c=>c.MonitorPageComponent)},
  { path: '', redirectTo: '/data', pathMatch: 'full' },
  {path: '**', redirectTo: '/data'}

];
