import { Directive, ViewContainerRef } from "@angular/core";

@Directive({
    selector : '[appPlaceHolder]'
})

export class PlaceHolderDirective{
    // to contain a component dynamically
    constructor(public viewContainerRef : ViewContainerRef){}
}