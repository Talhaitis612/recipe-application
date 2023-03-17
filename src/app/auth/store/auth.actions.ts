import { createAction, props } from "@ngrx/store";




export const LoginStart = createAction('[Auth] Login Start', props<{ email: string, password: string }>())
export const SignupStart = createAction('[Auth] Signup Start', props<{ email: string, password: string }>())
export const AutoLogin = createAction('[Auth] Auto Login');



export const AuthenticateSuccess = createAction(
    '[Auth] Authenticate Success',
    props<{
        email: string;
        userId: string;
        token: string;
        expirationDate: Date;

    }>()
)


export const AuthenticateFail = createAction('[Auth] Authenticate Fail', props<{ error: string }>())



export const ClearError = createAction('[Auth] Clear Error');
export const Logout = createAction('[Auth] Logout');

