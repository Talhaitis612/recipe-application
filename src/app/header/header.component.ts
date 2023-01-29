import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

import { DataStorageService } from '../shared/data-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy{
  userSub! : Subscription;
  isAuthenticated = false;
  constructor(private dataStorageService: DataStorageService, private authService : AuthService) {}


  ngOnInit(){
    this.userSub = this.authService.user.subscribe({
      next : (user)=>{
        // this.isAuthenticated = !user? false : true;
        // shortcut
        this.isAuthenticated = !!user;
      }
    })
  }

  onSaveData() {
    this.dataStorageService.storeRecipes();
  }

  onFetchData() {
    this.dataStorageService.fetchRecipes().subscribe({
      next : (res)=>{
        console.log(res);
      }
    });
  }
  onLogout(){
    this.authService.logout();
  }
  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
}
