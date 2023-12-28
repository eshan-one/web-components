import { expect } from '@esm-bundle/chai';
import {
  aTimeout,
  click,
  fire,
  fixtureSync,
  focusout,
  isIOS,
  nextRender,
  nextUpdate,
  outsideClick,
  tap,
  touchstart,
} from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';
import { getFirstItem, setInputValue } from './helpers.js';

describe('toggling dropdown', () => {
  let comboBox, overlay, input;

  beforeEach(async () => {
    comboBox = fixtureSync('<vaadin-combo-box label="Label" items="[1, 2]"></vaadin-combo-box>');
    await nextRender();
    input = comboBox.inputElement;
    overlay = comboBox.$.overlay;
  });

  describe('opening', () => {
    it('should open synchronously by clicking label', () => {
      expect(comboBox.opened).to.be.false;
      tap(comboBox.querySelector('[slot="label"]'));
      expect(comboBox.opened).to.be.true;
      expect(overlay.opened).to.be.true;
    });

    it('should not open synchronously by clicking label when autoOpenDisabled is true', () => {
      comboBox.autoOpenDisabled = true;
      expect(comboBox.opened).to.be.false;
      tap(comboBox.querySelector('[slot="label"]'));
      expect(comboBox.opened).to.be.false;
      expect(overlay.opened).to.be.false;
    });

    it('should restore attribute focus-ring if it was initially set before opening and combo-box is focused', async () => {
      comboBox.setAttribute('focus-ring', '');
      comboBox.opened = true;
      await nextUpdate(comboBox);
      comboBox.opened = false;
      expect(comboBox.hasAttribute('focus-ring')).to.be.true;
    });

    it('should open synchronously by clicking input', () => {
      expect(comboBox.opened).to.be.false;
      tap(input);
      expect(comboBox.opened).to.be.true;
      expect(overlay.opened).to.be.true;
    });

    it('should not open synchronously by clicking input when autoOpenDisabled is true', () => {
      comboBox.autoOpenDisabled = true;
      expect(comboBox.opened).to.be.false;
      tap(input);
      expect(comboBox.opened).to.be.false;
      expect(overlay.opened).to.be.false;
    });

    it('should open by clicking icon', () => {
      tap(comboBox._toggleElement);

      expect(comboBox.opened).to.be.true;
      expect(overlay.opened).to.be.true;
    });

    it('should open by clicking icon when autoOpenDisabled is true and input is invalid', async () => {
      comboBox.autoOpenDisabled = true;
      setInputValue(comboBox, 3);
      await nextUpdate(comboBox);

      tap(comboBox._toggleElement);

      expect(comboBox.opened).to.be.true;
    });

    it('should not open the overlay on helper click', async () => {
      comboBox.helperText = 'Helper Text';
      await nextUpdate(comboBox);
      comboBox.querySelector('[slot=helper]').click();
      expect(comboBox.opened).to.be.false;
    });

    it('should not open the overlay on error message click', async () => {
      comboBox.invalid = true;
      comboBox.errorMessage = 'Error message';
      await nextUpdate(comboBox);
      comboBox.querySelector('[slot=error-message]').click();
      expect(comboBox.opened).to.be.false;
    });

    it('should prevent default for the handled toggle-button click', () => {
      const event = click(comboBox._toggleElement);
      expect(event.defaultPrevented).to.be.true;
    });

    it('should prevent default for the handled label element click', () => {
      const event = click(comboBox.querySelector('[slot="label"]'));
      expect(event.defaultPrevented).to.be.true;
    });

    it('should not prevent default for click when autoOpenDisabled', () => {
      comboBox.autoOpenDisabled = true;
      const event = click(comboBox.querySelector('[slot="label"]'));
      expect(event.defaultPrevented).to.be.false;
    });

    it('should open on function call', () => {
      comboBox.open();

      expect(comboBox.opened).to.be.true;
      expect(overlay.opened).to.be.true;
    });

    it('should set body `pointer-events: none` on open and restore initial value on close', async () => {
      document.body.style.pointerEvents = 'painted';
      comboBox.open();
      await nextUpdate(comboBox);

      expect(getComputedStyle(document.body).pointerEvents).to.be.equal('none');
      expect(getComputedStyle(comboBox).pointerEvents).to.be.equal('auto');

      // The actual overlay part of the overlay moved to body should dispatch pointer events
      expect(getComputedStyle(overlay.$.overlay).pointerEvents).to.be.equal('auto');

      comboBox.close();
      await nextUpdate(comboBox);
      expect(getComputedStyle(document.body).pointerEvents).to.be.equal('painted');
    });

    it('should not close an open popup', () => {
      comboBox.open();

      comboBox.open();

      expect(comboBox.opened).to.be.true;
    });

    it('should not open overlay when setting items to null', () => {
      comboBox.items = null;

      comboBox.open();

      expect(comboBox.opened).to.be.true;
      expect(overlay.opened).to.be.false;
    });

    it('should not open overlay when setting empty items array', () => {
      comboBox.items = [];

      comboBox.open();

      expect(comboBox.opened).to.be.true;
      expect(overlay.opened).to.be.false;
    });

    it('should not open overlay when setting empty filteredItems array', () => {
      comboBox.filteredItems = [];

      comboBox.open();

      expect(comboBox.opened).to.be.true;
      expect(overlay.opened).to.be.false;
    });

    it('should not open overlay when disabled', () => {
      comboBox.disabled = true;
      comboBox.open();
      expect(comboBox.opened).to.be.false;
      expect(overlay.opened).to.be.false;
    });

    it('should not open overlay when readonly', () => {
      comboBox.readonly = true;
      comboBox.open();
      expect(comboBox.opened).to.be.false;
      expect(overlay.opened).to.be.false;
    });

    (isIOS ? describe : describe.skip)('after opening', () => {
      beforeEach(() => {
        comboBox.open();
      });

      it('should not set focused attribute on dropdown open', () => {
        expect(comboBox.hasAttribute('focused')).to.be.false;
      });

      it('should not refocus the input field when closed from icon', () => {
        tap(comboBox._toggleElement);
        expect(comboBox.hasAttribute('focused')).to.be.false;
      });

      it('should focus input on dropdown open after a timeout', async () => {
        await aTimeout(1);
        expect(comboBox.hasAttribute('focused')).to.be.true;
      });

      it('should refocus the input field when closed from icon', async () => {
        tap(comboBox._toggleElement);
        await aTimeout(1);
        expect(comboBox.hasAttribute('focused')).to.be.true;
      });

      it('should prevent default on overlay mousedown', () => {
        const event = fire(overlay, 'mousedown');
        expect(event.defaultPrevented).to.be.true;
      });
    });
  });

  describe('closing', () => {
    it('should close overlay on outside click', async () => {
      comboBox.open();
      await nextRender();

      outsideClick();

      expect(comboBox.opened).to.be.false;
      expect(overlay.opened).to.be.false;
    });

    it('should not close when clicking on the overlay', async () => {
      comboBox.open();
      await nextRender();

      click(overlay);

      expect(comboBox.opened).to.be.true;
    });

    it('should not close popup when clicking on any overlay children', async () => {
      comboBox.open();
      await nextRender();

      comboBox._scroller.click();

      expect(comboBox.opened).to.be.true;
    });

    it('should close on clicking icon', async () => {
      comboBox.open();
      await nextRender();

      tap(comboBox._toggleElement);

      expect(comboBox.opened).to.be.false;
    });

    it('should close the overlay when focus is lost', async () => {
      comboBox.open();
      await nextRender();

      focusout(input);

      expect(comboBox.opened).to.be.false;
    });

    it('should not close the overlay when focus is moved to item', async () => {
      comboBox.open();
      await nextRender();

      const item = getFirstItem(comboBox);
      focusout(input, item);

      expect(comboBox.opened).to.be.true;
    });

    it('should restore focus to the field on outside click', async () => {
      comboBox.focus();
      comboBox.open();
      outsideClick();
      await aTimeout(0);
      expect(document.activeElement).to.equal(input);
    });

    it('should focus the field on outside click', async () => {
      expect(document.activeElement).to.equal(document.body);
      comboBox.open();
      await nextRender();
      outsideClick();
      await aTimeout(0);
      expect(document.activeElement).to.equal(input);
    });

    describe('virtual keyboard', () => {
      it('should disable virtual keyboard on close', async () => {
        comboBox.open();
        await nextRender();
        comboBox.close();
        await nextUpdate(comboBox);
        expect(input.inputMode).to.equal('none');
      });

      it('should re-enable virtual keyboard on touchstart', async () => {
        comboBox.open();
        await nextRender();
        comboBox.close();
        await nextUpdate(comboBox);
        touchstart(comboBox);
        expect(input.inputMode).to.equal('');
      });

      it('should re-enable virtual keyboard on blur', async () => {
        comboBox.open();
        await nextRender();
        comboBox.close();
        await aTimeout(0);
        await sendKeys({ press: 'Tab' });
        expect(input.inputMode).to.equal('');
      });
    });

    describe('filtered items are empty', () => {
      it('should close the dropdown on non-existent values', async () => {
        comboBox.open();
        await nextRender();

        // Existent value
        setInputValue(comboBox, '1');
        await nextUpdate(comboBox);
        expect(overlay.opened).to.be.true;
        expect(comboBox.opened).to.be.true;

        // Non-existent value
        setInputValue(comboBox, '3');
        await nextUpdate(comboBox);
        expect(overlay.opened).to.be.false;
        expect(comboBox.opened).to.be.true;
      });

      it('should not commit value the input on dropdown closing', async () => {
        comboBox.open();
        await nextRender();

        setInputValue(comboBox, '3');
        await nextUpdate(comboBox);
        expect(input.value).to.equal('3');
        expect(comboBox.value).to.be.empty;

        focusout(input);
        expect(input.value).to.be.empty;
      });
    });
  });

  (isIOS ? describe : describe.skip)('external focus (initially)', () => {
    let input, blurSpy;

    beforeEach(() => {
      input = document.createElement('input');
      comboBox.insertAdjacentElement('beforebegin', input);
      input.focus();
      blurSpy = sinon.spy(input, 'blur');
    });

    it('should blur previously focused element when clicking on toggle button', () => {
      tap(comboBox._toggleElement);
      expect(blurSpy.calledOnce).to.be.true;
    });
  });
});
