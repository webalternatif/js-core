[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
![Tests](https://img.shields.io/github/actions/workflow/status/webalternatif/js-core/ci.yml?label=Tests)
[![codecov](https://codecov.io/github/webalternatif/js-core/branch/main/graph/badge.svg?token=MLPFU51XJH)](https://codecov.io/github/webalternatif/js-core)
![npm](https://img.shields.io/npm/v/@webalternatif/js-core)

# js-core

Modular JavaScript utilities for modern applications.

Lightweight, framework-agnostic helpers for data manipulation, DOM handling, events and internationalization.

---

## Installation

```bash
npm install @webalternatif/js-core
```

```bash
yarn add @webalternatif/js-core
```

## Basic Usage

The default export provides pure JavaScript utilities only.

```js
import webf from '@webalternatif/js-core'

webf.unique([1, 2, 2]) // [1, 2]
webf.numberFormat(12345.6789, 2, true, '.', ',') // 12.345,68
webf.isTouchDevice() // true or false
```

## Documentation

### Core modules
- [String utilities](docs/string.md)
- [Array utilities](docs/array.md)
- [Type checking](docs/is.md)
- [Random utilities](docs/random.md)
- [Traversal utilities](docs/traversal.md)
- [Math utilities](docs/math.md)
- [General utilities](docs/utils.md)

### Additional modules
- [DOM utilities](docs/dom.md)
- [Event Dispatcher](docs/eventDispatcher.md)
- [Translator (i18n)](docs/translator.md)
- [Mouse utilities](docs/mouse.md)

## Tests

This project uses Jest for unit testing.

```bash
yarn test
```
