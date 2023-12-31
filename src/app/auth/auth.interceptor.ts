import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpParams,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, exhaustMap, take } from 'rxjs';
import { AuthService } from './auth.service';
/*
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const updatedReq = req.clone({
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    body: {
      ...(<{ email: string; password: string }>req.body),
      returnSecureToken: true,
    },
  });
  return next(updatedReq);
};
*/
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log('Interceptor working!');
    return this.authService.user.pipe(
      take(1),
      exhaustMap((user) => {
        if (!user) {
          return next.handle(req);
        }
        const updatedReq = req.clone({
          body: {
            ...(<{ email: string; password: string }>req.body),
            returnSecureToken: true,
          },
          params: new HttpParams().set('auth', user.token),
        });
        return next.handle(updatedReq);
      })
    );
  }
}
