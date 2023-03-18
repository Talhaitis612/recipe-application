import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, switchMap } from 'rxjs';
import { addIngredients } from 'src/app/shopping-list/store/shopping-list.actions';
import { AppState } from 'src/app/store/app.reducer';

import { Recipe } from '../recipe.model';
import { DeleteRecipe } from '../store/recipe.actions';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe!: Recipe;
  id!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>) {
  }

  ngOnInit() {
    // this.route.params
    //   .subscribe(
    //     (params: Params) => {
    //       this.id = +params['id'];
    //       this.recipe = this.recipeService.getRecipe(this.id);
    //     }
    //   );
    this.route.params.pipe(
      map((params: Params) => +params['id']),
      switchMap(id=>{
        this.id = id;
        return this.store.select('recipes');
      }),
      map(recipeState =>{
        return recipeState.recipes.find((recipe, index)=>index===this.id)
      })
      ).subscribe({
        next : (recipe : any)=>{
          this.recipe = recipe;
        }
      })
  }

  onAddToShoppingList() {
    this.store.dispatch(addIngredients({ ingredients: this.recipe.ingredients }));
    // this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
  }

  onEditRecipe() {
    this.router.navigate(['edit'], { relativeTo: this.route });
    // this.router.navigate(['../', this.id, 'edit'], {relativeTo: this.route});
  }

  onDeleteRecipe() {
    this.store.dispatch(DeleteRecipe({index: this.id}))
    this.router.navigate(['/recipes']);
  }

}
