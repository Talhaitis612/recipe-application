import { createAction, props } from "@ngrx/store";
import { Recipe } from "../recipe.model";

export const FetchRecipes = createAction('[Recipes] Fetch Recipe');
export const SaveRecipes = createAction('[Recipes] Save Recipe');
export const SetRecipe = createAction("[Recipes] Set Recipe", props<{ recipes: Recipe[] }>());
export const AddRecipe = createAction("[Recipes] Add Recipe", props<{ recipe: Recipe }>());
export const UpdateRecipe = createAction("[Recipes] Update Recipe", props<{ index: number, newRecipe: Recipe }>());
export const DeleteRecipe = createAction("[Recipes] Delete Recipe", props<{ index: number }>());
