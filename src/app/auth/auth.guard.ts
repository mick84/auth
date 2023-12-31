import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.user.pipe(
    take(1),
    map((user) => {
      const isAuth = !!user;
      return isAuth || router.createUrlTree(['/auth']);
    })
  );
};

/*
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    return this.authService.user.pipe(map((user) => !!user));
  }
}
*/
