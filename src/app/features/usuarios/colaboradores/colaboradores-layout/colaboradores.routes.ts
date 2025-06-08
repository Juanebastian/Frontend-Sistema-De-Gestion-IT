import { Routes } from '@angular/router';
import { ColaboradoresLayoutComponent } from './colaboradores-layout.component';
import { ColaboradoresDashboardComponent } from '../../../dashboard/colaboradores-dashboard/colaboradores-dashboard.component';
import { ColaboradoresTicketsComponent } from '../../../mesa-ayuda/colaboradores/colaboradores-tickets/colaboradores-tickets.component';


export default [
  {
    path: '',
    component: ColaboradoresLayoutComponent,
    children: [
      { path: 'home', component: ColaboradoresDashboardComponent },
      { path: 'tickets', component: ColaboradoresTicketsComponent },
      
     
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ]
  }
] satisfies Routes;
