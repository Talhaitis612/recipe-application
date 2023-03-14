import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { switchMap, catchError, map, tap } from 'rxjs/operators';

import * as AuthActions from './auth.actions';
import { environment } from '../../../environments/environment';

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
  return AuthActions.AuthenticateSuccess({
    email: email,
    userId: userId,
    token: token,
    expirationDate: expirationDate
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
        map(resData => {
          return handleAuthentication(resData.expiresIn, resData.email, resData.localId, resData.idToken)
        }),
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
          map(resData => {
            return handleAuthentication(resData.expiresIn, resData.email, resData.localId, resData.idToken)
          }),
          catchError(errorRes => {
            return handleError(errorRes);
          }))
      ))

    ))




  authSucces$ = createEffect(() => (
    this.actions$.pipe(
      ofType(AuthActions.AuthenticateSuccess),
      tap(() => this.router.navigate(['/']))
    )
  ),
    { dispatch: false }
  )


  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router
  ) { }
}
