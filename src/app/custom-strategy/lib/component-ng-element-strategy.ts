import { scheduler, strictEquals, extractProjectableNodes, isFunction } from "./utils";
import { Injector, ApplicationRef, SimpleChange } from "@angular/core";
import { merge } from 'rxjs';
import { map } from 'rxjs/operators';

const DESTROY_DELAY = 10;

/**
 * Creates and destroys a component ref using a component factory and handles change detection
 * in response to input changes.
 *
 * \@experimental
 */
export class ComponentNgElementStrategy {
    componentFactory: any;
    injector: any;
    inputChanges: any;
    implementsOnChanges: boolean;
    scheduledChangeDetectionFn: any;
    scheduledDestroyFn: any;
    initialInputValues: Map<any, any>;
    uninitializedInputs: Set<any>;
    componentRef: any;
    events: any;
  /**
   * @param {?} componentFactory
   * @param {?} injector
   */
  constructor(componentFactory, injector) {
    this.componentFactory = componentFactory;
    this.injector = injector;
    /**
     * Changes that have been made to the component ref since the last time onChanges was called.
     */
    this.inputChanges = null;
    /**
     * Whether the created component implements the onChanges function.
     */
    this.implementsOnChanges = false;
    /**
     * Whether a change detection has been scheduled to run on the component.
     */
    this.scheduledChangeDetectionFn = null;
    /**
     * Callback function that when called will cancel a scheduled destruction on the component.
     */
    this.scheduledDestroyFn = null;
    /**
     * Initial input values that were set before the component was created.
     */
    this.initialInputValues = new Map();
    /**
     * Set of inputs that were not initially set when the component was created.
     */
    this.uninitializedInputs = new Set();
  }
  /**
   * Initializes a new component if one has not yet been created and cancels any scheduled
   * destruction.
   * @param {?} element
   * @return {?}
   */
  connect(element) {
    // If the element is marked to be destroyed, cancel the task since the component was reconnected
    if (this.scheduledDestroyFn !== null) {
      this.scheduledDestroyFn();
      this.scheduledDestroyFn = null;
      return;
    }
    if (!this.componentRef) {
      this.initializeComponent(element);
    }
  }
  /**
   * Schedules the component to be destroyed after some small delay in case the element is just
   * being moved across the DOM.
   * @return {?}
   */
  disconnect() {
    // Return if there is no componentRef or the component is already scheduled for destruction
    if (!this.componentRef || this.scheduledDestroyFn !== null) {
      return;
    }
    // Schedule the component to be destroyed after a small timeout in case it is being
    // moved elsewhere in the DOM
    this.scheduledDestroyFn = scheduler.schedule(() => {
      if (this.componentRef) {
        /** @type {?} */ (this.componentRef).destroy();
        this.componentRef = null;
      }
    }, DESTROY_DELAY);
  }
  /**
   * Returns the component property value. If the component has not yet been created, the value is
   * retrieved from the cached initialization values.
   * @param {?} property
   * @return {?}
   */
  getInputValue(property) {
    if (!this.componentRef) {
      return this.initialInputValues.get(property);
    }
    return /** @type {?} */ (this.componentRef.instance)[property];
  }
  /**
   * Sets the input value for the property. If the component has not yet been created, the value is
   * cached and set when the component is created.
   * @param {?} property
   * @param {?} value
   * @return {?}
   */
  setInputValue(property, value) {
    if (strictEquals(value, this.getInputValue(property))) {
      return;
    }
    if (!this.componentRef) {
      this.initialInputValues.set(property, value);
      return;
    }
    this.recordInputChange(property, value);
    /** @type {?} */ (this.componentRef.instance)[property] = value;
    this.scheduleDetectChanges();
  }
  /**
   * Creates a new component through the component factory with the provided element host and
   * sets up its initial inputs, listens for outputs changes, and runs an initial change detection.
   * @param {?} element
   * @return {?}
   */
  initializeComponent(element) {
    /** @type {?} */
    const childInjector = Injector.create({
      providers: [],
      parent: this.injector
    });
    /** @type {?} */
    const projectableNodes = extractProjectableNodes(
      element,
      this.componentFactory.ngContentSelectors
    );
    this.componentRef = this.componentFactory.create(
      childInjector,
      projectableNodes,
      element
    );
    this.implementsOnChanges = isFunction(
      /** @type {?} */ (this.componentRef.instance).ngOnChanges
    );
    this.initializeInputs();
    this.initializeOutputs();
    this.detectChanges();
    /** @type {?} */
    const applicationRef = this.injector.get(ApplicationRef);
    applicationRef.attachView(this.componentRef.hostView);
  }
  /**
   * Set any stored initial inputs on the component's properties.
   * @return {?}
   */
  initializeInputs() {
    this.componentFactory.inputs.forEach(({ propName }) => {
      /** @type {?} */
      const initialValue = this.initialInputValues.get(propName);
      if (initialValue) {
        this.setInputValue(propName, initialValue);
      } else {
        // Keep track of inputs that were not initialized in case we need to know this for
        // calling ngOnChanges with SimpleChanges
        this.uninitializedInputs.add(propName);
      }
    });
    this.initialInputValues.clear();
  }
  /**
   * Sets up listeners for the component's outputs so that the events stream emits the events.
   * @return {?}
   */
  initializeOutputs() {
    /** @type {?} */
    const eventEmitters = this.componentFactory.outputs.map(
      ({ propName, templateName }) => {
        /** @type {?} */
        const emitter = /** @type {?} */ (/** @type {?} */ (this.componentRef
          .instance)[propName]);
        return emitter.pipe(map(value => ({ name: templateName, value })));
      }
    );
    this.events = merge(...eventEmitters);
  }
  /**
   * Calls ngOnChanges with all the inputs that have changed since the last call.
   * @return {?}
   */
  callNgOnChanges() {
    if (!this.implementsOnChanges || this.inputChanges === null) {
      return;
    }
    /** @type {?} */
    const inputChanges = this.inputChanges;
    this.inputChanges = null;
    this.componentRef/** @type {?} */ .instance
      .ngOnChanges(inputChanges);
  }
  /**
   * Schedules change detection to run on the component.
   * Ignores subsequent calls if already scheduled.
   * @return {?}
   */
  scheduleDetectChanges() {
    if (this.scheduledChangeDetectionFn) {
      return;
    }
    this.scheduledChangeDetectionFn = scheduler.scheduleBeforeRender(() => {
      this.scheduledChangeDetectionFn = null;
      this.detectChanges();
    });
  }
  /**
   * Records input changes so that the component receives SimpleChanges in its onChanges function.
   * @param {?} property
   * @param {?} currentValue
   * @return {?}
   */
  recordInputChange(property, currentValue) {
    // Do not record the change if the component does not implement `OnChanges`.
    if (this.componentRef && !this.implementsOnChanges) {
      return;
    }
    if (this.inputChanges === null) {
      this.inputChanges = {};
    }
    /** @type {?} */
    const pendingChange = this.inputChanges[property];
    if (pendingChange) {
      pendingChange.currentValue = currentValue;
      return;
    }
    /** @type {?} */
    const isFirstChange = this.uninitializedInputs.has(property);
    this.uninitializedInputs.delete(property);
    /** @type {?} */
    const previousValue = isFirstChange
      ? undefined
      : this.getInputValue(property);
    this.inputChanges[property] = new SimpleChange(
      previousValue,
      currentValue,
      isFirstChange
    );
  }
  /**
   * Runs change detection on the component.
   * @return {?}
   */
  detectChanges() {
    if (!this.componentRef) {
      return;
    }
    this.callNgOnChanges(); /** @type {?} */
    this.componentRef.changeDetectorRef.detectChanges();
  }
}
