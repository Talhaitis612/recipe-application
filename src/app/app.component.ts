import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Store } from '@ngrx/store';
import { AutoLogin } from './auth/store/auth.actions';
import { AppState } from './store/app.reducer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  constructor(private store : Store<AppState>, @Inject (PLATFORM_ID) private platformId : any){

  }
  ngOnInit(): void {
    if(isPlatformBrowser(this.platformId)){
      this.store.dispatch(AutoLogin());
    }
  }

}
