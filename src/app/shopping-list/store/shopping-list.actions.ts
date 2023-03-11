import { createAction, props } from '@ngrx/store';
import { Ingredient } from 'src/app/shared/ingredient.model';

// export const ADD_INGREDIENT = createAction('ADD_INGREDIENT');
export const addIngredient = createAction(
  '[Shopping List] ADD_INGREDIENT',
  props<Ingredient>()
);

export const addIngredients = createAction(
  'Recipe Edit ADD_INGREDIENTS',
  props<{ingredients : Ingredient[]}>() 
)

export const updateIngredient = createAction(
  '[Shopping List] UPDATE_INGREDIENT',
  props <Ingredient>()
);

export const deleteIngredient = createAction(
  '[Shopping List] DELETE_INGREDIENT',
)


export const startEdit = createAction(
  '[Shopping List] EDIT_INGREDIENT',
  props<{index : number}>()
)

export const stopEdit = createAction(
  '[Shopping Edit] STOP_EDIT'
)