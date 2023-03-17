import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Logout } from '../auth/store/auth.actions';

import { DataStorageService } from '../shared/data-storage.service';

import * as fromApp from '../store/app.reducer';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
  userSub!: Subscription;
  isAuthenticated = false;
  constructor(private dataStorageService: DataStorageService, private authService: AuthService, private store: Store<fromApp.AppState>) { }


  ngOnInit() {
    this.userSub = this.store.select('auth').pipe(map(authData => authData.user)).subscribe({
      next: (user) => {
        // this.isAuthenticated = !user? false : true;
        // shortcut
        console.log('here',user);
        this.isAuthenticated = !!user;
      }
    })
  }

  onSaveData() {
    this.dataStorageService.storeRecipes();
  }

  onFetchData() {
    this.dataStorageService.fetchRecipes().subscribe({
      next: (res) => {
        console.log(res);
      }
    });
  }
  onLogout() {
    // this.authService.logout();
    this.store.dispatch(Logout());
  }
  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
}
