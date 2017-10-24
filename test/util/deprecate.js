import { expect } from 'chai';
import range from 'lodash/range';
import sinon from 'sinon';

import deprecate from '../../src/util/deprecate';

export default function deprecateSpec() {
  describe('deprecate(f, message)', () => {
    const fun = sinon.spy((a, b, c) => a * b * c);
    const message = 'Deprecation notice test';
    const f = deprecate(fun, message);

    let warn;
    before(() => warn = sinon.stub(console, 'warn'));
    afterEach(() => fun.reset());
    after(() => warn.restore());

    it('returns a wrapper function', () => {
      expect(f).to.satisfy(f => typeof f === 'function');
    });

    it('reports correct warning', () => {
      f();
      expect(warn.calledWithExactly(message)).to.be.true;
    });

    it('reports warning only once', () => {
      expect(warn.callCount).to.equal(1);
      f();
      expect(warn.callCount).to.equal(1);
    });

    it('calls the function once at a time', () => {
      f();
      expect(fun.callCount).to.equal(1);
      f();
      expect(fun.callCount).to.equal(2);
    });

    it('passes all incoming arguments to given function', () => {
      const args = range(10);
      f(...args);
      expect(fun.calledWithExactly(...args)).to.be.true;
    });

    it('returns given function return value', () => {
      expect(f(2, 3, 4)).to.equal(fun.returnValues[0]);
    });
  });
}
