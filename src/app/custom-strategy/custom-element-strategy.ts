import { NgElementStrategy, NgElementStrategyEvent, NgElement } from "@angular/elements";
import { Observable } from "rxjs";
import { ComponentNgElementStrategy } from "./lib/component-ng-element-strategy";

export class CustomElementStrategy extends ComponentNgElementStrategy implements NgElementStrategy {
  events: Observable<NgElementStrategyEvent>;
  
  connect(element: NgElement): void {
    super.connect(element);
    debugger;
    setTimeout(() => {
      this.componentRef.instance.createAttributeEvents()
    }, 1);
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
