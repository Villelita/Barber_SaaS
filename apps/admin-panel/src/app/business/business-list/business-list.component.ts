import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, Business } from '../../services/auth.service';

@Component({
  selector: 'app-business-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './business-list.component.html',
  styleUrls: ['./business-list.component.scss']
})
export class BusinessListComponent implements OnInit {
  negocios: Business[] = [];
  isLoading = true;
  showModal = false;
  showEmployeeModal = false;
  businessForm: FormGroup;
  employeeForm: FormGroup;
  selectedBusinessId = '';

  constructor(
    private authService: AuthService, 
    private router: Router,
    private fb: FormBuilder
  ) {
    this.businessForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      subdominio: ['', [Validators.required, Validators.pattern(/^[a-z0-9-]+$/)]]
    });

    this.employeeForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      rol: ['EMPLEADO', [Validators.required]]
    });

    // Auto-formatear subdominio a minúsculas
    this.businessForm.get('subdominio')?.valueChanges.subscribe(value => {
      if (value) {
        const lowerValue = value.toLowerCase().replace(/\s+/g, '-');
        if (value !== lowerValue) {
          this.businessForm.get('subdominio')?.setValue(lowerValue, { emitEvent: false });
        }
      }
    });
  }

  ngOnInit() {
    this.loadBusinesses();
  }

  loadBusinesses() {
    const userStatus = this.authService.currentUserValue;
    if (userStatus && userStatus.rol === 'DUENO') {
      this.negocios = userStatus.negocios || [
        { id: '1', nombre: 'Barbería El Elegante', subdominio: 'elegante' },
        { id: '2', nombre: 'Studio de Belleza Clean', subdominio: 'clean-studio' }
      ];
    }
    this.isLoading = false;
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.businessForm.reset();
  }

  onSubmit() {
    if (this.businessForm.invalid) return;

    const newBusiness: Business = {
      id: Math.random().toString(36).substr(2, 9),
      ...this.businessForm.value
    };

    // En modo mock, lo agregamos localmente
    this.negocios.push(newBusiness);
    
    // Si estuviéramos guardando en el usuario real del servicio:
    const user = this.authService.currentUserValue;
    if (user) {
      if (!user.negocios) user.negocios = [];
      user.negocios.push(newBusiness);
    }

    this.closeModal();
  }

  openEmployeeModal(event: Event, businessId: string) {
    event.stopPropagation(); // Evitar que se seleccione el negocio
    this.selectedBusinessId = businessId;
    this.showEmployeeModal = true;
  }

  closeEmployeeModal() {
    this.showEmployeeModal = false;
    this.employeeForm.reset({ rol: 'EMPLEADO' });
  }

  onEmployeeSubmit() {
    if (this.employeeForm.invalid) return;

    // En modo mock, solo simulamos el guardado
    console.log(`Empleado agregado al negocio ${this.selectedBusinessId}:`, this.employeeForm.value);
    alert('Empleado agregado correctamente a este negocio.');
    this.closeEmployeeModal();
  }

  selectBusiness(business: Business) {
    this.authService.setActiveBusiness(business);
    this.router.navigate(['/dashboard']);
  }
}
