import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, catchError, Subject, tap, throwError } from "rxjs";
import { User } from "./user.model";

export interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    user = new BehaviorSubject<User>(null!);
    constructor(private http: HttpClient, private router: Router) { }

    signUp(email: string, password: string) {
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBLqXmM3sx6UiBWALTVCr5nCAVZb97ARuo', {
            email: email,
            password: password,
            returnSecureToken: true
        }).pipe(
            catchError(this.handleError),
            tap(resData => {
                // storing the current time stamp
                this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
            })
            // catchError(erroRes => {
            //     let errorMessage = 'An unknown error occurred!';
            //     if (!erroRes.error || !erroRes.error.error) {
            //         return throwError(() => errorMessage);
            //     }
            //     switch (erroRes.error.error.message) {
            //         case 'EMAIL_EXISTS':
            //             errorMessage = 'This email exists already.'
            //     }
            //     return throwError(() => errorMessage);
            // })
        );
    }

    login(email: string, password: string) {
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBLqXmM3sx6UiBWALTVCr5nCAVZb97ARuo',
            {
                email: email,
                password: password,
                returnSecureToken: true

            })
            .pipe(
                catchError(this.handleError),
                tap(resData => {
                    // storing the current time stamp
                    this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
                })
            )
    }

    logout(){
        this.user.next(null!);
    }

    private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
        const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000);
        const user = new User(email, userId, token, expirationDate);
        this.router.navigate(['/recipes']);
        this.user.next(user);
    }
    private handleError(erroRes: HttpErrorResponse) {
        console.log(erroRes);
        let errorMessage = 'An unknown error occurred!';
        if (!erroRes.error || !erroRes.error.error) {
            return throwError(() => errorMessage);
        }
        switch (erroRes.error.error.message) {
            case 'EMAIL_EXISTS':
                errorMessage = 'This email exists already.'
                break;
            case 'EMAIL_NOT_FOUND':
                errorMessage = 'This email does not exist.'
                break
            case 'INVALID_PASSWORD':
                errorMessage = 'Your password does not match.'
        }
        return throwError(() => errorMessage)
    }
}