import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { createCustomElement, NgElementConstructor } from '@angular/elements';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatCheckboxModule } from '@angular/material';

import { ButtonComponent } from './button/button.component';

@NgModule({
  declarations: [ButtonComponent],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
  ],
  providers: [],
  entryComponents: [ButtonComponent]
})
export class AppModule {
  constructor(private injector: Injector) {
    if (customElements.get('custom-button')) { return; }
    const customButton: NgElementConstructor<HTMLElement> = createCustomElement(ButtonComponent, {
      injector: this.injector
    });
    /* customButton.prototype.connectedCallback = () => {
      alert('ICH BIN CONNECTED');
    }; */
    customElements.define('custom-button', customButton);
  }

  ngDoBootstrap() { }
}
