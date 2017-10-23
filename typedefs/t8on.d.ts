declare module T8on {
  function merge(object: Object, source?: Object): Object;

  export type Dictionary = {
    [locale: string]: Translations
  };
  
  export type Translations = {
    [phrase: string]: string
  };

  export interface Translation {
    currentLocale?: string;
    fallbackLocale?: string;

    load(locale: string, pairs: Translations): Translation;
    loadRoot(root: Dictionary): Translation;
    setLocale(locale: string, pairs: Translations): Translation;

    translate(phrase: string, locale: string): string;
    translateTo(locale: string): (phrase: string) => string;
    translateCurrent(phrase: string): string;

    format(phrase: string, locale: string, ...args: Array<string>): string;
    formatTo(locale: string): (phrase: string, ...args: Array<string>) => string;
    formatCurrent(phrase: string, ...args: Array<string>): string;
  }

  export function load(locale: string, pairs: Translations): Translation;
  export function loadRoot(root: Dictionary): Translation;
  export function setLocale(locale: string, pairs: Translations): Translation;

  export function translate(phrase: string, locale: string): string;
  export function translateTo(locale: string): (phrase: string) => string;
  export function translateCurrent(phrase: string): string;

  export function format(
    phrase: string,
    locale: string,
    ...args: Array<string>
  ): string;

  export function formatTo(
    locale: string
  ): (phrase: string, ...args: Array<string>) => string;

  export function formatCurrent(
    phrase: string,
    ...args: Array<string>
  ): string;

  export let currentLocale: string;
  export let fallbackLocale: string;
}

declare const t: T8on.Translation;

declare module "t8on" {
  export = {
    ...T8on,
    default: t
  }
}
