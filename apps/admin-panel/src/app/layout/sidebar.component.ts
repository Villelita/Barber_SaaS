import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService, UserRole } from '../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {
  isOwner = false;
  activeBusinessName = '';

  menuItems = [
    { label: 'Mis Negocios', icon: 'layout', route: '/business-list' },
    { label: 'Configuración', icon: 'settings', route: '/settings' },
    { label: 'Mi Perfil', icon: 'user', route: '/profile' }
  ];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.isOwner = this.authService.getRole() === UserRole.DUENO;
    this.authService.activeBusiness.subscribe(business => {
      this.activeBusinessName = business?.nombre || '';
    });
  }
}
