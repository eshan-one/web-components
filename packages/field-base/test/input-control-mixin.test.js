import { expect } from '@esm-bundle/chai';
import { escKeyDown, fixtureSync, keyboardEventFor, nextFrame, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { InputControlMixin } from '../src/input-control-mixin.js';
import { InputController } from '../src/input-controller.js';
import { define } from './helpers.js';

const runTests = (baseClass) => {
  const tag = define[baseClass](
    'input-control-mixin',
    `
      <div part="label">
        <slot name="label"></slot>
      </div>
      <slot name="input"></slot>
      <button id="clearButton">Clear</button>
      <div part="error-message">
        <slot name="error-message"></slot>
      </div>
      <slot name="helper"></slot>
    `,
    (Base) =>
      class extends InputControlMixin(Base) {
        get clearElement() {
          return this.$.clearButton;
        }

        ready() {
          super.ready();

          this.addController(
            new InputController(this, (input) => {
              this._setInputElement(input);
              this._setFocusElement(input);
              this.stateTarget = input;
              this.ariaTarget = input;
            }),
          );
        }
      },
  );

  let element, input;

  describe('clear button', () => {
    let button;

    beforeEach(async () => {
      element = fixtureSync(`<${tag} value="foo"></${tag}>`);
      await nextRender();
      input = element.querySelector('[slot=input]');
      button = element.$.clearButton;
    });

    it('should clear the field value on clear button click', async () => {
      button.click();
      await nextFrame();
      expect(element.value).to.equal('');
    });

    it('should clear the input value on clear button click', async () => {
      button.click();
      await nextFrame();
      expect(input.value).to.equal('');
    });

    it('should focus the input on clear button click', () => {
      const spy = sinon.spy(input, 'focus');
      button.click();
      expect(spy.calledOnce).to.be.true;
    });

    it('should dispatch input event on clear button click', () => {
      const spy = sinon.spy();
      input.addEventListener('input', spy);
      button.click();
      expect(spy.calledOnce).to.be.true;
      const event = spy.firstCall.args[0];
      expect(event.bubbles).to.be.true;
      expect(event.composed).to.be.true;
    });

    it('should dispatch change event on clear button click', () => {
      const spy = sinon.spy();
      element.addEventListener('change', spy);
      button.click();
      expect(spy.calledOnce).to.be.true;
      const event = spy.firstCall.args[0];
      expect(event.bubbles).to.be.true;
      expect(event.composed).to.be.false;
    });

    it('should call preventDefault on the button click event', () => {
      const event = new CustomEvent('click', { cancelable: true });
      button.dispatchEvent(event);
      expect(event.defaultPrevented).to.be.true;
    });

    it('should reflect clearButtonVisible property to attribute', async () => {
      element.clearButtonVisible = true;
      await nextFrame();
      expect(element.hasAttribute('clear-button-visible')).to.be.true;

      element.clearButtonVisible = false;
      await nextFrame();
      expect(element.hasAttribute('clear-button-visible')).to.be.false;
    });

    it('should clear value on Esc when clearButtonVisible is true', async () => {
      element.clearButtonVisible = true;
      escKeyDown(button);
      await nextFrame();
      expect(input.value).to.equal('');
    });

    it('should not clear value on Esc when clearButtonVisible is false', () => {
      escKeyDown(button);
      expect(input.value).to.equal('foo');
    });

    it('should dispatch input event when clearing value on Esc', () => {
      const spy = sinon.spy();
      input.addEventListener('input', spy);
      element.clearButtonVisible = true;
      escKeyDown(button);
      expect(spy.calledOnce).to.be.true;
      const event = spy.firstCall.args[0];
      expect(event.bubbles).to.be.true;
      expect(event.composed).to.be.true;
    });

    it('should dispatch change event when clearing value on Esc', () => {
      const spy = sinon.spy();
      input.addEventListener('change', spy);
      element.clearButtonVisible = true;
      escKeyDown(button);
      expect(spy.calledOnce).to.be.true;
      const event = spy.firstCall.args[0];
      expect(event.bubbles).to.be.true;
      expect(event.composed).to.be.false;
    });

    it('should call stopPropagation() on Esc when clearButtonVisible is true', () => {
      element.clearButtonVisible = true;
      const event = keyboardEventFor('keydown', 27, [], 'Escape');
      const spy = sinon.spy(event, 'stopPropagation');
      button.dispatchEvent(event);
      expect(spy.called).to.be.true;
    });

    it('should not call stopPropagation() on Esc when clearButtonVisible is false', () => {
      const event = keyboardEventFor('keydown', 27, [], 'Escape');
      const spy = sinon.spy(event, 'stopPropagation');
      button.dispatchEvent(event);
      expect(spy.called).to.be.false;
    });
  });

  describe('name', () => {
    beforeEach(async () => {
      element = fixtureSync(`<${tag} name="foo"></${tag}>`);
      await nextRender();
      input = element.querySelector('[slot=input]');
    });

    it('should propagate name attribute to the input', () => {
      expect(input.getAttribute('name')).to.equal('foo');
    });

    it('should propagate name property to the input', async () => {
      element.name = 'bar';
      await nextFrame();
      expect(input.getAttribute('name')).to.equal('bar');
    });
  });

  describe('title', () => {
    beforeEach(async () => {
      element = fixtureSync(`<${tag} title="foo"></${tag}>`);
      await nextRender();
      input = element.querySelector('[slot=input]');
    });

    it('should propagate title attribute to the input', () => {
      expect(input.getAttribute('title')).to.equal('foo');
    });

    it('should propagate title property to the input', async () => {
      element.title = 'bar';
      await nextFrame();
      expect(input.getAttribute('title')).to.equal('bar');
    });
  });

  describe('placeholder', () => {
    beforeEach(async () => {
      element = fixtureSync(`<${tag} placeholder="foo"></${tag}>`);
      await nextRender();
      input = element.querySelector('[slot=input]');
    });

    it('should propagate placeholder attribute to the input', () => {
      expect(input.placeholder).to.equal('foo');
    });

    it('should propagate placeholder property to the input', async () => {
      element.placeholder = 'bar';
      await nextFrame();
      expect(input.placeholder).to.equal('bar');
    });
  });

  describe('readonly', () => {
    beforeEach(async () => {
      element = fixtureSync(`<${tag} readonly></${tag}>`);
      await nextRender();
      input = element.querySelector('[slot=input]');
    });

    it('should propagate readonly attribute to the input', () => {
      expect(input.readOnly).to.be.true;
    });

    it('should propagate readonly property to the input', async () => {
      element.readonly = false;
      await nextFrame();
      expect(input.readOnly).to.be.false;
    });
  });

  describe('required', () => {
    beforeEach(async () => {
      element = fixtureSync(`<${tag} required></${tag}>`);
      await nextRender();
      input = element.querySelector('[slot=input]');
    });

    it('should propagate required attribute to the input', () => {
      expect(input.required).to.be.true;
    });

    it('should propagate required property to the input', async () => {
      element.required = false;
      await nextFrame();
      expect(input.required).to.be.false;
    });
  });

  describe('invalid', () => {
    beforeEach(async () => {
      element = fixtureSync(`<${tag} invalid></${tag}>`);
      await nextRender();
      input = element.querySelector('[slot=input]');
    });

    it('should not reset invalid state set with attribute', () => {
      expect(element.invalid).to.be.true;
    });

    it('should set invalid attribute on the input', () => {
      expect(input.hasAttribute('invalid')).to.be.true;
    });

    it('should set aria-invalid attribute on the input', () => {
      expect(input.getAttribute('aria-invalid')).to.equal('true');
    });

    it('should remove invalid attribute when valid', async () => {
      element.invalid = false;
      await nextFrame();
      expect(input.hasAttribute('invalid')).to.be.false;
    });

    it('should remove aria-invalid attribute when valid', async () => {
      element.invalid = false;
      await nextFrame();
      expect(input.hasAttribute('aria-invalid')).to.be.false;
    });
  });

  describe('autoselect', () => {
    beforeEach(async () => {
      element = fixtureSync(`<${tag}></${tag}>`);
      await nextRender();
      input = element.querySelector('[slot=input]');
    });

    it('should select the input content when autoselect is set', () => {
      const spy = sinon.spy(input, 'select');
      element.autoselect = true;
      input.focus();
      expect(spy.calledOnce).to.be.true;
    });
  });
};

describe('InputControlMixin + Polymer', () => {
  runTests('polymer');
});

describe('InputControlMixin + Lit', () => {
  runTests('lit');
});
