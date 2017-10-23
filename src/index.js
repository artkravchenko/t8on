function merge(object, source) {
  if (typeof source === 'undefined' || source === null) {
    return object;
  }

  // eslint-disable-next-line no-var
  for (var v0, v1, k, keys = Object.keys(source), l = keys.length, i = 0; i < l; ++i) {
    k = keys[i], v1 = source[k];
    if (typeof v1 !== 'undefined') {
      v0 = object[k];
      if (
        typeof v1 === 'object' && v1 !== null &&
        typeof v0 === 'object' && v0 !== null
      ) {
        merge(v0, v1);
      } else {
        object[k] = v1;
      }
    }
  }

  return object;
}

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

const deprecated = (f) => {
  const g = function () {
    if (!this.calledBefore) {
      this.calledBefore = true;
      // eslint-disable-next-line no-console
      console.warn(
        'Deprecation warning: usage of t8on singleton\'s properties ' +
        'and methods imported manually is considered deprecated. ' +
        'All *named* exports except Translation will be removed ' +
        'in upcoming major release. Please export the singleton and call ' +
        'its methods directly, such as t.translate()'
      );
    }
    return f.apply(null, arguments);
  };

  return g;
};

const t = new Translation();

export const format = deprecated(t.format);
export const formatTo = deprecated(t.formatTo);
export const formatCurrent = deprecated(t.formatCurrent);

export const translate = deprecated(t.translate);
export const translateTo = deprecated(t.translateTo);
export const translateCurrent = deprecated(t.translateCurrent);

export const load = deprecated(t.load);
export const loadRoot = deprecated(t.loadRoot);
export const setLocale = deprecated(t.setLocale);

export const currentLocale = t.currentLocale;
export const fallbackLocale = t.fallbackLocale;

export default t;
