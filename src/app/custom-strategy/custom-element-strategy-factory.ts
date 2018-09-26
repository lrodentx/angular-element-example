import { Injector, ComponentFactory, ComponentFactoryResolver } from "@angular/core";
import { NgElementStrategyFactory, NgElementStrategy } from "@angular/elements";
import { CustomElementStrategy } from "./custom-element-strategy";

export class CustomNgElementStrategyFactory<T> implements NgElementStrategyFactory {
  private component: T;
  private injector: Injector;
  private componentFactory: ComponentFactory<T>;

  constructor(component, injector: Injector) {
    this.component = component;
    this.injector = injector;
    this.componentFactory = this.injector
      .get(ComponentFactoryResolver)
      .resolveComponentFactory(this.component);
  }
  create(injector: Injector): NgElementStrategy {
    return new CustomElementStrategy(this.componentFactory, injector);
  }
}