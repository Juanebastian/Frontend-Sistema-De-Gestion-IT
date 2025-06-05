import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout.component';
import { AdminDashboardComponent } from '../../../dashboard/admin-dashboard/admin-dashboard.component';
import { UsuariosListComponent } from '../usuarios-list/usuarios-list.component';
import { AdminAreasComponent } from '../../../areas/admin-areas/admin-areas.component';
import { EquiposListComponent } from '../../../equipos/admin/equipos-list/equipos-list.component';
import { MarcasListComponent } from '../../../equipos/admin/marcas-list/marcas-list.component';
import { ModelosListComponent } from '../../../equipos/admin/modelos-list/modelos-list.component';
import { SistemasOperativosListComponent } from '../../../equipos/admin/sistemas-operativos-list/sistemas-operativos-list.component';
import { AdminTicketsComponent } from '../../../mesa-ayuda/admin/admin-tickets/admin-tickets.component';


export default [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: 'home', component: AdminDashboardComponent },
      { path: 'listar-usuarios', component: UsuariosListComponent },
      { path: 'areas', component: AdminAreasComponent },
      { path: 'computadores', component: EquiposListComponent },
      { path: 'marcas', component: MarcasListComponent },
      { path: 'modelos', component: ModelosListComponent },
      { path: 'sistemas-operativos', component: SistemasOperativosListComponent },
      { path: 'tickets', component: AdminTicketsComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ]
  }
] satisfies Routes;
