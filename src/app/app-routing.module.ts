import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomePageComponent } from './shared/pages/home-page/home-page.component';
import { AboutPageComponent } from './shared/pages/about-page/about-page.component';
import { ContactPageComponent } from './shared/pages/contact-page/contact-page.component';

//se configuran las distintas rutas a las que se puede acceder desdde mi página
const routes:Routes = [
  // {
  //   path:'',
  //   component: HomePageComponent
  // },
  {
    path:'about',
    component: AboutPageComponent
  },
  {
    path: 'contact',
    component: ContactPageComponent
  },
  {
    path: 'countries',
    loadChildren: () => import('./countries/countries.module').then(m => m.CountriesModule)
  },
  {
    path:'**',
    redirectTo: 'countries'
  }
];

@NgModule({
  imports:[
    RouterModule.forRoot(routes), //esto solo se escribe si es la ruta principal de la app (solo hay uno en toda la app)
  ],
  exports:[
    RouterModule,
  ]
})
export class AppRoutingModule { }
