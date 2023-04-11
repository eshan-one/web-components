/**
 * @license
 * Copyright (c) 2000 - 2023 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import { Constructor } from '@open-wc/dedupe-mixin';

/**
 * A mixin that manages keyboard handling.
 * The mixin subscribes to the keyboard events while an actual implementation
 * for the event handlers is left to the client (a component or another mixin).
 */
export declare function KeyboardMixin<T extends Constructor<HTMLElement>>(base: T): T & Constructor<KeyboardMixinClass>;

export declare class KeyboardMixinClass {
  /**
   * A handler for the `keydown` event. By default, it does nothing.
   * Override the method to implement your own behavior.
   */
  protected _onKeyDown(event: KeyboardEvent): void;

  /**
   * A handler for the `keyup` event. By default, it does nothing.
   * Override the method to implement your own behavior.
   */
  protected _onKeyUp(event: KeyboardEvent): void;
}
