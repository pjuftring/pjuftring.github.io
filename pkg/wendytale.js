import { set_background, new_image, get_null_image, get_text_width } from './snippets/wendytale-708d8ccb4e72f1d8/src/glue.js';

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

let cachegetUint8Memory0 = null;
function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory0;
}

function getArrayU8FromWasm0(ptr, len) {
    return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

let stack_pointer = 32;

function addBorrowedObject(obj) {
    if (stack_pointer == 1) throw new Error('out of js stack');
    heap[--stack_pointer] = obj;
    return stack_pointer;
}
/**
* @param {any} ctx
*/
export function game_start(ctx) {
    try {
        wasm.game_start(addBorrowedObject(ctx));
    } finally {
        heap[stack_pointer++] = undefined;
    }
}

/**
* @param {any} ctx
* @param {number} time
*/
export function game_step(ctx, time) {
    try {
        wasm.game_step(addBorrowedObject(ctx), time);
    } finally {
        heap[stack_pointer++] = undefined;
    }
}

/**
* @param {number} char_code
*/
export function game_keydown(char_code) {
    wasm.game_keydown(char_code);
}

/**
* @param {number} char_code
*/
export function game_keyup(char_code) {
    wasm.game_keyup(char_code);
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
        input = new URL('wendytale_bg.wasm', import.meta.url);
    }
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
        takeObject(arg0);
    };
    imports.wbg.__wbg_newimage_a1b503c548ec2432 = function(arg0, arg1) {
        var ret = new_image(getArrayU8FromWasm0(arg0, arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_drawImage_28cc59e5efba5adb = function(arg0, arg1, arg2, arg3) {
        getObject(arg0).drawImage(getObject(arg1), arg2, arg3);
    };
    imports.wbg.__wbg_setbackground_d2a472764c024bf6 = function(arg0, arg1) {
        set_background(getArrayU8FromWasm0(arg0, arg1));
    };
    imports.wbg.__wbg_drawImage_392219649e439053 = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
        getObject(arg0).drawImage(getObject(arg1), arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9);
    };
    imports.wbg.__wbg_setglobalAlpha_6c6aa2e455dce489 = function(arg0, arg1) {
        getObject(arg0).globalAlpha = arg1;
    };
    imports.wbg.__wbg_gettextwidth_47b3af16020b8bd6 = function(arg0, arg1, arg2) {
        var ret = get_text_width(getObject(arg0), getStringFromWasm0(arg1, arg2));
        return ret;
    };
    imports.wbg.__wbg_fillRect_29a060885cf27ed4 = function(arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).fillRect(arg1, arg2, arg3, arg4);
    };
    imports.wbg.__wbg_setfillStyle_288a3d9917027178 = function(arg0, arg1, arg2) {
        getObject(arg0).fillStyle = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_fillText_98dc44deb47a5327 = function(arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).fillText(getStringFromWasm0(arg1, arg2), arg3, arg4);
    };
    imports.wbg.__wbg_log_6dffe2549c2f4d21 = function(arg0, arg1) {
        console.log(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbg_clearRect_9a969770171ea4a2 = function(arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).clearRect(arg1, arg2, arg3, arg4);
    };
    imports.wbg.__wbg_getnullimage_0874ae1b70e88195 = function() {
        var ret = get_null_image();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_scale_5c87a566e2a52a1e = function(arg0, arg1, arg2) {
        getObject(arg0).scale(arg1, arg2);
    };
    imports.wbg.__wbg_setimageSmoothingEnabled_d72a67dcbc747a50 = function(arg0, arg1) {
        getObject(arg0).imageSmoothingEnabled = arg1 !== 0;
    };

    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
        input = fetch(input);
    }



    const { instance, module } = await load(await input, imports);

    wasm = instance.exports;
    init.__wbindgen_wasm_module = module;

    return wasm;
}

export default init;

