import { ComponentFactory, ComponentRef, ElementRef, EmbeddedViewRef, Injector, NgModuleRef, TemplateRef, Type, ViewContainerRef, ViewRef } from "@angular/core";

export class TestViewContainerRef extends ViewContainerRef{
    get element(): ElementRef<any> {
        throw new Error("Method not implemented.");
    }
    get injector(): Injector {
        throw new Error("Method not implemented.");
    }
    get parentInjector(): Injector {
        throw new Error("Method not implemented.");
    }
    clear(): void {
        throw new Error("Method not implemented.");
    }
    get(index: number): ViewRef {
        throw new Error("Method not implemented.");
    }
    get length(): number {
        throw new Error("Method not implemented.");
    }
    createEmbeddedView<C>(templateRef: TemplateRef<C>, context?: C, index?: number): EmbeddedViewRef<C> {
        throw new Error("Method not implemented.");
    }
    createComponent<C>(componentType: Type<C>, options?: { index?: number; injector?: Injector; ngModuleRef?: NgModuleRef<unknown>; projectableNodes?: Node[][]; }): ComponentRef<C>;
    createComponent<C>(componentFactory: ComponentFactory<C>, index?: number, injector?: Injector, projectableNodes?: any[][], ngModuleRef?: NgModuleRef<any>): ComponentRef<C>;
    createComponent<C>(componentFactory: unknown, index?: unknown, injector?: unknown, projectableNodes?: unknown, ngModuleRef?: unknown): import("@angular/core").ComponentRef<C> | import("@angular/core").ComponentRef<C> {
        throw new Error("Method not implemented.");
    }
    insert(viewRef: ViewRef, index?: number): ViewRef {
        throw new Error("Method not implemented.");
    }
    move(viewRef: ViewRef, currentIndex: number): ViewRef {
        throw new Error("Method not implemented.");
    }
    indexOf(viewRef: ViewRef): number {
        throw new Error("Method not implemented.");
    }
    remove(index?: number): void {
        throw new Error("Method not implemented.");
    }
    detach(index?: number): ViewRef {
        throw new Error("Method not implemented.");
    }
}