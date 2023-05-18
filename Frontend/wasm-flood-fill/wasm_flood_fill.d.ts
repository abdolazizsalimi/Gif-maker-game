/* tslint:disable */
/* eslint-disable */
/**
* Returns an updated u8 buffer
* From JS: pass a UInt8ClampedArray for the Clamped<Vec<u8>>
* 
* * `ctx` - the 2d rendering context
* * `data` - the UInt8ClampedArray data of ImageData#data
* * `start_x` - the x coordinate on the canvas
* * `start_x` - the y coordinate on the canvas
* * `r` - the red in the RGB fill color
* * `g` - the green in the RGB fill color
* * `b` - the blue in the RGB fill color
* * `a` - the opacity in the RGB fill color
* * `tolerance` - the tolerance
* @param {CanvasRenderingContext2D} ctx
* @param {Uint8ClampedArray} data
* @param {number} start_x
* @param {number} start_y
* @param {number} r
* @param {number} g
* @param {number} b
* @param {number} a
* @param {number} tolerance
* @returns {Uint8ClampedArray}
*/
export function flood_fill(ctx: CanvasRenderingContext2D, data: Uint8ClampedArray, start_x: number, start_y: number, r: number, g: number, b: number, a: number, tolerance: number): Uint8ClampedArray;
