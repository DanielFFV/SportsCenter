import { Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { MenuUsuarioComponent } from './Components/usuario/menu-usuario/menu-usuario.component';
import { CrearPersonaComponent } from './Components/usuario/crear-persona/crear-persona.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./Components/home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./Components/login/login.component').then((m) => m.LoginComponent),

  },
  {
    path: 'registro',
    component: CrearPersonaComponent
  },
  {
    path: 'menuUsuario',
    component: MenuUsuarioComponent,
    // loadComponent: () => import('./Components/usuario/menu-usuario/menu-usuario.component').then((m) => m.MenuUsuarioComponent),
    canActivate: [AuthGuard]
  }
];
