import { Component, ComponentFactoryResolver, OnDestroy, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Observable, Subscription } from "rxjs";
import { AlertComponent } from "../shared/alert/alert.component";
import { PlaceHolderDirective } from "../shared/placeholder/placeholder.directive";
import { AuthResponseData, AuthService } from "./auth.service";

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent implements OnDestroy {
    isLoginMode = true;
    isLoading = false;
    error: string | any = null;

    private closeSub! : Subscription;

    @ViewChild(PlaceHolderDirective, {static : false}) alertHost! : PlaceHolderDirective;


    constructor(private authService: AuthService, private componentFactoryResolver : ComponentFactoryResolver) { }

    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode;
    }

    onSubmit(form: NgForm) {
        console.log(form.value);
        if (form.invalid) {
            return;
        }
        const email = form.value.email;
        const password = form.value.password;
        let authObs: Observable<AuthResponseData>;
        this.isLoading = true;
        if (this.isLoginMode) {
            authObs = this.authService.login(email, password);

        }
        else {
            authObs = this.authService.signUp(email, password);
        }
        authObs.subscribe({
            next: (res) => {
                console.log(res)
                this.isLoading = false;

            },
            error: (errorRes) => {
                this.error = errorRes;
                this.showErrorAlert(errorRes);
                this.isLoading = false;

            }
        })
        form.reset();
    }

    onHandleError(){
        this.error = null
    }
    // dynamically creating component
    private showErrorAlert(message : string){
        const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
        const hostViewContainerRef = this.alertHost.viewContainerRef;
        hostViewContainerRef.clear();
        const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);
        componentRef.instance.message = message;
        this.closeSub = componentRef.instance.close.subscribe(
            ()=>{
                this.closeSub.unsubscribe();
                hostViewContainerRef.clear();
            }
        )
    }

    ngOnDestroy(): void {
        if(this.closeSub){
            this.closeSub.unsubscribe();
        }
    }
}