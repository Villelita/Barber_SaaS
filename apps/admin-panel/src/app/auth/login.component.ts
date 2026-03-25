import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(private fb: FormBuilder, private router: Router) {
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
      // TODO: Connect this mock to actual Supabase auth integration
      console.log('Intentando hacer login con', email);
      
      // Simulando llamada a la API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simular login exitoso
      this.router.navigate(['/dashboard']);
      console.log('Login exitoso (Simulado)');
      
    } catch (error: any) {
      console.error('Error en login:', error);
      this.errorMessage = error.message || 'Error al iniciar sesión. Verifica tus credenciales.';
    } finally {
      this.isLoading = false;
    }
  }
}
