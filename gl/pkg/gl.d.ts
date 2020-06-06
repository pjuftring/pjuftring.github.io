/* tslint:disable */
/* eslint-disable */
/**
*/
export class App {
  free(): void;
/**
*/
  constructor();
/**
* @param {number} time 
*/
  draw_loop(time: number): void;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_app_free: (a: number) => void;
  readonly app_new: () => number;
  readonly app_draw_loop: (a: number, b: number) => void;
}

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
        