import { Routes } from '@angular/router';
import { AuthComponent } from './layouts/auth/auth.component';
import { BlankComponent } from './layouts/blank/blank.component';


export const routes: Routes = [

{
    path: '',
    component: BlankComponent,

    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./pages/home/home.component')
            .then(m => m.HomeComponent),
        data: { title: 'home' }
      }
      ,
        {
        path: 'about',
        loadComponent: () =>
          import('./pages/about/about.component')
            .then(m => m.AboutComponent),
        data: { title: 'about' }
      },
        {
        path: 'allcategorie',
        loadComponent: () =>
          import('./pages/allcategory/allcategory.component')
            .then(m => m.AllcategoryComponent),
        data: { title: 'allcategorie' }
      },
      {
        path: 'notfound',
        loadComponent: () =>
          import('./pages/notfound/notfound.component')
            .then(m => m.NotfoundComponent),
        data: { title: 'notfound' }
      }]}
];

