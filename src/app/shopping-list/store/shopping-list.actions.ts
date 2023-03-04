import { createAction, props } from '@ngrx/store';
import { Ingredient } from 'src/app/shared/ingredient.model';

// export const ADD_INGREDIENT = createAction('ADD_INGREDIENT');
export const addIngredient = createAction(
  '[Shopping List] ADD_INGREDIENT',
  props<{ingredient : Ingredient}>()
);

// export class AddIngredient implements Action{
//     readonly type: string = ADD_INGREDIENT;
//     payload! : Ingredient;

// }
