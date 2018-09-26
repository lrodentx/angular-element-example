import { NgElementStrategy, NgElementStrategyEvent } from "@angular/elements";
import { Observable } from "rxjs";
import { ComponentNgElementStrategy } from "./lib/component-ng-element-strategy";

export class CustomElementStrategy extends ComponentNgElementStrategy implements NgElementStrategy {
  events: Observable<NgElementStrategyEvent>;
  
  connect(element: HTMLElement): void {
    super.connect(element);
    this.componentRef.instance.clickEvent.emit(this.componentRef.instance);
    debugger;
  }
  disconnect(): void {
    super.disconnect();
  }
  getInputValue(propName: string): any {
    return super.getInputValue(propName);
  }
  setInputValue(propName: string, value: string): void {
    super.setInputValue(propName, value);
  }

}
