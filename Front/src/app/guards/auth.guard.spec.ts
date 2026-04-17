import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { SessionService } from '../services/sessionService/session.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let sessionService: jasmine.SpyObj<SessionService>;
  let router: jasmine.SpyObj<Router>;
  let routerStateSnapshot: RouterStateSnapshot;
  let activatedRouteSnapshot: ActivatedRouteSnapshot;

  beforeEach(() => {
    const sessionServiceSpy = jasmine.createSpyObj('SessionService', ['isLoggedIn']);
    const routerSpy = jasmine.createSpyObj('Router', ['createUrlTree']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: SessionService, useValue: sessionServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    guard = TestBed.inject(AuthGuard);
    sessionService = TestBed.inject(SessionService) as jasmine.SpyObj<SessionService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    
    routerStateSnapshot = {
      url: '/protected-route',
    } as RouterStateSnapshot;
    
    activatedRouteSnapshot = {} as ActivatedRouteSnapshot;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access when user is logged in', () => {
    sessionService.isLoggedIn.and.returnValue(true);
    
    const result = guard.canActivate(activatedRouteSnapshot, routerStateSnapshot);
    
    expect(result).toBe(true);
    expect(sessionService.isLoggedIn).toHaveBeenCalled();
  });

  it('should redirect to login with returnUrl when user is not logged in', () => {
    sessionService.isLoggedIn.and.returnValue(false);
    const expectedUrlTree = new UrlTree();
    router.createUrlTree.and.returnValue(expectedUrlTree);

    const result = guard.canActivate(activatedRouteSnapshot, routerStateSnapshot);

    expect(result).toBe(expectedUrlTree);
    expect(sessionService.isLoggedIn).toHaveBeenCalled();
    expect(router.createUrlTree).toHaveBeenCalledWith(
      ['/login'],
      { queryParams: { returnUrl: '/protected-route' } }
    );
  });

  // Test para verificar el comportamiento con diferentes estados de la sesión
  it('should handle session service errors gracefully', () => {
    sessionService.isLoggedIn.and.throwError('Session service error');
    const expectedUrlTree = new UrlTree();
    router.createUrlTree.and.returnValue(expectedUrlTree);

    const result = guard.canActivate(activatedRouteSnapshot, routerStateSnapshot);

    expect(result).toBe(expectedUrlTree);
    expect(router.createUrlTree).toHaveBeenCalledWith(
      ['/login'],
      { queryParams: { returnUrl: '/protected-route' } }
    );
  });
});