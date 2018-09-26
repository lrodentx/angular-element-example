import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
  OnChanges
} from "@angular/core";
import { AfterViewChecked } from "@angular/core";

@Component({
  selector: "custom-button",
  template: `
    <div class="myCusomWidget">
    <img [src]="this.imageSource">

    <input matInput placeholder="Platzhalter1...." (change)="handleChangeInput1($event)" [value]="getPropertyValue(wert1)">
    <input matInput placeholder="Platzhalter2...." (change)="handleChangeInput2($event)" [value]="getPropertyValue(wert2)">

    <button mat-button (click)="handleClick1()">{{ getPropertyValue(buttonText1) }}</button>
    <button mat-button (click)="handleClick2()">{{ getPropertyValue(buttonText2) }}</button>

    <button (click)="onLogMe()">Log me</button>

    </div>
  `,
  styles: [
    `
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
    `
  ],
  encapsulation: ViewEncapsulation.Native
})
export class ButtonComponent
  implements AfterViewChecked, AfterViewInit, OnInit {
  @Input()
  config: any = {};

  @Input()
  widgetModel: any = {};
  @Input()
  wert1: String;
  @Input()
  wert2: String;
  @Input()
  buttonText1: String;
  @Input()
  buttonText2: String;
  @Input()
  eventFn: Function;

  @Output()
  registerAttributeEvent: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  valueChange: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  fireEvent: EventEmitter<any> = new EventEmitter<any>();

  ngAfterViewInit() {
    console.log("ngAfterViewInit");
    // this.createAttributeEvents();
  }

  ngAfterViewChecked() {
    console.log("ngAfterViewChecked");
    this.createAttributeEvents();
  }

  ngOnInit() {
    console.log("ngOnInit");
    // this.createAttributeEvents();
  }

  createAttributeEvents(): void {
    // Register, to get noticed when an new widgetModel is set
    this.registerAttributeEvent.emit({
      path: "widgetModel",
      attribute: "widgetModel"
    });

    this.registerAttributeEvent.emit({
      path: "widgetModel.wert1",
      attribute: "wert1"
    });

    this.registerAttributeEvent.emit({
      path: "widgetModel.wert2",
      attribute: "wert2"
    });

    this.registerAttributeEvent.emit({
      path: "widgetModel.buttonText1",
      attribute: "button-text1"
    });

    this.registerAttributeEvent.emit({
      path: "widgetModel.buttonText2",
      attribute: "button-text2"
    });
  }

  handleClick1() {
    const config = JSON.parse(this.config);
    this.fireEvent.emit({
      eventname: config.valueChangeActionId
    });
  }

  handleClick2() {
    this.fireEvent.emit({
      eventname: "myCustomAction"
    });
  }

  handleChangeInput1(event: any) {
    this.valueChange.emit({
      path: "widgetModel.wert1",
      value: event.currentTarget.value
    });
  }

  handleChangeInput2(event: any) {
    this.valueChange.emit({
      path: "widgetModel.wert2",
      value: event.currentTarget.value
    });
  }

  get imageSource(): string {
    return `runtimeProxy/myCustomWidget/img/mann.png`;
  }

  getPropertyValue(prop: string): string {
    if (prop) {
      return JSON.parse(prop).value;
    }
    return "";
  }

  onLogMe(): void {
    console.log(this);
  }
}
