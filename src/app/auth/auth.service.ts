import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { BehaviorSubject, throwError } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

const signupUrl =
  'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key='; //+
environment.firebaseAPIKey;
const loginUrl =
  'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' +
  environment.firebaseAPIKey;
@Injectable({ providedIn: 'root' })
export class AuthService {
  user = new BehaviorSubject<User>(null);
  token?: string;
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) {}
  private handleError(err: HttpErrorResponse) {
    let errorMessage = 'Error occured!';
    if (!err.error || !err.error.error) {
      return throwError(() => new Error(errorMessage));
    }
    switch (err.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'Provided email already exists';
        break;
      case 'TOO_MANY_ATTEMPTS_TRY_LATER':
        errorMessage = 'Too many login attempts. Please try later.';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'Provided email does not exist';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'Wrong password provided.';
        break;
      default:
        errorMessage = err.error.error.message;
    }
    return throwError(() => new Error(errorMessage));
  }

  private handleAuth(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    this.user.next(user);
    this.autoLogout(expiresIn * 1000 /*ms*/);
    localStorage.setItem('userData', JSON.stringify(user));
  }
  signup(data: { email: string; password: string }) {
    return this.http
      .post<AuthResponseData>(
        signupUrl,
        { returnSecureToken: true, ...data },
        {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((data) =>
          this.handleAuth(
            data.email,
            data.localId,
            data.idToken,
            +data.expiresIn
          )
        )
      );
  }
  login(data: { email: string; password: string }) {
    return this.http
      .post<AuthResponseData>(
        loginUrl,
        { returnSecureToken: true, ...data },
        {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((data) =>
          this.handleAuth(
            data.email,
            data.localId,
            data.idToken,
            +data.expiresIn
          )
        )
      );
  }
  logout() {
    if (this.tokenExpirationTimer) clearTimeout(this.tokenExpirationTimer);
    this.tokenExpirationTimer = null;
    localStorage.removeItem('userData');
    this.user.next(null);
    this.router.navigate(['/auth']);
  }
  autoLogin() {
    const userData: {
      _token: string;
      id: string;
      _tokenExpirationDate: string;
      email: string;
    } | null = JSON.parse(localStorage.getItem('userData'));
    if (!userData) return;
    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );
    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }
  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(
      this.logout.bind(this), //()=>this.logout()
      expirationDuration
    );
  }
}
