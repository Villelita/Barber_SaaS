import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { createClient, SupabaseClient, User as SupabaseUser } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  DUENO = 'DUENO',
  EMPLEADO = 'EMPLEADO',
  RECEPCION = 'RECEPCION',
  CLIENTE = 'CLIENTE'
}

export interface Business {
  id: string;
  nombre: string;
  subdominio: string;
}

export interface User {
  id: string;
  nombre: string;
  email: string;
  rol: UserRole;
  negocios?: Business[]; // Para Dueños
  esteticaId?: string;   // Para Empleados
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase: SupabaseClient;
  
  public getSupabase(): SupabaseClient {
    return this.supabase;
  }
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  private activeBusinessSubject: BehaviorSubject<Business | null>;
  public activeBusiness: Observable<Business | null>;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    
    const savedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(savedUser ? JSON.parse(savedUser) : null);
    this.currentUser = this.currentUserSubject.asObservable();

    const savedBusiness = localStorage.getItem('activeBusiness');
    this.activeBusinessSubject = new BehaviorSubject<Business | null>(savedBusiness ? JSON.parse(savedBusiness) : null);
    this.activeBusiness = this.activeBusinessSubject.asObservable();

    // Sincronizar con la sesión real de Supabase
    this.checkSession();

    // Escuchar cambios en la sesión de Supabase
    this.supabase.auth.onAuthStateChange((event, session) => {
      console.log('Supabase Auth Event:', event);
      if (event === 'SIGNED_IN' && session?.user) {
        this.updateUserFromSupabase(session.user);
      } else if (event === 'SIGNED_OUT') {
        this.clearSession();
      }
    });
  }

  private async checkSession() {
    const { data: { session } } = await this.supabase.auth.getSession();
    if (session?.user) {
      this.updateUserFromSupabase(session.user);
    } else if (!session) {
      // Si no hay sesión en Supabase pero sí en localStorage, limpiar
      if (this.currentUserSubject.value) {
        this.clearSession();
      }
    }
  }

  private updateUserFromSupabase(supabaseUser: SupabaseUser) {
    const user: User = {
      id: supabaseUser.id,
      nombre: supabaseUser.user_metadata?.['nombre'] || 'Usuario',
      email: supabaseUser.email!,
      rol: (supabaseUser.app_metadata?.['role'] as UserRole) || UserRole.DUENO
    };
    this.saveSession(user);
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public get activeBusinessValue(): Business | null {
    return this.activeBusinessSubject.value;
  }

  // --- MOCK MODE ---
  private readonly MOCK_MODE = false; 

  public get isMockMode(): boolean {
    return this.MOCK_MODE;
  }

  async login(email: string, password: string): Promise<any> {
    if (this.MOCK_MODE) {
      console.log('Login en MODO MOCK (sin Supabase)');
      const user: User = {
        id: 'mock-id-' + Math.random(),
        nombre: 'Admin Demo',
        email: email,
        rol: UserRole.DUENO
      };
      this.saveSession(user);
      return { user };
    }

    const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
    
    if (error) throw error;

    if (data.user) {
      this.updateUserFromSupabase(data.user);
      return data;
    }
  }

  async register(email: string, password: string, nombre: string, rol: UserRole = UserRole.DUENO): Promise<any> {
    if (this.MOCK_MODE) {
      console.log('Registro en MODO MOCK (sin Supabase)');
      const user: User = {
        id: 'mock-id-' + Math.random(),
        nombre,
        email,
        rol: rol
      };
      this.saveSession(user);
      return { user: { id: user.id } };
    }

    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nombre },
      }
    });

    if (error) throw error;

    if (data.user) {
      const user: User = {
        id: data.user.id,
        nombre,
        email,
        rol: rol
      };
      this.saveSession(user);
      return data;
    }
  }

  private saveSession(user: User) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
    
    // Si es empleado, el negocio activo es el suyo
    if (user.rol === UserRole.EMPLEADO && user.esteticaId) {
      const mockBusiness = { id: user.esteticaId, nombre: 'Mi Negocio', subdominio: 'mi-negocio' };
      this.setActiveBusiness(mockBusiness);
    }
  }

  setActiveBusiness(business: Business) {
    localStorage.setItem('activeBusiness', JSON.stringify(business));
    this.activeBusinessSubject.next(business);
  }

  async logout() {
    await this.supabase.auth.signOut();
    this.clearSession();
  }

  private clearSession() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('activeBusiness');
    this.currentUserSubject.next(null);
    this.activeBusinessSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  getRole(): UserRole | null {
    return this.currentUserSubject.value?.rol || null;
  }
}
