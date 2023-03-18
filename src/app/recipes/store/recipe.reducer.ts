import { createReducer, on } from "@ngrx/store";
import { Recipe } from "../recipe.model";
import { AddRecipe, DeleteRecipe, SetRecipe, UpdateRecipe } from "./recipe.actions";

export interface State {
  recipes: Recipe[]
}

const initialState: State = {
  recipes: [],
}

export const recipeReducer = createReducer(initialState,
  on(SetRecipe, (state, { recipes }) => ({ ...state, recipes: [...recipes] })),
  on(AddRecipe, (state, { recipe }) => ({ ...state, recipes: [...state.recipes, recipe] })),
  on(UpdateRecipe, (state, { index, newRecipe }) => {
    const updatedRecipes = [...state.recipes];
    updatedRecipes[index] = newRecipe;
    return {
      ...state,
      recipes: updatedRecipes
    };
  }),
  on(DeleteRecipe, (state, { index }) => ({ ...state, recipes: state.recipes.filter((recipe, i) => i !== index) }))
);
