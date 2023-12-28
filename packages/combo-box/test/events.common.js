import { expect } from '@esm-bundle/chai';
import { fixtureSync, focusout, nextRender, nextUpdate, outsideClick } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { clickItem, setInputValue } from './helpers.js';

describe('events', () => {
  let comboBox;

  describe('custom-value-set event', () => {
    beforeEach(async () => {
      comboBox = fixtureSync('<vaadin-combo-box></vaadin-combo-box>');
      comboBox.allowCustomValue = true;
      comboBox.items = ['a', 'b'];
      await nextRender();
      comboBox.inputElement.focus();
    });

    it('should be fired when custom value is set', async () => {
      const spy = sinon.spy();
      comboBox.addEventListener('custom-value-set', spy);

      comboBox.open();
      await nextRender();

      setInputValue(comboBox, 'foo');
      await nextUpdate(comboBox);

      outsideClick();
      await nextUpdate(comboBox);

      expect(spy.callCount).to.eql(1);
    });

    it('should not be fired when custom values are not allowed', async () => {
      comboBox.allowCustomValue = false;

      const spy = sinon.spy();
      comboBox.addEventListener('custom-value-set', spy);

      comboBox.open();
      await nextRender();

      setInputValue(comboBox, 'foo');
      await nextUpdate(comboBox);

      outsideClick();
      await nextUpdate(comboBox);

      expect(spy.callCount).to.eql(0);
    });

    it('should not be fired when combo-box is read-only', async () => {
      const spy = sinon.spy();
      comboBox.addEventListener('custom-value-set', spy);

      comboBox.readonly = true;
      setInputValue(comboBox, 'foo');
      await nextUpdate(comboBox);
      comboBox.focus();
      focusout(comboBox);

      expect(spy.called).to.be.false;
    });

    it('should be cancelable', async () => {
      comboBox.addEventListener('custom-value-set', (e) => e.preventDefault());

      comboBox.open();
      await nextRender();

      setInputValue(comboBox, 'foo');
      await nextUpdate(comboBox);

      outsideClick();
      await nextUpdate(comboBox);

      expect(comboBox.value).to.be.empty;
    });

    it('should not be fired when clicking an item', async () => {
      const spy = sinon.spy();
      comboBox.addEventListener('custom-value-set', spy);

      comboBox.open();
      await nextRender();

      setInputValue(comboBox, 'a');
      await nextUpdate(comboBox);

      clickItem(comboBox, 0);
      await nextUpdate(comboBox);

      expect(spy.called).to.be.false;
    });

    it('should not be fired when existing item is entered and overlay is closed', async () => {
      const spy = sinon.spy();
      comboBox.addEventListener('custom-value-set', spy);

      comboBox.open();
      await nextRender();

      setInputValue(comboBox, 'a');
      await nextUpdate(comboBox);

      outsideClick();
      await nextUpdate(comboBox);

      expect(spy.called).to.be.false;
    });

    it('should not be fired when the custom value equals the label of the selected item', async () => {
      const spy = sinon.spy();
      comboBox.addEventListener('custom-value-set', spy);
      comboBox.selectedItem = {
        label: 'foo',
        value: 'bar',
      };

      comboBox.open();
      await nextRender();
      setInputValue(comboBox, 'foo');

      await nextUpdate(comboBox);

      outsideClick();
      await nextUpdate(comboBox);

      expect(spy.called).to.be.false;
    });

    it('should be fired when the custom value equals the value of the selected item', async () => {
      const spy = sinon.spy();
      comboBox.addEventListener('custom-value-set', spy);
      comboBox.selectedItem = {
        label: 'foo',
        value: 'bar',
      };

      comboBox.open();
      await nextRender();

      setInputValue(comboBox, 'bar');
      await nextUpdate(comboBox);

      outsideClick();
      await nextUpdate(comboBox);

      expect(spy.calledOnce).to.be.true;
    });

    it('should not be fired twice when the custom value set listener causes blur', async () => {
      const spy = sinon.spy();
      comboBox.addEventListener('custom-value-set', spy);

      // Emulate opening the overlay that causes blur
      comboBox.addEventListener('custom-value-set', () => {
        comboBox.blur();
      });

      comboBox.open();
      await nextRender();

      setInputValue(comboBox, 'foo');
      await nextUpdate(comboBox);

      outsideClick();
      await nextUpdate(comboBox);

      expect(spy.calledOnce).to.be.true;
    });

    it('should be fired twice when another custom value is committed by the user', async () => {
      const spy = sinon.spy();
      comboBox.addEventListener('custom-value-set', spy);

      comboBox.open();
      await nextRender();

      setInputValue(comboBox, 'foo');
      await nextUpdate(comboBox);

      outsideClick();
      await nextUpdate(comboBox);

      comboBox.inputElement.focus();

      setInputValue(comboBox, 'bar');
      await nextUpdate(comboBox);

      outsideClick();
      await nextUpdate(comboBox);

      focusout(comboBox.inputElement);

      expect(spy.calledTwice).to.be.true;
    });
  });
});
