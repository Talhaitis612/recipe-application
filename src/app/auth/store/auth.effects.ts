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
          const expirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);
          return AuthActions.AuthenticateSuccess({
            email: resData.email,
            userId: resData.localId,
            token: resData.idToken,
            expirationDate: expirationDate
          });
        }),
        catchError(errorRes => {
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
          }
          return of(AuthActions.AuthenticateFail({ error: errorMessage }));
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
            const expirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);
            return AuthActions.AuthenticateSuccess({
              email: resData.email,
              userId: resData.localId,
              token: resData.idToken,
              expirationDate: expirationDate
            });
          }),
          catchError(errorRes => {
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
            }
            return of(AuthActions.AuthenticateFail({ error: errorMessage }));
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
