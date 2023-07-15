import { inject } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import {
  ActivatedRouteSnapshot,
  CanActivateChildFn,
  CanActivateFn,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { map } from 'rxjs/operators';

import { Paths } from '~enums/paths.enum';
import { RouteData } from '~interfaces/route-data.interface';

export const authGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const auth = inject(Auth);
  const router = inject(Router);
  const path = state.url.split('/')[1];
  const data = next.data as RouteData;
  const noAuthPaths: Paths[] = [Paths.SignIn, Paths.SignUp, Paths.ForgotPassword];

  return authState(auth).pipe(
    map((user) => {
      const isAuthorized = !!user;

      if (isAuthorized && noAuthPaths.includes(data.path)) {
        return router.parseUrl(`/${Paths.Dashboard}`);
      } else if (isAuthorized || (!isAuthorized && path === Paths.Auth)) {
        return true;
      } else {
        return router.parseUrl(`/${Paths.Auth}/${Paths.SignIn}`);
      }
    })
  );
};

export const authGuardChild: CanActivateChildFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot) =>
  authGuard(next, state);
