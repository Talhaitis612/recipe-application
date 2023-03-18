import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Subscription } from 'rxjs';
import { AppState } from 'src/app/store/app.reducer';

import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes!: Recipe[];
  subscription!: Subscription;

  constructor(
              private router: Router,
              private route: ActivatedRoute,
              private store : Store<AppState>
              ) {
  }

  ngOnInit() {
    // this.subscription = this.recipeService.recipesChanged
    //   .subscribe(
    //     (recipes: Recipe[]) => {
    //       this.recipes = recipes;
    //     }
    //   );
    // this.recipes = this.recipeService.getRecipes();
    this.store.select('recipes').pipe((map(recipeState=>recipeState.recipes))).subscribe({
      next : (recipes: Recipe[])=>{
        this.recipes = recipes;
      }
    })
  }

  onNewRecipe() {
    this.router.navigate(['new'], {relativeTo: this.route});
    
  }

  ngOnDestroy() {
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }
}
