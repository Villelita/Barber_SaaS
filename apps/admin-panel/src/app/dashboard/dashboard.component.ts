import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  stats = [
    { title: 'Citas Hoy', value: '14', icon: 'calendar', color: '#0072FF' },
    { title: 'Clientes Nuevos', value: '5', icon: 'users', color: '#38A169' },
    { title: 'Ingresos', value: '$1,250', icon: 'dollar-sign', color: '#D69E2E' },
    { title: 'Servicios Activos', value: '32', icon: 'scissors', color: '#805AD5' }
  ];
}
