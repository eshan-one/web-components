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

/**
 * Helper that provides a set of functions for RTL.
 */
declare class DirHelper {
  /**
   * Get the scroll type in the current browser view.
   *
   * @returns the scroll type. Possible values are `default|reverse|negative`
   */
  static detectScrollType(): string;

  /**
   * Get the scrollLeft value of the element relative to the direction
   *
   * @param scrollType type of the scroll detected with `detectScrollType`
   * @param direction current direction of the element
   * @returns the scrollLeft value.
   */
  static getNormalizedScrollLeft(scrollType: string, direction: string, element: Element | null): number;

  /**
   * Set the scrollLeft value of the element relative to the direction
   *
   * @param scrollType type of the scroll detected with `detectScrollType`
   * @param direction current direction of the element
   * @param scrollLeft the scrollLeft value to be set
   */
  static setNormalizedScrollLeft(
    scrollType: string,
    direction: string,
    element: Element | null,
    scrollLeft: number,
  ): void;
}

export { DirHelper };
