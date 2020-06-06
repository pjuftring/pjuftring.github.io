import { array_buffer_from_f32_array, create_program_from_sources, get_uniform_location, set_uniform_matrix, set_uniform_float, log, draw } from './snippets/gl-2a10df21248283f2/src/helper.js';
import * as __wbg_star0 from './snippets/gl-2a10df21248283f2/src/helper.js';

let wasm;

const heap = new Array(32).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachegetUint8Memory0 = null;
function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

let cachegetFloat32Memory0 = null;
function getFloat32Memory0() {
    if (cachegetFloat32Memory0 === null || cachegetFloat32Memory0.buffer !== wasm.memory.buffer) {
        cachegetFloat32Memory0 = new Float32Array(wasm.memory.buffer);
    }
    return cachegetFloat32Memory0;
}

function getArrayF32FromWasm0(ptr, len) {
    return getFloat32Memory0().subarray(ptr / 4, ptr / 4 + len);
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}
/**
*/
export class App {

    static __wrap(ptr) {
        const obj = Object.create(App.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_app_free(ptr);
    }
    /**
    */
    constructor() {
        var ret = wasm.app_new();
        return App.__wrap(ret);
    }
    /**
    * @param {number} time
    */
    draw_loop(time) {
        wasm.app_draw_loop(this.ptr, time);
    }
}

async function load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {

        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {

        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

async function init(input) {
    if (typeof input === 'undefined') {
        input = import.meta.url.replace(/\.js$/, '_bg.wasm');
    }
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbg_log_8c798782e31062ea = function(arg0, arg1) {
        log(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbg_arraybufferfromf32array_7ccd2082e25f7aea = function(arg0, arg1) {
        var ret = array_buffer_from_f32_array(getArrayF32FromWasm0(arg0, arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_createprogramfromsources_6970833f4f135439 = function(arg0, arg1, arg2, arg3) {
        var ret = create_program_from_sources(getStringFromWasm0(arg0, arg1), getStringFromWasm0(arg2, arg3));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_getuniformlocation_197d08ba0ed2c524 = function(arg0, arg1, arg2) {
        var ret = get_uniform_location(getObject(arg0), getStringFromWasm0(arg1, arg2));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_setuniformmatrix_89fc4ee6a437a7ab = function(arg0, arg1, arg2, arg3) {
        set_uniform_matrix(getObject(arg0), getObject(arg1), getArrayF32FromWasm0(arg2, arg3));
    };
    imports.wbg.__wbg_setuniformfloat_81a101a37dabdd9f = function(arg0, arg1, arg2) {
        set_uniform_float(getObject(arg0), getObject(arg1), arg2);
    };
    imports.wbg.__wbg_draw_f23f05f2e58b150e = function(arg0, arg1, arg2, arg3) {
        draw(getObject(arg0), getObject(arg1), arg2, getObject(arg3));
    };
    imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
        takeObject(arg0);
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };
    imports['./snippets/gl-2a10df21248283f2/src/helper.js'] = __wbg_star0;

    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
        input = fetch(input);
    }

    const { instance, module } = await load(await input, imports);

    wasm = instance.exports;
    init.__wbindgen_wasm_module = module;

    return wasm;
}

export default init;

