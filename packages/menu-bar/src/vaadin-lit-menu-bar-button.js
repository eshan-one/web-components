/**
 * @license
 * Copyright (c) 2019 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Button } from '@vaadin/button/src/vaadin-lit-button.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { css } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * An element used internally by `<vaadin-menu-bar>`. Not intended to be used separately.
 *
 * @customElement
 * @extends Button
 * @private
 */
class MenuBarButton extends Button {
  static get is() {
    return 'vaadin-menu-bar-button';
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          flex-shrink: 0;
        }

        :host([slot='overflow']) {
          margin-inline-end: 0;
        }

        [part='label'] ::slotted(vaadin-menu-bar-item) {
          position: relative;
          z-index: 1;
        }
      `,
    ];
  }
}

defineCustomElement(MenuBarButton);
