import { createAction, props } from '@ngrx/store';
import { Ingredient } from 'src/app/shared/ingredient.model';

// export const ADD_INGREDIENT = createAction('ADD_INGREDIENT');
export const addIngredient = createAction(
  '[Shopping List] Add Ingredient',
  props<Ingredient>()
);

export const addIngredients = createAction(
  '[Shopping List] Add Ingredients',
  props<{ingredients : Ingredient[]}>() 
)

export const updateIngredient = createAction(
  '[Shopping List] Update Ingredients',
  props <Ingredient>()
);

export const deleteIngredient = createAction(
  '[Shopping List] Delete Ingredients',
)


export const startEdit = createAction(
  '[Shopping List] Edit Ingredient',
  props<{index : number}>()
)

export const stopEdit = createAction(
  '[Shopping Edit] Stop Edit'
)