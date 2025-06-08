import { Component } from '@angular/core';
import { SidebarComponent } from "../../../../layouts/sidebar/sidebar.component";
import { HeaderComponent } from "../../../../layouts/header/header.component";
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { FooterComponent } from "../../../../layouts/footer/footer.component";

@Component({
  selector: 'app-tecnicos-layout',
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    SidebarComponent,
    FooterComponent
],
  templateUrl: './tecnicos-layout.component.html',
  styleUrl: './tecnicos-layout.component.css'
})
export class TecnicosLayoutComponent {
  sidebarCollapsed = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUserInfo();

    if (!user || user.rol_id !== 2) {
      this.router.navigate(['/login']);
    }
  }


  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
}
