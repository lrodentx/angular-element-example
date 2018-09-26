import { BrowserModule } from "@angular/platform-browser";
import {
  NgModule,
  Injector,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import {
  createCustomElement,
  NgElementConstructor,
} from "@angular/elements";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatButtonModule, MatCheckboxModule } from "@angular/material";

import { ButtonComponent } from "./button/button.component";
import { CustomNgElementStrategyFactory } from "./custom-strategy/custom-element-strategy-factory";

@NgModule({
  declarations: [ButtonComponent],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule
  ],
  providers: [],
  entryComponents: [ButtonComponent]
})
export class AppModule {
  constructor(private injector: Injector) {
    debugger;
    if (customElements.get("custom-button")) {
      return;
    }

    const customButton: NgElementConstructor<HTMLElement> = createCustomElement(
      ButtonComponent,
      {
        injector: this.injector,
        strategyFactory: new CustomNgElementStrategyFactory<ButtonComponent>(ButtonComponent, this.injector),
      }
    );
    customElements.define("custom-button", customButton);
  }

  ngDoBootstrap() {}
}
