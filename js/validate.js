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

/**
 * Only validate the `inputs` group of the HDF5 state file. 
 *
 * @param {string} path - Path to the HDF5 file.
 * On browsers, this should reside in the virtual filesystem.
 * @param {boolean} embedded - Whether the input files were embedded or linked into the file.
 * @param {number} version - Version of the kana file, as an `XXXYYYZZZ` integer for version `XXX.YYY.ZZZ`,
 * e.g., 1001000 for version 1.1.0.
 *
 * @return An error is raised if the `inputs` group is invalid.
 */
export function validateInputsState(path, embedded, version) {
    wasm.call(module => module.validate_inputs(path, embedded, version));
    return;
}

/**
 * Only validate the `quality_control` group of the HDF5 state file. 
 *
 * @param {string} path - Path to the HDF5 file.
 * On browsers, this should reside in the virtual filesystem.
 * @param {number} numCells - Number of cells in the dataset, prior to any filtering.
 * @param {number} numSamples - Number of samples (i.e., batches) in the dataset.
 * @param {number} version - Version of the kana file, as an `XXXYYYZZZ` integer for version `XXX.YYY.ZZZ`,
 * e.g., 1001000 for version 1.1.0.
 *
 * @return An error is raised if the `quality_control` group is invalid.
 */
export function validateQualityControlState(path, numCells, numSamples, version) {
    wasm.call(module => module.validate_quality_control(path, numCells, numSamples, version));
    return;
}

/**
 * Only validate the `adt_quality_control` group of the HDF5 state file. 
 *
 * @param {string} path - Path to the HDF5 file.
 * On browsers, this should reside in the virtual filesystem.
 * @param {number} numCells - Number of cells in the dataset, prior to any filtering.
 * @param {number} numSamples - Number of samples (i.e., batches) in the dataset.
 * @param {boolean} inUse - Whether ADTs are available in the dataset.
 * @param {number} version - Version of the kana file, as an `XXXYYYZZZ` integer for version `XXX.YYY.ZZZ`,
 * e.g., 1001000 for version 1.1.0.
 *
 * @return An error is raised if the `adt_quality_control` group is invalid.
 */
export function validateAdtQualityControlState(path, numCells, numSamples, inUse, version) {
    wasm.call(module => module.validate_adt_quality_control(path, numCells, numSamples, inUse, version));
    return;
}

/**
 * Only validate the `combine_embeddings` group of the HDF5 state file. 
 *
 * @param {string} path - Path to the HDF5 file.
 * On browsers, this should reside in the virtual filesystem.
 * @param {number} numCells - Number of cells in the dataset after filtering.
 * @param {Array} modalities - Names of all modalities involved.
 * @param {number} totalDims - Total number of embedding dimensions, summed across all modalities.
 * @param {number} version - Version of the kana file, as an `XXXYYYZZZ` integer for version `XXX.YYY.ZZZ`,
 * e.g., 1001000 for version 1.1.0.
 *
 * @return An error is raised if the `combine_embeddings` group is invalid.
 */
export function validateCombineEmbeddingsState(path, numCells, modalities, totalDims, version) {
    let collected = [];
    const enc = new TextEncoder;
    modalities.forEach(x => {
        collected.push(enc.encode(x));
    });

    let lens = null;
    let strs = null;

    try {
        lens = wa.createInt32WasmArray(wasm.wasmArraySpace(), collected.length);
        let len_arr = lens.array();
        let len_total = 0;
        collected.forEach((x, i) => {
            len_arr[i] = x.length;
            len_total += x.length;
        });

        strs = wa.createUint8WasmArray(wasm.wasmArraySpace(), len_total);
        let str_arr = strs.array();
        let str_total = 0;
        collected.forEach((x, i) => {
            strs.set(x, str_total);
            str_total += x.length;
        });

        wasm.call(module => module.validate_combine_embeddings(path, numCells, lens.length, strs.offset, lens.offset, totalDims, version));
    } finally {
        if (lens !== null) {
            lens.free();
        }
        if (strs !== null) {
            strs.free();
        }
    }

    return;
}
