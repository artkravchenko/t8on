import merge from 'lodash.merge';

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
    this.translate(phrase, this.currentLocale);

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
    this.format(phrase, this.currentLocale, ...args);
}

const t = new Translation();

export const {
  format,
  formatTo,
  formatCurrent,
  translate,
  translateTo,
  translateCurrent,
  setLocale,
  load,
  loadRoot,
  currentLocale,
  fallbackLocale
} = t;

export default t;
