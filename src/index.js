import deprecate from './util/deprecate';
import Translation from './translation';

export { Translation };

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
