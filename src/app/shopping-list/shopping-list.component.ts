import { Component, OnDestroy, OnInit } from '@angular/core';

import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
  
})

export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Ingredient[] = [];
  private igChangeSub! : Subscription;

  constructor(private shoppingListService : ShoppingListService) {}
  
  ngOnInit() {
    this.ingredients = this.shoppingListService.getIngredients();
    this.igChangeSub = this.shoppingListService.ingredientsChanged.subscribe({
      next : (ingredients : Ingredient[]) =>{
        this.ingredients = ingredients;
      }
    })
  }
  
  OnIngredientAdded(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
  }

  onEditItem(index : number){
    this.shoppingListService.startedEditing.next(index);
  }
  
  ngOnDestroy(): void {
    this.igChangeSub.unsubscribe();                           

  }
  
}
