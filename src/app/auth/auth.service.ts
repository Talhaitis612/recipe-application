import { Injectable } from "@angular/core";
import * as fromApp from '../store/app.reducer';
import { Store } from "@ngrx/store";
import * as authActions from "./store/auth.actions";


@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private tokenExpirationTimer: any;

    constructor(private store: Store<fromApp.AppState>
    ) { }


    setLogoutTimer(expirationDuration: number) {
        console.log(expirationDuration);
        this.tokenExpirationTimer = setTimeout(() => {
            this.store.dispatch(authActions.Logout());
        }, expirationDuration)
    }

    clearLogoutTimer(){
        if(this.tokenExpirationTimer){
            clearTimeout(this.tokenExpirationTimer);
            this.tokenExpirationTimer = null;
        }
    }

}