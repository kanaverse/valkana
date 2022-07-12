# Validating kana state files

## Overview

This package is a wrapper for the [**kanaval** C++ library](https://github.com/LTLA/kanaval) for validating the HDF5 state files produced by [**bakana**](https://github.com/LTLA/bakana).
It is primarily used for **bakana**'s unit tests on Node.js.
We created a separate package rather than attempting to bundle the Wasm files inside **bakana** (or **scran.js**) where they might bloat the bundles.

## Quick start

We assume that the `*.kana` file has been parsed to obtain the embedded HDF5 file, e.g., using **bakana**'s `parseKanaFile()` function.

```js
import * as va from "valkana";
await va.initialize();
va.validateState(
    path, /* path to a state file */
    true, /* embedded or linked */
    2001000 /* kana file version */
);
```

This will raise an error if the state file does not satisfy the [specification](https://ltla.github.io/kanaval).

Web applications will need to make sure that the HDF5 file is saved on **valkana**'s virtual filesystem via the `writeFile()` function.
See the [reference documentation](https://ltla.github.io/valkana) for more details.

## Developer notes

This package compiles the **kanaval** library to WebAssembly for execution in typical Javascript environments (e.g., browser/Node.js).
Building the Wasm binary requires the [Emscripten toolchain](https://emscripten.org) and a recent version of [CMake](https://cmake.org).
Once these are installed, we can simply do:

```sh
./build.sh main
./build.sh browser
```

Testing usually involves some combination of these flags:

```sh
node --experimental-vm-modules --experimental-wasm-bulk-memory --experimental-wasm-bigint node_modules/jest/bin/jest.js
```
