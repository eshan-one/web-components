import { expect } from '@esm-bundle/chai';
import { fixtureSync, focusout, isIOS, nextRender, nextUpdate } from '@vaadin/testing-helpers';

describe('scrolling', () => {
  let comboBox, overlay, scroller, input;

  beforeEach(async () => {
    comboBox = fixtureSync('<vaadin-combo-box></vaadin-combo-box>');
    await nextRender();
    overlay = comboBox.$.overlay;
    input = comboBox.inputElement;
    scroller = comboBox._scroller;
  });

  afterEach(() => {
    comboBox.close();
  });

  (isIOS ? describe : describe.skip)('iOS', () => {
    it('should have momentum scrolling enabled', () => {
      comboBox.open();

      expect(getComputedStyle(scroller).WebkitOverflowScrolling).to.equal('touch');
    });
  });

  describe('scrolling position', () => {
    beforeEach(() => {
      const items = [];

      for (let i = 0; i < 100; i++) {
        items.push(i.toString());
      }

      comboBox.items = items;
    });

    it('should be zero when no items are selected', async () => {
      comboBox.open();
      await nextRender();
      expect(scroller.scrollTop).to.equal(0);
    });

    it('should be zero when the first item is selected', async () => {
      comboBox.value = comboBox.items[0];
      comboBox.open();
      await nextRender();
      expect(scroller.scrollTop).to.equal(0);
    });

    it('should not close the items when touching scroll bar', async () => {
      comboBox.open();
      await nextRender();
      focusout(input, overlay);
      expect(comboBox.opened).to.be.true;
    });

    it('should keep the focused attribute while scrolling', async () => {
      comboBox.open();
      await nextRender();
      focusout(input, overlay);
      expect(comboBox.hasAttribute('focused')).to.be.true;
    });
  });
});
