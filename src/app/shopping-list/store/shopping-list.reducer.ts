// reducer is just a function
// this function changes the state

import { Action, createReducer, on } from "@ngrx/store";
import { Ingredient } from "../../shared/ingredient.model";
import * as ShoppingListActions from './shopping-list.actions';
export const initialState = {
    ingredients: [
        new Ingredient('Apples', 5),
        new Ingredient('Tomatoes', 10),
    ]
};


export const shoppingListReducer = createReducer(
    initialState,
    on(ShoppingListActions.addIngredient, (state, { ingredient }) => ({ ...state, ingredients: [...state.ingredients, ingredient] }))
)