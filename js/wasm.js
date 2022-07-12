import loadValkana from "./wasm/valkana.js";

const cache = {};

/**
 * @param {object} [options] - Optional parameters.
 * @param {boolean} [options.localFile=false] - Whether or not to look for the Wasm and worker scripts locally.
 * This should only be `true` when using old versions of Node.js where file URLs are not supported,
 * and is ignored completely outside of Node.js contexts.
 *
 * @return {boolean}
 * The Wasm bindings are initialized and `true` is returned.
 * If the bindings were already initialized (e.g., by a previous call to `initialize`), nothing is done and `false` is returned.
 */
export async function initialize({ localFile = false } = {}) {
    let options = {};
    if (localFile) {                                                                /** NODE ONLY **/  
        options.locateFile = (x) => import.meta.url.substring(7) + "/../wasm/" + x; /** NODE ONLY **/
    }                                                                               /** NODE ONLY **/

    cache.module = await loadValkana(options);
}

export function call(func) {
    if (! ("module" in cache)) {
        throw new Error("Wasm module needs to be initialized via 'initialize()'");
    }

    var output;
    try {
        output = func(cache.module);    
    } catch (e) {
        if (typeof e == "number") {
            throw new Error(cache.module.get_error_message(e));
        } else {
            throw e;
        }
    }
    return output;
}

/**
 * This is intended for use in web browsers to allow {@linkcode validateState} to work properly.
 * Node applications should not call this function;
 * rather, they can just read directly from the real file system.
 *
 * @param {string} path - Path to the output file on the virtual file system.
 * @param {Uint8Array} buffer - Buffer to write to file.
 *
 * @return `buffer` is written to the binary file `path`.
 */
export function writeFile(path, buffer) {
    throw new Error("not supported in Node.js context"); /** NODE ONLY **/
    cache.module.FS.writeFile(path, buffer);
    return;
}

/**
 * This is intended for use in web browsers to clean up after {@linkcode writeFile}.
 * Node applications should not call this function.
 *
 * @param {string} path - Path to the file on the virtual file system.
 *
 * @return Deletes the specified file from the virtual file system.
 */
export function removeFile(path) {
    throw new Error("not supported in Node.js context"); /** NODE ONLY **/
    cache.module.FS.unlink(path);
    return;
}

/**
 * This is intended for use in web browsers.
 * Node applications should not call this function.
 *
 * @param {string} path - Path to the file on the virtual file system.
 * @return {boolean} Whether the file exists.
 */
export function fileExists(path) {
    throw new Error("not supported in Node.js context"); /** NODE ONLY **/
    return cache.module.FS.analyzePath(path).exists;
}
