import { Component } from '@angular/core';
import { SidebarComponent } from "../../../../layouts/sidebar/sidebar.component";
import { HeaderComponent } from "../../../../layouts/header/header.component";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-tecnicos-layout',
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    SidebarComponent
],
  templateUrl: './tecnicos-layout.component.html',
  styleUrl: './tecnicos-layout.component.css'
})
export class TecnicosLayoutComponent {
  sidebarCollapsed = false;

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
}
