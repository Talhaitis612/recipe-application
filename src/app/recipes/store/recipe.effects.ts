import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, map, tap, catchError, withLatestFrom } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { FetchRecipes, SaveRecipes, SetRecipe } from './recipe.actions';
import { Recipe } from '../recipe.model';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducer';

@Injectable()
export class RecipeEffects {


  fetchRecipes$ = createEffect(() => (
    this.actions$.pipe(
      ofType(FetchRecipes),
      switchMap(() => {
        return this.http
          .get<Recipe[]>(
            'https://recipe-shopping-list-3a777-default-rtdb.firebaseio.com/recipes.json',
          )
          .pipe(
            map(recipes => {
              return recipes.map(recipe => ({
                ...recipe,
                ingredients: recipe.ingredients ? recipe.ingredients : [],
              }));
            }),
            map(recipes => SetRecipe({ recipes })),
          );
      })
    )
  ));

  saveRecipes$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SaveRecipes),
      withLatestFrom(this.store.select('recipes')),
      switchMap(([actionData, recipeState]) => {
        return this.http.put(
          'https://recipe-shopping-list-3a777-default-rtdb.firebaseio.com/recipes.json',
          recipeState.recipes
        )
      })
    );
  },
    { dispatch: false }
  );


  constructor(private actions$: Actions, private http: HttpClient, private store: Store<AppState>) { }

}
