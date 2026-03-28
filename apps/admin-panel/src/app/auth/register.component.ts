import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService, UserRole } from '../services/auth.service';

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
  successMessage = '';

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {
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
    this.successMessage = '';
    
    const { nombre, email, password, nombreEstetica } = this.registerForm.value;

    try {
      console.log('Registrando usuario en Supabase:', { nombre, email, nombreEstetica });
      
      const { data, error } = await this.authService.register(email, password, nombre);

      if (error) throw error;

      if (this.authService.isMockMode) {
        console.log('Registro exitoso (MODO MOCK)');
        this.router.navigate(['/dashboard']);
        return;
      }

      // Si Supabase devuelve un usuario pero no hay sesión (session es null), 
      // probablemente sea porque la confirmación por email está activada.
      const { data: { session } } = await this.authService.getSupabase().auth.getSession();
      
      if (!session) {
        this.successMessage = '¡Registro exitoso! Por favor, revisa tu correo electrónico para confirmar tu cuenta antes de iniciar sesión.';
        this.registerForm.reset();
      } else {
        console.log('Registro y login automáticos exitosos');
        this.router.navigate(['/dashboard']);
      }
      
    } catch (error: any) {
      console.error('Error en registro:', error);
      
      // Intentar extraer mensaje amigable de Supabase
      if (error.message === 'User already registered') {
        this.errorMessage = 'Este correo ya está registrado. Intenta iniciar sesión.';
      } else if (error.status === 429) {
        this.errorMessage = 'Demasiados intentos. Por favor, espera un momento antes de volver a intentarlo.';
      } else {
        this.errorMessage = error.message || 'Error al crear la cuenta. Inténtalo de nuevo.';
      }
      this.cdr.detectChanges();
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }
}
