// reducer is just a function
// this function changes the state

import { Action, createReducer, on } from '@ngrx/store';
import { Ingredient } from '../../shared/ingredient.model';
import * as ShoppingListActions from './shopping-list.actions';

export interface State {
    ingredients: Ingredient[];
    editedIngredient: Ingredient;
    editedIngredientIndex: number;
}

const initialState: State = {
    ingredients: [new Ingredient('Apples', 5), new Ingredient('Tomatoes', 10)],
    editedIngredient: null!,
    editedIngredientIndex: -1,
};

export const shoppingListReducer = createReducer(
    initialState,
    on(ShoppingListActions.addIngredient, (state, ingredient) => ({
        ...state,
        ingredients: [...state.ingredients, ingredient],
    })),
    on(ShoppingListActions.addIngredients, (state, { ingredients }) => {
        console.log(ingredients);
        return { ...state, ingredients: [...state.ingredients, ...ingredients] }
    }),
    on(ShoppingListActions.updateIngredient, (state, ingredient) => ({
        ...state,
        ingredients: state.ingredients.map((item, index) =>
            index === state.editedIngredientIndex ? { ...item, ...ingredient } : item
        ),
        editedIngredientIndex: -1,
        editedIngredient: null!,
    })),
    on(ShoppingListActions.deleteIngredient, (state) => ({
        ...state,
        ingredients: state.ingredients.filter(
            (ig, igIndex) => igIndex !== state.editedIngredientIndex
        ),
    })),
    on(ShoppingListActions.startEdit, (state, action) => {
        const editedIngredient = { ...state.ingredients[action.index] };
        return {
            ...state,
            editedIngredient: editedIngredient,
            editedIngredientIndex: action.index
        }
    }),
    on(ShoppingListActions.stopEdit, (state) => ({
        ...state,
        editedIngredient: null!,
        editedIngredientIndex: -1
    }))

);
