import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';
import { startEdit } from './store/shopping-list.actions';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
})
export class ShoppingListComponent implements OnInit, OnDestroy {
[x: string]: any;
  ingredients!: Observable<{ingredients : Ingredient[]}> ;
  private subscription!: Subscription;

  constructor(
    private store: Store<{ shoppingList: { ingredients: Ingredient[] } }>
  ) {}

  ngOnInit() {
    this.ingredients = this.store.select('shoppingList'); //this gives us an observable
    // this.ingredients = this.slService.getIngredients();
    // this.subscription = this.slService.ingredientsChanged.subscribe(
    //   (ingredients: Ingredient[]) => {
        // this.ingredients = ingredients;
      // }
    // );
  }

  onEditItem(index: number) {
    this.store.dispatch(startEdit({index : index}));
  }

  ngOnDestroy() {
    // this.subscription.unsubscribe();
  }
}
