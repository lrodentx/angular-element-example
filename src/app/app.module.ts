import { BrowserModule } from "@angular/platform-browser";
import { NgModule, Injector } from "@angular/core";
import { createCustomElement } from "@angular/elements";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatButtonModule, MatCheckboxModule } from "@angular/material";

import { ButtonComponent } from "./button/button.component";

@NgModule({
  declarations: [ButtonComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
  ],
  providers: [],
  entryComponents: [ButtonComponent]
})
export class AppModule {
  constructor(private injector: Injector) {
    if (customElements.get("custom-button")) return;
    const customButton = createCustomElement(ButtonComponent, {
      injector: this.injector
    });
    customElements.define("custom-button", customButton);
  }

  ngDoBootstrap() {}
}
