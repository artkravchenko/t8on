import { expect } from 'chai';

import { Translation } from '../src';

describe('Translate', () => {
  describe('dictionary()', () => {
    let t;
    before(() => {
      t = new Translation();
    });

    it('is an empty plain object after construction', () => {
      expect(t.dictionary()).to.be.deep.equal({});
    });

    it('doesn\'t return clones', () => {
      const snapshot1 = t.dictionary();
      const snapshot2 = t.dictionary();
      expect(snapshot1).to.equal(snapshot2);
    });

    it('mutation of original tree is possible', () => {
      const snapshot = t.dictionary();
      snapshot.en = { test: 'Test expression' };
      expect(t.dictionary()).to.deep.equal({
        en: { test: 'Test expression' }
      });
    });
  });

  describe('load(locale, pairs)', () => {
    let t;
    beforeEach(() => {
      t = new Translation();
      t.load('en', { 'test': 'Test expression' });
    });

    it('sets localization tree if it doesn\'t exist', () => {
      expect(t.dictionary()).to.deep.equal({
        en: { test: 'Test expression' }
      });
    });

    it('extends existing tree - doesn\'t replace it', () => {
      t.load('en', { 'new': 'New test expression' });
      expect(t.dictionary()).to.deep.equal({
        en: { test: 'Test expression',
          new: 'New test expression' }
      });
    });

    it('replaces the values with already existing keys', () => {
      t.load('en', { test: 'Slightly different expression' });
      expect(t.dictionary()).to.deep.equal({
        en: { test: 'Slightly different expression' }
      });
    });

    it('doesn\'t replace existing value if new value is undefined', () => {
      t.load('en', { test: undefined });
      expect(t.dictionary()).to.deep.equal({
        en: { test: 'Test expression' }
      });
    });

    it('sets trees of different locales independently', () => {
      t.load('ru', { 'test': 'Тестовое выражение' });
      expect(t.dictionary()).to.deep.equal({
        en: { test: 'Test expression' },
        ru: { test: 'Тестовое выражение' }
      });
    });

    it('is chainable', () => {
      expect(t.load()).to.equal(t);
    });
  });

  describe('loadRoot(root)', () => {
    let t;
    beforeEach(() => {
      t = new Translation();
    });

    it('extends empty dictionary - doesn\'t replace', () => {
      const snapshot = t.dictionary();

      expect(snapshot).to.be.equal(
        t.loadRoot({}).dictionary()
      );
      expect(snapshot).to.be.equal(
        t.loadRoot({ en: {} }).dictionary()
      );
      expect(snapshot).to.be.equal(
        t.loadRoot({ en: { test: 'Test expression' } }).dictionary()
      );
      expect(snapshot).to.deep.equal({
        en: { test: 'Test expression' }
      });
    });

    it('extends existing tree deeply', () => {
      t.loadRoot({ en: { test: 'Test expression' } });
      expect(t.dictionary()).to.deep.equal({
        en: { test: 'Test expression' }
      });

      t.loadRoot({ en: { new: 'New test expression' } });
      expect(t.dictionary()).to.deep.equal({
        en: { test: 'Test expression', new: 'New test expression' }
      });

      t.loadRoot({ ru: { test: 'Тестовое выражение' } });
      expect(t.dictionary()).to.deep.equal({
        en: { test: 'Test expression', new: 'New test expression' },
        ru: { test: 'Тестовое выражение' }
      });
    });

    it('doesn\'t replace existing value if new value is undefined', () => {
      t.loadRoot({ en: { test: 'Test expression' } });
      expect(t.dictionary()).to.deep.equal({
        en: { test: 'Test expression' }
      });

      t.loadRoot({ en: { test: undefined } });
      expect(t.dictionary()).to.deep.equal({
        en: { test: 'Test expression' }
      });
    });

    it('is chainable', () => {
      expect(t.loadRoot({})).to.equal(t);
    });
  });

  describe('setLocale(locale, dic)', () => {
    let t;
    beforeEach(() => {
      t = new Translation();
    });

    it('sets dictionary of given locale forcefully', () => {
      t.setLocale('en', { test: 'Test expression' });
      expect(t.dictionary()).to.deep.equal({
        en: { test: 'Test expression' }
      });

      t.setLocale('en', { new: 'New test expression' });
      expect(t.dictionary()).to.deep.equal({
        en: { new: 'New test expression' }
      });
    });

    it('sets different locales independently from each other', () => {
      t.setLocale('en', { test: 'Test expression' });
      t.setLocale('ru', { test: 'Тестовое выражение' });
      expect(t.dictionary()).to.deep.equal({
        en: { test: 'Test expression' },
        ru: { test: 'Тестовое выражение' }
      });
    });

    it('is chainable', () => {
      expect(t.setLocale('en', {})).to.equal(t);
    });
  });

  describe('translate(phrase, locale)', () => {
    describe('without fallback locale', () => {
      let t;
      before(() => {
        t = new Translation();
        t.loadRoot({
          en: { test: 'Test expression' },
          ru: { test: 'Тестовое выражение' }
        });
      });

      it('returns empty string if phrase doesn\'t exist', () => {
        expect(t.translate('doesn\'t exist', 'en')).to.equal('');
      });

      it('returns empty string if locale doesn\'t exist', () => {
        expect(t.translate('test', 'it')).to.equal('');
      });
    });

    describe('with fallback locale', () => {
      let t;
      before(() => {
        t = new Translation();
        t.loadRoot({
          en: { test: 'Test expression' },
          ru: { test: 'Тестовое выражение' }
        });
        t.fallbackLocale = 'en';
      });

      it('returns phrase of fallback locale if given locale doesn\'t have it', () => {
        expect(t.translate('doesn\'t exist', 'it')).to.equal(
          t.translate('doesn\'t exist', 'en')
        );
        expect(t.translate('doesn\'t exist', 'en')).to.equal('');
      });

      it('returns phrase of fallback locale if given locale doesn\'t exist', () => {
        expect(t.translate('test', 'it')).to.equal(
          t.translate('test', 'en')
        );
      });
    });

    describe('common', () => {
      let t;
      before(() => {
        t = new Translation();
        t.loadRoot({
          en: { test: 'Test expression' },
          ru: { test: 'Тестовое выражение' }
        });
      });

      it('returns matching phrase with given key and locale', () => {
        expect(t.translate('test', 'en')).to.equal('Test expression');
        expect(t.translate('test', 'ru')).to.equal('Тестовое выражение');
      });
    });
  });

  describe('translateTo(locale)', () => {
    let t;
    before(() => {
      t = new Translation();
      t.loadRoot({
        en: { test: 'Test expression' },
        ru: { test: 'Тестовое выражение' }
      });
    });

    it('returns translate function: (phrase: string) => string', () => {
      const f = t.translateTo('en');
      expect(f).is.instanceof(Function);
      expect(f).to.have.lengthOf(1);
      expect('').to.satisfy(x => typeof f(x) === 'string');
    });

    it('returns translate function if given locale doesn\'t exist', () => {
      expect(t.translateTo('it')('test')).to.equal(
        t.translate('test', 'it')
      );
    });

    it('translate function works', () => {
      expect(t.translateTo('en')('test')).to.equal('Test expression');
      expect(t.translateTo('ru')('test')).to.equal('Тестовое выражение');
    });
  });

  describe('translateCurrent(phrase)', () => {
    let t;
    before(() => {
      t = new Translation();
      t.loadRoot({
        en: { test: 'Test expression', new: 'New test expression' },
        ru: { test: 'Тестовое выражение' }
      });
    });

    it('returns \'\' if neither currentLocale not fallbackLocale are present', () => {
      expect(t.translateCurrent('test')).to.equal('');
    });

    it('returns phrase from fallbackLocale if currentLocale isn\'t present', () => {
      t.fallbackLocale = 'en';
      expect(t.translateCurrent('test')).to.equal('Test expression');
    });

    it('returns phrase from fallbackLocale if currentLocale doesn\'t have it', () => {
      t.currentLocale = 'ru';
      expect(t.translateCurrent('new')).to.equal('New test expression');
    });

    it('returns phrase with given key from currentLocale', () => {
      expect(t.translateCurrent('test')).to.equal('Тестовое выражение');
    });
  });

  describe('format(phrase, locale, ...args)', () => {
    let t;
    before(() => {
      t = new Translation();
      t.loadRoot({
        en: {
          from0: 'Count is zero-based: %1',
          multiple: 'Expression: %0 + %1 = %2',
          repeat: 'Repeat: %0 * %0 = %1'
        },
        ru: { test: 'Тестовое выражение' }
      });
    });

    describe('without fallback locale', () => {
      it('returns \'\' if neither given locale exists nor fallback locale is present', () => {
        expect(t.format('repeat', 'it', 8, 64)).to.equal('');
      });
    });

    describe('with fallback locale', () => {
      before(() => {
        t.fallbackLocale = 'en';
      });

      it('returns \'\' if given phrase isn\'t present in given and fallback locales', () => {
        expect(t.format('doesn\'t exist', 'ru', 'argument')).to.equal('');
      });

      it('returns phrase for fallback locale if given locale doesn\'t exist', () => {
        expect(t.format('repeat', 'it', 8, 64)).to.equal(
          'Repeat: 8 * 8 = 64'
        );
      });
    });

    describe('common', () => {
      before(() => {
        t.fallbackLocale = null;
      });

      it('arguments indexes\' count is zero-based', () => {
        expect(t.format('from0', 'en', 'argument')).to.equal(
          'Count is zero-based: undefined'
        );

        expect(t.format('from0', 'en', 'argument #0', 'argument #1')).to.equal(
          'Count is zero-based: argument #1'
        );
      });

      it('returns phrase filled with given arguments', () => {
        expect(t.format('multiple', 'en', 5, 6, '11')).to.equal(
          'Expression: 5 + 6 = 11'
        );
      });

      it('returns phrase if arguments aren\'t present', () => {
        expect(t.format('multiple', 'en')).to.equal(
          'Expression: undefined + undefined = undefined'
        );
      });

      it('uses the same arguments as many times as expected', () => {
        expect(t.format('repeat', 'en', 8, 64)).to.equal(
          'Repeat: 8 * 8 = 64'
        );
      });
    });
  });

  describe('formatTo(locale)', () => {
    let t;
    before(() => {
      t = new Translation();
      t.loadRoot({
        en: { test: 'Test expression: %0' },
        ru: { test: 'Тестовое выражение: %0' }
      });
    });

    it('returns format function: (phrase: string, ...args: Array<Any>) => string', () => {
      const f = t.formatTo('en');
      expect(f).is.instanceof(Function);
      expect(f).to.have.lengthOf(1);
      expect('').to.satisfy(x => typeof f(x) === 'string');
      expect('').to.satisfy(x => typeof f(x, 1) === 'string');
    });

    it('returns format function if given locale doesn\'t exist', () => {
      expect(t.formatTo('it')('test', 1)).to.equal(
        t.format('test', 'it', 1)
      );
    });

    it('format function works', () => {
      expect(t.formatTo('en')('test', 1)).to.equal('Test expression: 1');
      expect(t.formatTo('ru')('test', 1)).to.equal('Тестовое выражение: 1');
    });
  });

  describe('formatCurrent(phrase, ...args)', () => {
    let t;
    before(() => {
      t = new Translation();
      t.loadRoot({
        en: { test: 'Test expression: %0', new: 'New test expression: %0' },
        ru: { test: 'Тестовое выражение: %0' }
      });
    });

    it('returns \'\' if neither currentLocale not fallbackLocale are present', () => {
      expect(t.formatCurrent('test', 1)).to.equal('');
    });

    it('returns phrase from fallbackLocale if currentLocale isn\'t present', () => {
      t.fallbackLocale = 'en';
      expect(t.formatCurrent('test', 1)).to.equal('Test expression: 1');
    });

    it('returns phrase from fallbackLocale if currentLocale doesn\'t have it', () => {
      t.currentLocale = 'ru';
      expect(t.formatCurrent('new', 1)).to.equal('New test expression: 1');
    });

    it('returns phrase with given key from currentLocale', () => {
      expect(t.formatCurrent('test', 1)).to.equal('Тестовое выражение: 1');
    });
  });
});
