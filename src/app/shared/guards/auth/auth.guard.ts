import { Injectable } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Paths } from '~enums/paths.enum';
import { RouteData } from '~interfaces/route-data.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private auth: Auth, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const path = state.url.split('/')[1];
    const data = route.data as RouteData;
    const noAuthPaths: Paths[] = [Paths.SignIn, Paths.SignUp, Paths.ForgotPassword];

    return authState(this.auth).pipe(
      map((user) => {
        const isAuthorized = !!user;

        if (isAuthorized && noAuthPaths.includes(data.path)) {
          return this.router.parseUrl(`/${Paths.Dashboard}`);
        } else if (isAuthorized || (!isAuthorized && path === Paths.Auth)) {
          return true;
        } else {
          return this.router.parseUrl(`/${Paths.Auth}/${Paths.SignIn}`);
        }
      })
    );
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.canActivate(childRoute, state);
  }
}
