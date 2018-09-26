/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
export const elProto: any = /** @type {?} */ (Element.prototype);
/** @type {?} */
export const matches = elProto.matches || elProto.matchesSelector || elProto.mozMatchesSelector ||
    elProto.msMatchesSelector || elProto.oMatchesSelector || elProto.webkitMatchesSelector;

/** *
 * Provide methods for scheduling the execution of a callback.
 @type {?} */
export const scheduler = {
  /**
   * Schedule a callback to be called after some delay.
   *
   * Returns a function that when executed will cancel the scheduled function.
   * @param {?} taskFn
   * @param {?} delay
   * @return {?}
   */
  schedule(taskFn, delay) {
    /** @type {?} */
    const id = setTimeout(taskFn, delay);
    return () => clearTimeout(id);
  },
  /**
   * Schedule a callback to be called before the next render.
   * (If `window.requestAnimationFrame()` is not available, use `scheduler.schedule()` instead.)
   *
   * Returns a function that when executed will cancel the scheduled function.
   * @param {?} taskFn
   * @return {?}
   */
  scheduleBeforeRender(taskFn) {
    // TODO(gkalpak): Implement a better way of accessing `requestAnimationFrame()`
    //                (e.g. accounting for vendor prefix, SSR-compatibility, etc).
    if (typeof window === "undefined") {
      // For SSR just schedule immediately.
      return scheduler.schedule(taskFn, 0);
    }
    if (typeof window.requestAnimationFrame === "undefined") {
      /** @type {?} */
      const frameMs = 16;
      return scheduler.schedule(taskFn, frameMs);
    }
    /** @type {?} */
    const id = window.requestAnimationFrame(taskFn);
    return () => window.cancelAnimationFrame(id);
  }
};

/**
 * Test two values for strict equality, accounting for the fact that `NaN !== NaN`.
 * @param {?} value1
 * @param {?} value2
 * @return {?}
 */
export function strictEquals(value1, value2) {
  return value1 === value2 || (value1 !== value1 && value2 !== value2);
}

/**
 * Check whether the input is an `Element`.
 * @param {?} node
 * @return {?}
 */
export function isElement(node) {
  return node.nodeType === Node.ELEMENT_NODE;
}

/**
 * Check whether an `Element` matches a CSS selector.
 * @param {?} element
 * @param {?} selector
 * @return {?}
 */
export function matchesSelector(element, selector) {
  return matches.call(element, selector);
}

/**
 * @param {?} node
 * @param {?} selectors
 * @param {?} defaultIndex
 * @return {?}
 */
export function findMatchingIndex(node, selectors, defaultIndex) {
  /** @type {?} */
  let matchingIndex = defaultIndex;
  if (isElement(node)) {
      selectors.some((selector, i) => {
          if ((selector !== '*') && matchesSelector(node, selector)) {
              matchingIndex = i;
              return true;
          }
          return false;
      });
  }
  return matchingIndex;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @param {?} host
 * @param {?} ngContentSelectors
 * @return {?}
 */
export function extractProjectableNodes(host, ngContentSelectors) {
  /** @type {?} */
  const nodes = host.childNodes;
  /** @type {?} */
  const projectableNodes = ngContentSelectors.map(() => []);
  /** @type {?} */
  let wildcardIndex = -1;
  ngContentSelectors.some((selector, i) => {
      if (selector === '*') {
          wildcardIndex = i;
          return true;
      }
      return false;
  });
  for (let i = 0, ii = nodes.length; i < ii; ++i) {
      /** @type {?} */
      const node = nodes[i];
      /** @type {?} */
      const ngContentIndex = findMatchingIndex(node, ngContentSelectors, wildcardIndex);
      if (ngContentIndex !== -1) {
          projectableNodes[ngContentIndex].push(node);
      }
  }
  return projectableNodes;
}

/**
 * Check whether the input is a function.
 * @param {?} value
 * @return {?}
 */
export function isFunction(value) {
  return typeof value === 'function';
}