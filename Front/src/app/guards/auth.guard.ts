import { Injectable } from '@angular/core';
import { CanActivate, CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SessionService } from '../services/sessionService/session.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private sessionService: SessionService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.sessionService.isLoggedIn()) {
      return true;
    }

    // Almacenar la URL intentada para redirigir después del login
    const redirectUrl = state.url;
    return this.router.createUrlTree(['/login'], {
      queryParams: {
        returnUrl: redirectUrl
      }
    });
  }
}