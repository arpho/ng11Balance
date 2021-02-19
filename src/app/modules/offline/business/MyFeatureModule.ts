import { NgModule, Injector } from '@angular/core'

@NgModule({})
export class MyFeatureModule {
    static injector: Injector;
    constructor(injector: Injector) {
        MyFeatureModule.injector = injector;
    }
}