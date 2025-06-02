import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout.component';
import { AdminDashboardComponent } from '../../../dashboard/admin-dashboard/admin-dashboard.component';
import { UsuariosListComponent } from '../usuarios-list/usuarios-list.component';


export default [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: 'home', component: AdminDashboardComponent },
      { path: 'listar-usuarios', component: UsuariosListComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ]
  }
] satisfies Routes;
