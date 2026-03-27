import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  DUENO = 'DUENO',
  EMPLEADO = 'EMPLEADO',
  CLIENTE = 'CLIENTE'
}

export interface User {
  id: string;
  nombre: string;
  email: string;
  rol: UserRole;
  esteticaId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor() {
    const savedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(savedUser ? JSON.parse(savedUser) : null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(user: User) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  getRole(): UserRole | null {
    return this.currentUserSubject.value?.rol || null;
  }
}
