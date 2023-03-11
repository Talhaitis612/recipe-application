import { createAction, props } from "@ngrx/store";


// export const Login = createAction('[Login Page] LOGIN', props<{
//     email: string;
//     userId: string;
//     token: string;
//     expirationDate: Date;
// }>);


export const Login = createAction(
    '[Login Page] Login',
    props<{
        email: string;
        userId: string;
        token: string;
        expirationDate: Date;

    }>()
)




export const Logout = createAction('[Header Page] LOGOUT');