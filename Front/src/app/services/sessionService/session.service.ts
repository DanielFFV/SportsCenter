import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { GrupoResponse } from 'src/app/models/grupo';
import { LoginResponse } from 'src/app/models/login';
import { PersonaResponse } from 'src/app/models/persona';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private readonly SESSION_TIMEOUT = 1800000;

  constructor(private router: Router) {
    this.initSessionTimeout();
  }
  
  setUserData(userData: LoginResponse): void {
    sessionStorage.setItem('userData', JSON.stringify(userData));
  }
  replaceUserGroup(nuevoGrupo: GrupoResponse): void {
    // Obtener los datos de usuario actuales
    const userData = this.getUserData();
  
    if (userData) {
      // Reemplazar el grupo existente con el nuevo grupo
      userData.grupo = nuevoGrupo;
  
      // Guardar el objeto actualizado en sessionStorage
      this.setUserData(userData);
    } else {
      console.error('No se encontró userData en sessionStorage.');
    }
  }

  getUserData(): LoginResponse  | null {
    const data = sessionStorage.getItem('userData');
    return data ? JSON.parse(data) : null;
  }

  clearUserData(): void {
    sessionStorage.removeItem('userData');
    sessionStorage.clear();
  }
  isLoggedIn(): boolean {
    return this.getUserData() !== null;
  }

  // Método para actualizar la hora de la última actividad
  private updateLastActivityTime(): void {
    sessionStorage.setItem('lastActivity', Date.now().toString());
  }

  // Método para verificar si la sesión ha expirado
  private isSessionExpired(): boolean {
    const lastActivity = sessionStorage.getItem('lastActivity');
    if (lastActivity) {
      const now = Date.now();
      const elapsedTime = now - parseInt(lastActivity, 10);
      return elapsedTime > this.SESSION_TIMEOUT;
    }
    return true; // Si no hay registro de actividad, la sesión está expirada
  }

  // Método para cerrar sesión manualmente o automáticamente
  logout(): void {
    this.clearUserData();
    this.router.navigate(['/home']); // Redirigir al login
  }

  // Inicializar control de tiempo de inactividad
  private initSessionTimeout(): void {
    // Cada vez que haya actividad, actualizar el tiempo de última actividad
    document.addEventListener('mousemove', () => this.updateLastActivityTime());
    document.addEventListener('keydown', () => this.updateLastActivityTime());

    // Comprobar periódicamente si la sesión ha expirado
    setInterval(() => {
      if (this.isSessionExpired()) {
        this.logout();
      }
    }, 60000); // Verifica cada minuto (60000 ms)
  }
}
