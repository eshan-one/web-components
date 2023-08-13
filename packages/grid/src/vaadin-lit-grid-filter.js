/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { GridFilterElementMixin } from './vaadin-grid-filter-element-mixin.js';

/**
 * LitElement based version of `<vaadin-grid-filter>` web component.
 *
 * ## Disclaimer
 *
 * This component is an experiment not intended for publishing to npm.
 * There is no ETA regarding specific Vaadin version where it'll land.
 * Feel free to try this code in your apps as per Apache 2.0 license.
 */
class GridFilter extends GridFilterElementMixin(PolylitMixin(LitElement)) {
  static get is() {
    return 'vaadin-grid-filter';
  }

  render() {
    return html`<slot></slot>`;
  }
}

customElements.define(GridFilter.is, GridFilter);

export { GridFilter };
