import deprecate from './util/deprecate';
import Translation from './translation';

export { Translation };

const t = new Translation();

const __DEV__ = process.env.NODE_ENV !== 'production';

const EXPORTED_SINGLETON_METHODS_DEPRECATION_NOTICE = __DEV__
  ? 'Deprecation warning: usage of t8on singleton\'s properties ' +
    'and methods imported manually is considered deprecated. ' +
    'All *named* exports except Translation will be removed ' +
    'in upcoming major release. Please export the singleton and call ' +
    'its methods directly, such as t.translate()'
  : '';

export const format = __DEV__
  ? deprecate(t.format, EXPORTED_SINGLETON_METHODS_DEPRECATION_NOTICE)
  : t.format;

export const formatTo = __DEV__
  ? deprecate(t.formatTo, EXPORTED_SINGLETON_METHODS_DEPRECATION_NOTICE)
  : t.formatTo;

export const formatCurrent = __DEV__
  ? deprecate(t.formatCurrent, EXPORTED_SINGLETON_METHODS_DEPRECATION_NOTICE)
  : t.formatCurrent;

export const translate = __DEV__
  ? deprecate(t.translate, EXPORTED_SINGLETON_METHODS_DEPRECATION_NOTICE)
  : t.translate;

export const translateTo = __DEV__
  ? deprecate(t.translateTo, EXPORTED_SINGLETON_METHODS_DEPRECATION_NOTICE)
  : t.translateTo;

export const translateCurrent = __DEV__
  ? deprecate(t.translateCurrent, EXPORTED_SINGLETON_METHODS_DEPRECATION_NOTICE)
  : t.translateCurrent;

export const load = __DEV__
  ? deprecate(t.load, EXPORTED_SINGLETON_METHODS_DEPRECATION_NOTICE)
  : t.load;

export const loadRoot = __DEV__
  ? deprecate(t.loadRoot, EXPORTED_SINGLETON_METHODS_DEPRECATION_NOTICE)
  : t.loadRoot;

export const setLocale = __DEV__
  ? deprecate(t.setLocale, EXPORTED_SINGLETON_METHODS_DEPRECATION_NOTICE)
  : t.setLocale;

export const currentLocale = t.currentLocale;
export const fallbackLocale = t.fallbackLocale;

export default t;
