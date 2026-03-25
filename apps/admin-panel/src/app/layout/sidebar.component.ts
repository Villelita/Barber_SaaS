import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  menuItems = [
    { label: 'Dashboard', icon: 'home', route: '/dashboard' },
    { label: 'Agenda / Citas', icon: 'calendar', route: '/appointments' },
    { label: 'Clientes', icon: 'users', route: '/customers' },
    { label: 'Servicios', icon: 'scissors', route: '/services' },
    { label: 'Empleados', icon: 'briefcase', route: '/employees' },
    { label: 'Configuración', icon: 'settings', route: '/settings' }
  ];
}
