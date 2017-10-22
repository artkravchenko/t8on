# t8on

`t8on` is a JavaScript library for managing sets of locales and both basic and customizable phrases in the application.

It's lightweight and useful enough at the same time, being able to run in various environments due to the power of [UMD](https://github.com/umdjs/umd).

[![Build Status](https://travis-ci.org/Oopscurity/t8on.svg?branch=master)](https://travis-ci.org/Oopscurity/t8on) [![Coverage Status](https://coveralls.io/repos/github/Oopscurity/t8on/badge.svg?branch=master)](https://coveralls.io/github/Oopscurity/t8on?branch=master)

___

## Quick example

```javascript
t.loadRoot({
  en: { welcome: 'Welcome, %0!', greeting_q: 'How do you do?' },
  ru: { welcome: 'Добро пожаловать!' }
});

t.translate('welcome', 'ru');
// => Добро пожаловать!

t.format('welcome', 'en', 'John');
// => Hello, John!

const toEnglish = t.translateTo('en');
toEnglish('greeting_q');
// => How do you do?
```

Although the library is simple, some details and convenient methods are missing in the example above. So it's recommended to read the following **"Usage"** section to learn how to configure and to use the library properly.

## Usage

`t8on` provides a storage to serve locales and phrases/translations pairs.

### Load the storage

The storage is available as a singleton:

```javascript
import t from 't8on';
```

It also can be instantiated from `Translation` class manually.

```javascript
import { Translation } from 't8on';

const t: Translation = new Translation();
```

### Get storage's current dictionary

You can get the link to the existing dictionary via `Translation#dictionary()` method. In our case it's empty:

```javascript
t.dictionary();
// {}
```

### Load the dictionary or particular locales

The storage accepts dictionaries of the following type:

```javascript
type Translations = {
  [phrase: string]: string // translation
};

type Dictionary = {
  [locale: string]: Translations
};

const initialDictionary: Dictionary = {
  en: { greeting: 'Hello' }
};

const dictionary: Dictionary = {
  en: { welcome: 'Welcome' },
  ru: { welcome: 'Добро пожаловать' }
};
```

To load the dictionary from root level, use `Translation#loadRoot(root: Dictionary): Translation`. It extends already present locales and translations. Note the method's (and few others') return value is current instance of `Translation`:

```javascript
t
  .loadRoot(initialDictionary)
  .dictionary();
// => { en: { greeting: 'Hello' } }

t
  .loadRoot(dictionary);
  .dictionary();
/* => {
    en: { greeting: 'Hello', welcome: 'Welcome' },
    ru: { welcome: 'Добро пожаловать' }
  }
*/
```

To load one locale, use `Translation#load(locale: string, pairs: Translations)`. Note that it extends existing locales, doesn't rewrite them.

```javascript
const newPhrase = { greeting_q: 'How do you do?' };

t
  .load('en', newPhrase)
  .dictionary();
/* => {
    en: {
      greeting: 'Hello',
      welcome: 'Welcome',
      greeting_q: 'How do you do?'
    },
    ru: { welcome: 'Добро пожаловать' }
  }
*/
```

However, if you'd like to set the locale from scratch, deleting all the translations presented there, use `Translation#setLocale(locale: string, pairs: Translations)`:

```javascript
const nextLocale = { welcome: 'Hello there!' };

t
  .setLocale('en', nextLocale);
  .dictionary();
/* => {
    en: { welcome: 'Hello there!' },
    ru: { welcome: 'Добро пожаловать' }
  }
*/
```

### Get the translation

There are two types of phrases/translations:

- simple, such as listed above;
- parameterized, like `'Hello, %0!'`.

Let's start with simple ones.

### Simple translations

In order to get a translation of given phrase, you can use several options:

1. Set default locale name to `Translation#defaultLocale: string` for the whole instance of `Translation` and then call `Translation#translateCurrent(phrase: string)`.

```javascript
t.defaultLocale = 'en';
t.translateCurrent('welcome');
// => 'Hello there!'
```

**Important:** if there's no translation found, all `translate*` and `format*` functions translate the phrase to fallback locale if it's set with `Translation#fallbackLocale: string`. If the dictionary of fallback locale doesn't contain the phrase too, empty string `''` is returned.

2. Create translation function to desired locale with `Translation#translateTo(locale: string)`. Call it with a phrase name to get the translation:

```javascript
const toRussian: (phrase: string) => string = t.translateTo('ru');
toRussian('welcome');
// => 'Добро пожаловать'
```

3. Use `Translation#translate(phrase: string, locale: string)`:

```javascript
t.translate('welcome', 'en');
// => 'Hello there!'
```

### Parameterized translations

Sometimes, there are situations when you can't just translate the given phrase, you need to customize it smartly.

Parameterized translations accept one or more string arguments to manage more complex expressions. The parameters number to translate the phrase to each locale may differ. The numbering is zero based:

```javascript
const parameterizedDictionary: Dictionary = {
  en: {
    set_default_q: 'Would you like to set %0 your default browser?'
  },
  ru: {
    set_default_q: 'Не желаете ли Вы сделать %0 браузером по умолчанию?'
  }
};
```

The same arguments can be included in the translation as many times as you wish. 

```javascript
'I repeat the argument three times: %0! %0! %0!'
```

They also can be mixed:

```javascript
'Your name reversed: %1 %0'
```

Finally, by analogy with `translate*` methods, you have 3 options in order to insert arguments to the translations. The operation is `format` based:

1. "Format" phrases to the default locale with `Translation#formatCurrent(phrase: string, ...args: Array<string>)`:

```javascript
t
  .loadRoot(parameterizedDictionary)
  .formatCurrent('set_default_q', 'Mozilla Firefox');
// => 'Would you like to set Mozilla Firefox your default browser?'
```

2. Create formatting function to the given locale with `Translation#formatTo(locale: string)` and then use it directly:

```javascript 
const toRussian: (phrase: string, ...args: Array<string>) => string = t.formatTo('ru');
toRussian('set_default_q', 'Google Chrome');
// => 'Не желаете ли Вы сделать Google Chrome браузером по умолчанию?'
```

3. Use common `Translation#format(phrase: string, locale: string, ...args: Array<string>)`:

```javascript
t.format('set_default_q', 'en', 'Vivaldi');
// => 'Would you like to set Vivaldi your default browser?'
```

## Installation

t8on is available as the [`t8on`](https://www.npmjs.com/package/t8on) package on [npm](https://www.npmjs.com/).

To install the latest stable version, type

```
npm install --save t8on
```

You can also access package's files on [unpkg.com](https://unpkg.com/t8on/).

The package provides a [CommonJS](https://webpack.js.org/api/module-methods/#commonjs) module in the `lib` directory and a production-ready [UMD](https://github.com/umdjs/umd) build in the `dist` folder.

Although t8on is intended for usage with module bundlers such as [Webpack](https://webpack.js.org/), thanks to UMD, it's possible to use `t8on` with many other JavaScript module loaders or completely without them.

If it sounds like your case, you can simply connect the UMD build as a `<script>` tag on the web page. After that, the library will be available via `window.t8on`.

## Licence

`t8on` is [MIT licensed](https://github.com/Oopscurity/t8on/blob/master/LICENSE).

