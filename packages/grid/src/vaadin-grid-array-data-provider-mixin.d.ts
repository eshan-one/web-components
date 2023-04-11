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

export declare function ArrayDataProviderMixin<TItem, T extends Constructor<HTMLElement>>(
  base: T,
): T & Constructor<ArrayDataProviderMixinClass<TItem>>;

export declare class ArrayDataProviderMixinClass<TItem> {
  /**
   * An array containing the items which will be passed to renderer functions.
   */
  items: TItem[] | null | undefined;
}
