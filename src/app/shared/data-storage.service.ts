import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { exhaustMap, map, take, tap } from 'rxjs/operators';

import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  constructor(
    private http: HttpClient
    , private recipeService: RecipeService
    , private authService: AuthService
  ) { }

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http
      .put(
        'https://recipe-shopping-list-3a777-default-rtdb.firebaseio.com/recipes.json',
        recipes
      )
      .subscribe(response => {
        console.log(response);
      });
  }

  fetchRecipes() {
    // an rxjs operator "/take/" what it does is it only takes one value
    // this.authService.user.pipe(take(1)).subscribe({
    //   next :(user)=>{

    //   }
    // })
    // returning does not work inside the subscription 
    // the solution is to pipe both the observable into one using yet another rxjs operator
    return this.http
      .get<Recipe[]>(
        'https://recipe-shopping-list-3a777-default-rtdb.firebaseio.com/recipes.json',
      ).pipe(
        map(recipes => {
          return recipes.map(recipe => {
            return {
              ...recipe,
              ingredients: recipe.ingredients ? recipe.ingredients : []
            };
          });
        }),
        tap(recipes => {
          this.recipeService.setRecipes(recipes);
        })
      )
  }
}
