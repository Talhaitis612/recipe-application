import { createReducer, on } from "@ngrx/store";
import { User } from "../user.model";
import { Login, Logout } from "./auth.actions";

export interface State {
    user: User;
}

const initialState: State = {
    user: null!,
};

export const authReducer = createReducer(          
    initialState,
    on(Login, (state, payload) => {
        const user = new User(
            payload.email,
            payload.userId,
            payload.token,
            payload.expirationDate
          );
          return {
            ...state,
            user: user,
          };
    }
    
    
    ),
    on(Logout, (state, payload) => ({ ...state, user: null! }))
)