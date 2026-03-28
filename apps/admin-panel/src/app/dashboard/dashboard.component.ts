import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, UserRole } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  stats: any[] = [];
  businessName = '';
  appointments: any[] = [];
  
  allStats = [
    { id: 'citas', title: 'Citas Hoy', value: '14', icon: 'calendar', color: '#0072FF', roles: [UserRole.SUPER_ADMIN, UserRole.DUENO, UserRole.EMPLEADO, UserRole.RECEPCION] },
    { id: 'clientes', title: 'Clientes Nuevos', value: '5', icon: 'users', color: '#38A169', roles: [UserRole.SUPER_ADMIN, UserRole.DUENO, UserRole.RECEPCION] },
    { id: 'ingresos', title: 'Ingresos', value: '$1,250', icon: 'dollar-sign', color: '#D69E2E', roles: [UserRole.SUPER_ADMIN, UserRole.DUENO, UserRole.RECEPCION] },
    { id: 'servicios', title: 'Servicios Activos', value: '32', icon: 'scissors', color: '#805AD5', roles: [UserRole.SUPER_ADMIN, UserRole.DUENO, UserRole.EMPLEADO, UserRole.RECEPCION] }
  ];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    const business = this.authService.activeBusinessValue;
    if (!business) {
      this.router.navigate(['/business-list']);
      return;
    }
    this.businessName = business.nombre;
    this.filterStatsByRole();
    this.loadMockAppointments();
  }

  filterStatsByRole() {
    const role = this.authService.getRole();
    if (role) {
      this.stats = this.allStats.filter(stat => stat.roles.includes(role));
    }
  }

  loadMockAppointments() {
    this.appointments = [
      { id: 1, cliente: 'Juan Perez', hora: '10:00 AM', servicio: 'Corte Degradado', estado: 'Pendiente' },
      { id: 2, cliente: 'Maria Garcia', hora: '11:30 AM', servicio: 'Tinte Completo', estado: 'Confirmada' },
      { id: 3, cliente: 'Carlos Ruiz', hora: '01:00 PM', servicio: 'Barba y Perfilado', estado: 'Pendiente' }
    ];
  }

  onAddAppointment() {
    console.log('Agendar cita para:', this.businessName);
  }

  onViewFinances() {
    console.log('Ver finanzas de:', this.businessName);
  }
}
