import { createReducer, on } from "@ngrx/store";
import { User } from "../user.model";
import {  AuthenticateFail, AuthenticateSuccess, LoginStart, Logout } from "./auth.actions";

export interface State {
    user: User;
    authError: string,
    loading: boolean
}

const initialState: State = {
    user: null!,
    authError: null!,
    loading: false
};

export const authReducer = createReducer(

    initialState,
    on(LoginStart, (state) => ({ ...state, authError: null!, loading: true })),
    on(AuthenticateSuccess, (state, payload) => {
        const user = new User(
            payload.email,
            payload.userId,
            payload.token,
            payload.expirationDate
        );
        return {
            ...state,
            authError: null!,
            user: user,
            loading : false
        };
    }
    ),
    on(AuthenticateFail, (state, payload) => ({ ...state, authError: payload.error, user: null!, loading: false })),
    on(Logout, (state, payload) => ({ ...state, user: null! }))
)