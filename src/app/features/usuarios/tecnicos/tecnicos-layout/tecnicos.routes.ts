import { Routes } from '@angular/router';


import { TecnicosLayoutComponent } from './tecnicos-layout.component';
import { TecnicosDashboardComponent } from '../../../dashboard/tecnicos-dashboard/tecnicos-dashboard.component';
import { TecnicosTicketsComponent } from '../../../mesa-ayuda/tecnicos/tecnicos-tickets/tecnicos-tickets.component';


export default [
  {
    path: '',
    component: TecnicosLayoutComponent,
    children: [
      { path: 'home', component: TecnicosDashboardComponent },
      { path: 'tickets', component: TecnicosTicketsComponent },
      
     
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ]
  }
] satisfies Routes;
