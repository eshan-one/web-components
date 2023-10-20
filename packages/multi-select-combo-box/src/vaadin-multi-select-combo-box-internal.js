/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-multi-select-combo-box-item.js';
import './vaadin-multi-select-combo-box-overlay.js';
import './vaadin-multi-select-combo-box-scroller.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ComboBoxDataProviderMixin } from '@vaadin/combo-box/src/vaadin-combo-box-data-provider-mixin.js';
import { ComboBoxMixin } from '@vaadin/combo-box/src/vaadin-combo-box-mixin.js';
import { ComboBoxPlaceholder } from '@vaadin/combo-box/src/vaadin-combo-box-placeholder.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * An element used internally by `<vaadin-multi-select-combo-box>`. Not intended to be used separately.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ComboBoxDataProviderMixin
 * @mixes ComboBoxMixin
 * @mixes ThemableMixin
 * @private
 */
class MultiSelectComboBoxInternal extends ComboBoxDataProviderMixin(ComboBoxMixin(ThemableMixin(PolymerElement))) {
  static get is() {
    return 'vaadin-multi-select-combo-box-internal';
  }

  static get template() {
    return html`
      <style>
        :host([opened]) {
          pointer-events: auto;
        }
      </style>

      <slot></slot>

      <vaadin-multi-select-combo-box-overlay
        id="overlay"
        opened="[[_overlayOpened]]"
        loading$="[[loading]]"
        theme$="[[_theme]]"
        position-target="[[_target]]"
        no-vertical-overlap
        restore-focus-node="[[inputElement]]"
      ></vaadin-multi-select-combo-box-overlay>
    `;
  }

  static get properties() {
    return {
      /**
       * A subset of items, filtered based on the user input.
       */
      filteredItems: {
        type: Array,
        notify: true,
      },

      /**
       * When set to `true`, "loading" attribute is set
       * on the host and the overlay element.
       * @type {boolean}
       */
      loading: {
        type: Boolean,
        notify: true,
      },

      /**
       * Total number of items.
       * @type {number | undefined}
       */
      size: {
        type: Number,
        notify: true,
      },

      /**
       * Selected items to render in the dropdown
       * when the component is read-only.
       */
      selectedItems: {
        type: Array,
        value: () => [],
      },

      /**
       * Set to true to group selected items at the top of the overlay.
       * @attr {boolean} selected-items-on-top
       */
      selectedItemsOnTop: {
        type: Boolean,
        value: false,
      },

      /**
       * Last input value entered by the user before value is updated.
       * Used to store `filter` property value before clearing it.
       */
      lastFilter: {
        type: String,
        notify: true,
      },

      /**
       * A subset of items to be shown at the top of the overlay.
       */
      topGroup: {
        type: Array,
        observer: '_topGroupChanged',
      },

      _target: {
        type: Object,
      },
    };
  }

  static get observers() {
    return ['_readonlyChanged(readonly)'];
  }

  /**
   * Reference to the clear button element.
   * @protected
   * @return {!HTMLElement}
   */
  get clearElement() {
    return this.querySelector('[part="clear-button"]');
  }

  /**
   * Tag name prefix used by scroller and items.
   * @protected
   * @return {string}
   */
  get _tagNamePrefix() {
    return 'vaadin-multi-select-combo-box';
  }

  /**
   * Override method inherited from the combo-box
   * to allow opening dropdown when readonly.
   * @override
   */
  open() {
    if (!this.disabled && !(this.readonly && this.selectedItems.length === 0)) {
      this.opened = true;
    }
  }

  /** @protected */
  ready() {
    super.ready();

    this._target = this;
    this._toggleElement = this.querySelector('.toggle-button');
  }

  /** @private */
  _readonlyChanged() {
    this._setDropdownItems(this.filteredItems);
  }

  /**
   * Override combo-box method to group selected
   * items at the top of the overlay.
   *
   * @protected
   * @override
   */
  _setDropdownItems(items) {
    if (this.readonly) {
      super._setDropdownItems(this.selectedItems);
      return;
    }

    if (this.filter || !this.selectedItemsOnTop) {
      super._setDropdownItems(items);
      return;
    }

    if (items && items.length && this.topGroup && this.topGroup.length) {
      // Filter out items included to the top group.
      const filteredItems = items.filter(
        (item) => this._comboBox._findIndex(item, this.topGroup, this.itemIdPath) === -1,
      );

      super._setDropdownItems(this.topGroup.concat(filteredItems));
      return;
    }

    super._setDropdownItems(items);
  }

  /** @private */
  _topGroupChanged(topGroup) {
    if (topGroup) {
      this._setDropdownItems(this.filteredItems);
    }
  }

  /**
   * Override combo-box method to set correct owner for using by item renderers.
   * This needs to be done before the scroller gets added to the DOM to ensure
   * Lit directive works in case when combo-box is opened using attribute.
   *
   * @protected
   * @override
   */
  _initScroller() {
    const comboBox = this.getRootNode().host;

    this._comboBox = comboBox;

    super._initScroller(comboBox);
  }

  /**
   * Override Enter handler to keep overlay open
   * when item is selected or unselected.
   * @param {!Event} event
   * @protected
   * @override
   */
  _onEnter(event) {
    if (this.opened) {
      // Do not submit the surrounding form.
      event.preventDefault();
      // Do not trigger global listeners.
      event.stopPropagation();

      if (this.readonly) {
        this.close();
      } else {
        // Keep selected item focused after committing on Enter.
        const focusedItem = this._dropdownItems[this._focusedIndex];
        this._commitValue();
        this._focusedIndex = this._dropdownItems.indexOf(focusedItem);
      }

      return;
    }

    super._onEnter(event);
  }

  /**
   * Override Escape handler to not clear
   * selected items when readonly.
   * @param {!Event} event
   * @protected
   * @override
   */
  _onEscape(event) {
    if (this.readonly) {
      event.stopPropagation();
      if (this.opened) {
        this.close();
      }
      return;
    }

    super._onEscape(event);
  }

  /**
   * @protected
   * @override
   */
  _commitValue() {
    // Store filter value for checking if user input is matching
    // an item which is already selected, to not un-select it.
    this.lastFilter = this.filter;

    super._commitValue();
  }

  /**
   * Override method inherited from the combo-box
   * to not update focused item when readonly.
   * @protected
   * @override
   */
  _onArrowDown() {
    if (!this.readonly) {
      super._onArrowDown();
    } else if (!this.opened) {
      this.open();
    }
  }

  /**
   * Override method inherited from the combo-box
   * to not update focused item when readonly.
   * @protected
   * @override
   */
  _onArrowUp() {
    if (!this.readonly) {
      super._onArrowUp();
    } else if (!this.opened) {
      this.open();
    }
  }

  /**
   * Override method inherited from the combo-box
   * to close dropdown on blur when readonly.
   * @param {boolean} focused
   * @protected
   * @override
   */
  _setFocused(focused) {
    // Disable combo-box logic that updates selectedItem
    // based on the overlay focused index on input blur
    if (!focused) {
      this._ignoreCommitValue = true;
    }

    super._setFocused(focused);

    if (!focused && this.readonly && !this._closeOnBlurIsPrevented) {
      this.close();
    }
  }

  /**
   * Override method inherited from the combo-box
   * to not commit an already selected item again
   * on blur, which would result in un-selecting.
   * @protected
   * @override
   */
  _detectAndDispatchChange() {
    if (this._ignoreCommitValue) {
      this._ignoreCommitValue = false;

      // Reset internal combo-box state
      this.selectedItem = null;
      this._inputElementValue = '';
      return;
    }

    super._detectAndDispatchChange();
  }

  /**
   * @param {CustomEvent} event
   * @protected
   * @override
   */
  _overlaySelectedItemChanged(event) {
    event.stopPropagation();

    // Do not un-select on click when readonly
    if (this.readonly) {
      return;
    }

    if (event.detail.item instanceof ComboBoxPlaceholder) {
      return;
    }

    if (this.opened) {
      this.dispatchEvent(
        new CustomEvent('combo-box-item-selected', {
          detail: {
            item: event.detail.item,
          },
        }),
      );
    }
  }

  /**
   * Override method inherited from the combo-box
   * to not request data provider when read-only.
   *
   * @param {number}
   * @return {boolean}
   * @protected
   * @override
   */
  _shouldFetchData() {
    if (this.readonly) {
      return false;
    }

    return super._shouldFetchData();
  }

  /**
   * Override method inherited from the combo-box
   * to not clear the data provider cache when read-only.
   *
   * @protected
   * @override
   */
  clearCache() {
    if (this.readonly) {
      return;
    }

    super.clearCache();
  }
}

defineCustomElement(MultiSelectComboBoxInternal);
