import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService, UserRole } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    
    const { email, password } = this.loginForm.value;

    try {
      console.log('Iniciando sesión con Supabase:', email);
      
      await this.authService.login(email, password);

      this.router.navigate(['/dashboard']);
      console.log('Login exitoso');
      
    } catch (error: any) {
      console.error('Error en login:', error);
      
      if (error.message === 'Invalid login credentials') {
        this.errorMessage = 'Credenciales inválidas. Revisa tu correo y contraseña.';
      } else if (error.status === 400 && error.message.includes('Email not confirmed')) {
        this.errorMessage = 'Por favor, confirma tu correo electrónico antes de iniciar sesión.';
      } else if (error.status === 429) {
        this.errorMessage = 'Demasiados intentos. Por favor, espera un momento.';
      } else {
        this.errorMessage = error.message || 'Error al iniciar sesión. Inténtalo de nuevo.';
      }
      this.cdr.detectChanges();
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }
}
