import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, of, switchMap, take } from 'rxjs';
import { AppState } from '../store/app.reducer';
import { FetchRecipes, SetRecipe } from './store/recipe.actions';

@Injectable({
  providedIn: 'root',
})
export class RecipesResolverService implements Resolve<any> {
  constructor(
    private store: Store<AppState>,
    private actions$: Actions
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    return this.store.select('recipes').pipe(
      take(1),
      map((recipeState)=>recipeState.recipes),
      switchMap((recipes)=>{
        if(recipes.length === 0){
          this.store.dispatch(FetchRecipes());
          // but will wait for the setRecipes to be set
          return this.actions$.pipe(ofType(SetRecipe), take(1));
        }
        else {
          return of(recipes);
        }
      })
    )
  }
}
