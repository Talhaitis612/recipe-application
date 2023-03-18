import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { switchMap, catchError, map, tap } from 'rxjs/operators';

import * as AuthActions from './auth.actions';
import { environment } from '../../../environments/environment';
import { User } from '../user.model';
import { AuthService } from '../auth.service';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}
const handleAuthentication: any = (expiresIn: number, email: string, userId: string, token: string) => {
  const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000);
  const user = new User(email, userId, token, expirationDate);
  localStorage.setItem('userData', JSON.stringify(user));
  return AuthActions.AuthenticateSuccess({
    email: email,
    userId: userId,
    token: token,
    expirationDate: expirationDate,
    redirect : true
  });
};
const handleError = (errorRes: any) => {

  let errorMessage = 'An unknown error occurred!';
  if (!errorRes.error || !errorRes.error.error) {
    return of(AuthActions.AuthenticateFail({ error: errorMessage }));
  }
  switch (errorRes.error.error.message) {
    case 'EMAIL_NOT_FOUND':
      errorMessage = 'This email does not exist!';
      break;
    case 'INVALID_PASSWORD':
      errorMessage = 'This password is not correct!';
      break;
    case 'EMAIL_EXISTS':
      errorMessage = 'This email exists already.'

  }
  return of(AuthActions.AuthenticateFail({ error: errorMessage }));

};


@Injectable()
export class AuthEffects {

  authLogin$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.LoginStart),
    switchMap((authData: any) => {
      console.log(authData);
      return this.http.post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`,
        {
          email: authData.email,
          password: authData.password,
          returnSecureToken: true
        }
      ).pipe(
        tap((resData) => {
          this.authService.setLogoutTimer(+resData.expiresIn * 1000)
        }),
        map(resData => (
          handleAuthentication(resData.expiresIn, resData.email, resData.localId, resData.idToken)
        )
        ),
        catchError(errorRes => {
          return handleError(errorRes);
        })
      )
    })
  ));


  authSignUp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.SignupStart),
      switchMap((authData: any) => (
        this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey, {
          email: authData.email,
          password: authData.password,
          returnSecureToken: true
        }).pipe(
          tap((resData) => {
            this.authService.setLogoutTimer(+resData.expiresIn * 1000)
          }),
          map(resData => (
            handleAuthentication(resData.expiresIn, resData.email, resData.localId, resData.idToken)
          )
          ),
          catchError(errorRes => {
            return handleError(errorRes);
          }))
      ))

    ))




  authRedirect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.AuthenticateSuccess),
      tap((authSuccessAction) => {
        if(authSuccessAction.redirect){
          this.router.navigate(['/']);
        }

      })
    ),
    { dispatch: false }
  );




  autoLogin = createEffect(() =>
  (this.actions$.pipe(
    ofType(AuthActions.AutoLogin),
    map(() => {
      const userData: {
        email: string;
        id: string;
        _token: string;
        _tokenExpirationDate: string;
      } = JSON.parse(localStorage.getItem("userData")!);
      console.log(userData);
      if (!userData) {
        return { type: 'Dummy' };
      }

      const loadedUser = new User(
        userData.email,
        userData.id,
        userData._token,
        new Date(userData._tokenExpirationDate)
      );

      if (loadedUser.token) {
        const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
        this.authService.setLogoutTimer(expirationDuration);
        return AuthActions.AuthenticateSuccess(
          {
            email: loadedUser.email,
            userId: loadedUser.id,
            token: loadedUser.token,
            expirationDate: new Date(userData._tokenExpirationDate),
            redirect : false
          }
        )
      }
      return { type: 'Dummy' };
    })
  )),
  )


  authLogout = createEffect(() =>
  (this.actions$.pipe(
    ofType(AuthActions.Logout),
    tap(() => {
      this.authService.clearLogoutTimer();
      localStorage.removeItem('userData');
      this.router.navigate(['/auth']);

    })
  )),
    { dispatch: false }
  )


  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) { }
}
