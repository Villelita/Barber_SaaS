import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, UserRole, User } from '../../../services/auth.service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {
  empleados: User[] = [];
  businessName = '';
  activeBusinessId = '';
  showModal = false;
  employeeForm: FormGroup;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.employeeForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      rol: [UserRole.EMPLEADO, [Validators.required]]
    });
  }

  ngOnInit() {
    this.authService.activeBusiness.subscribe(business => {
      if (business) {
        this.businessName = business.nombre;
        this.activeBusinessId = business.id;
        this.loadEmployees(business.id);
      }
    });
  }

  loadEmployees(businessId: string) {
    console.log('Cargando empleados para el negocio:', businessId);
    
    if (this.empleados.length === 0) {
      this.empleados = [
        { id: '101', nombre: 'Juan Pérez', email: 'juan@demo.com', rol: UserRole.EMPLEADO, esteticaId: businessId },
        { id: '102', nombre: 'María García', email: 'maria@demo.com', rol: UserRole.EMPLEADO, esteticaId: businessId }
      ];
    }
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.employeeForm.reset({ rol: UserRole.EMPLEADO });
  }

  onSubmit() {
    if (this.employeeForm.invalid) return;

    const newEmployee: User = {
      id: Math.random().toString(36).substr(2, 9),
      ...this.employeeForm.value,
      esteticaId: this.activeBusinessId
    };

    this.empleados.push(newEmployee);
    console.log('Empleado agregado:', newEmployee);
    
    this.closeModal();
  }

  deleteEmployee(id: string) {
    if (confirm('¿Estás seguro de que quieres eliminar a este empleado?')) {
      this.empleados = this.empleados.filter(e => e.id !== id);
    }
  }
}
