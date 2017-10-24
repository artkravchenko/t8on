# Change log

All notable changes to `t8on` will be documented in this file.
This library adheres to [Semantic Versioning](http://semver.org/). 

## [v0.2.0-alpha.2](https://github.com/oopscurity/t8on/releases/tag/v0.2.0-alpha.2) - 2017/10/24

### Bug fixes

Fixed possible errors caused with deprecation function on NodeJS environments if deprecated named exports are used.

### Optimization

Restructured the distributables to skip singleton creation if only `Translation` class is needed. Import the class this way:

```javascript
import Translation from 't8on/translation';
```

### Test coverage

Wrote comprehensive test cases for `deprecate` utility function.

## [v0.2.0-alpha.1](https://github.com/oopscurity/t8on/releases/tag/v0.2.0-alpha.1) - 2017/10/24

### Deprecation notice

All named exports except `Transition` are considered deprecated and they will be removed at the major release (`1.0.0`). 

### Bug fixes

`Translation#load(locale, phrases)` now preserves existing locale's dictionary even if new key & value pair is present but the value is equal to `undefined`. (This behaviour is similar to `Translation#loadRoot(dictionary)`.)

### Optimization

Dropped `lodash.merge` dependency and reduced the size of UMD build to `2.8 kB` from over `14 kB`. :boom:

Removed reduntant `postinstall` npm script.

### Documentation

Extended the README with large ["Usage"](https://github.com/Oopscurity/t8on#usage) section which covers almost all aspects of the library usage.

Added a brief ["Quick example"](https://github.com/Oopscurity/t8on#quick-example) paragraph there to make a short but notable introduction to `t8on`.

Added the change log you're reading now. :blush:

Changed the project's description.

### Type definitions

Provided highly experimental `Flow` and `TypeScript` type definitions which most likely will cause type checking errors on your side.

### Misc: build options, supported environments

Moved all distributable sources to the `dist` folder.

Added `es` module building pipeline targeting to `dist/t8on.es.js`.

Use `loose` babel plugins' options to support wider range of environments.

## [v0.1.5](https://github.com/oopscurity/t8on/releases/tag/v0.1.5) - 2017/10/22

Prodution-ready UMD build is now available in the `dist` folder.

The size of the package became smaller since unnecessary files were excluded.

## [v0.1.4](https://github.com/oopscurity/t8on/releases/tag/v0.1.4) - 2017/06/06 

Wrote README file with the library's description and installation instructions.

## [v0.1.3](https://github.com/oopscurity/t8on/releases/tag/v0.1.3) - 2017/06/06

Many changes in the library's internal development process, for example:

- Set up CI;
- Configured code coverage tools;
- Improve cross-platform development compatibility with `cross-env`.

## [v0.1.2](https://github.com/oopscurity/t8on/releases/tag/v0.1.2) - 2017/06/06

`postinstall` npm script has been added.

## [v0.1.1](https://github.com/oopscurity/t8on/releases/tag/v0.1.1) - 2017/06/06

The first public npm release with a bunch of internal changes.

## [v0.1.0](https://github.com/oopscurity/t8on/releases/tag/v0.1.0) - 2017/06/05

Initial release
