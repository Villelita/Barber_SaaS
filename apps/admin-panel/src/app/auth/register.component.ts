import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(private fb: FormBuilder, private router: Router) {
    this.registerForm = this.fb.group({
      nombreEstetica: ['', [Validators.required, Validators.minLength(3)]],
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  async onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    
    const { nombreEstetica, nombre, email, password } = this.registerForm.value;

    try {
      console.log('Intentando registrar:', { nombreEstetica, nombre, email });
      
      // Simulación de registro
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Registro exitoso (Simulado)');
      this.router.navigate(['/login']);
      
    } catch (error: any) {
      console.error('Error en registro:', error);
      this.errorMessage = error.message || 'Error al crear la cuenta. Inténtalo de nuevo.';
    } finally {
      this.isLoading = false;
    }
  }
}
