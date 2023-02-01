import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AlertComponent } from "./alert/alert.component";
import { DropdownDirective } from "./dropdown.directive";
import { LoadingSpinnerComponent } from "./loading-spinner/loading-spinner.component";
import { PlaceHolderDirective } from "./placeholder/placeholder.directive";

@NgModule({
    declarations: [AlertComponent, LoadingSpinnerComponent, PlaceHolderDirective, DropdownDirective],
    imports: [CommonModule, ReactiveFormsModule, FormsModule,],
    exports : [
        AlertComponent, LoadingSpinnerComponent, PlaceHolderDirective, DropdownDirective,
        CommonModule, ReactiveFormsModule, FormsModule
    ]
})
export class SharedModule {

}