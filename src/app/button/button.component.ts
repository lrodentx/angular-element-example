import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'custom-button',
  template: `
    <div class="myCusomWidget">
    <img [src]="this.imageSource">

    <input matInput placeholder="Lieblingsessen" (change)="handleChange()" [value]="wert">

    <button mat-button (click)="handleClick()">{{label}}</button>

    </div>
  `,
  styles: [`
    button {
      border: solid 3px;
      padding: 8px 10px;
      background-color: var(--okvp-button-default-background-color);
      font-size: 20px;
    }

    img {
      width: 20px;
      height: 30px;
    }
  `],
  encapsulation: ViewEncapsulation.Native
})
export class ButtonComponent {
  @Input() wert;
  @Input() label = 'default label';
  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() fireEvent: EventEmitter<string> = new EventEmitter<string>();
  private clicksCounter = 0;

  handleClick() {
    this.clicksCounter++;
    this.fireEvent.emit('myCustomEvent');
  }

  handleChange() {
    this.valueChange.emit(this.wert);
  }

  get imageSource(): string {
    return `runtimeProxy/myCustomWidget/img/mann.png`;
  }
}

