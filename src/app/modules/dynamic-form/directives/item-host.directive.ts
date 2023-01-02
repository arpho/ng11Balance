import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[itemHost]'
})
export class ItemHostDirective {

  constructor(public viewContainerRef:ViewContainerRef) { }

}
