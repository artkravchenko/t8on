import deprecate from './util/deprecate';
import merge from './util/merge';

export function Translation() {
  const dictionary = {};

  this.currentLocale = null;
  this.fallbackLocale = null;

  this.dictionary = () => dictionary;

  this.load = (locale, pairs) => {
    if (!(locale in dictionary)) {
      dictionary[locale] = {};
    }
    merge(dictionary[locale], pairs);
    return this;
  };

  this.loadRoot = (root) => {
    merge(dictionary, root);
    return this;
  };

  this.setLocale = (locale, dic) => {
    dictionary[locale] = dic;
    return this;
  };

  this.translate = (phrase, locale) => {
    if (!(locale in dictionary) || !(phrase in dictionary[locale])) {
      if (!this.fallbackLocale || locale === this.fallbackLocale) {
        return '';
      }

      return this.translate(phrase, this.fallbackLocale);
    }

    return dictionary[locale][phrase];
  };

  this.translateTo = locale => phrase =>
    this.translate(phrase, locale);

  this.translateCurrent = phrase =>
    this.translate(phrase, this.currentLocale || '');

  this.format = (phrase, locale, ...args) => {
    if (!(locale in dictionary) || !(phrase in dictionary[locale])) {
      if (!this.fallbackLocale || locale === this.fallbackLocale) {
        return '';
      }

      return this.format(phrase, this.fallbackLocale, ...args);
    }

    return dictionary[locale][phrase].replace(/%(\S)/g, (_, i) => {
      return args[i];
    });
  };

  this.formatTo = locale => (phrase, ...args) =>
    this.format(phrase, locale, ...args);

  this.formatCurrent = (phrase, ...args) =>
    this.format(phrase, this.currentLocale || '', ...args);
}

const EXPORTED_SINGLETON_METHODS_DEPRECATION_NOTICE =
  'Deprecation warning: usage of t8on singleton\'s properties ' +
  'and methods imported manually is considered deprecated. ' +
  'All *named* exports except Translation will be removed ' +
  'in upcoming major release. Please export the singleton and call ' +
  'its methods directly, such as t.translate()';

const t = new Translation();

export const format = deprecate(t.format, EXPORTED_SINGLETON_METHODS_DEPRECATION_NOTICE);
export const formatTo = deprecate(t.formatTo, EXPORTED_SINGLETON_METHODS_DEPRECATION_NOTICE);
export const formatCurrent = deprecate(t.formatCurrent, EXPORTED_SINGLETON_METHODS_DEPRECATION_NOTICE);

export const translate = deprecate(t.translate, EXPORTED_SINGLETON_METHODS_DEPRECATION_NOTICE);
export const translateTo = deprecate(t.translateTo, EXPORTED_SINGLETON_METHODS_DEPRECATION_NOTICE);
export const translateCurrent = deprecate(t.translateCurrent, EXPORTED_SINGLETON_METHODS_DEPRECATION_NOTICE);

export const load = deprecate(t.load, EXPORTED_SINGLETON_METHODS_DEPRECATION_NOTICE);
export const loadRoot = deprecate(t.loadRoot, EXPORTED_SINGLETON_METHODS_DEPRECATION_NOTICE);
export const setLocale = deprecate(t.setLocale, EXPORTED_SINGLETON_METHODS_DEPRECATION_NOTICE);

export const currentLocale = t.currentLocale;
export const fallbackLocale = t.fallbackLocale;

export default t;
