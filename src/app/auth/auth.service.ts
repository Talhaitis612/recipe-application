import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, throwError } from "rxjs";

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


    constructor(private http: HttpClient) { }

    signUp(email: string, password: string) {
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBLqXmM3sx6UiBWALTVCr5nCAVZb97ARuo', {
            email: email,
            password: password,
            returnSecureToken: true
        }).pipe(
            catchError(erroRes => {
                let errorMessage = 'An unknown error occurred!';
                if (!erroRes.error || !erroRes.error.error) {
                    return throwError(() => errorMessage);
                }
                switch (erroRes.error.error.message) {
                    case 'EMAIL_EXISTS':
                        errorMessage = 'This email exists already.'
                }
                return throwError(() => errorMessage);
            })
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
                catchError(erroRes => {
                    let errorMessage = 'An unknown error occurred!';
                    if (!erroRes.error || !erroRes.error.error) {
                        return throwError(() => errorMessage);
                    }
                    switch (erroRes.error.error.message) {
                        case 'EMAIL_NOT_FOUND':
                            errorMessage = 'This email does not exist'
                            break
                        case 'INVALID_PASSWORD':
                            errorMessage = 'Your password does not match.'
                    }
                    return throwError(() => errorMessage)
                })
            )
    }
    private handleError(erroRes: HttpErrorResponse){

    }
}