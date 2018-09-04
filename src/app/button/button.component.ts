import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'custom-button',
  template: `
    <img [src]="this.imageSource">
    <button mat-button (click)="handleClick()">{{label}}</button>
  `,
  styles: [`
    button {
      border: solid 3px;
      padding: 8px 10px;
      background-color: var(--okvp-button-default-background-color);
      font-size: 20px;
    }
  `],
  encapsulation: ViewEncapsulation.Native
})
export class ButtonComponent {
  @Input() label: string = 'default label';
  @Output() event: EventEmitter<number> = new EventEmitter<number>();
  private clicksCounter: number = 0;

  handleClick() {
    this.clicksCounter++;
    this.event.emit(this.clicksCounter);
  }

  get imageSource(): string {
    return `${(<any>window).BASE_URL}assets/me.jpg`;
  }
}
