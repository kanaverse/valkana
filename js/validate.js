import * as wasm from "./wasm.js";
import * as wa from "wasmarrays.js";

/**
 * Validate the HDF5 state file containing the analysis parameters and results.
 * It is assumed that the HDF5 state file has already been extracted from the `*.kana` file,
 * e.g., using **bakana**'s `parseKanaFile` function.
 *
 * @param {string} path - Path to the HDF5 file.
 * On browsers, this should reside in the virtual filesystem.
 * @param {boolean} embedded - Whether the input files were embedded or linked into the file.
 * @param {number} version - Version of the kana file, as an `XXXYYYZZZ` integer for version `XXX.YYY.ZZZ`,
 * e.g., 1001000 for version 1.1.0.
 *
 * @return An error is raised if the state file is invalid.
 */
export function validateState(path, embedded, version) {
    wasm.call(module => module.validate(path, embedded, version));
    return;
}
