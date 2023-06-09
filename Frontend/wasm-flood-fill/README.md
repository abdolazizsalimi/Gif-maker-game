# wasm-flood-fill

Implementation of a flood fill algorithm in Rust for WebAssembly.

This is an experimentation with WebAssembly to speed-up CPU intensive operations (flood-fill on large canvas).

## Usage

```typescript
import * as wasm from 'wasm-flood-fill'

const startX: number;
const startY: number;
const color: {r, g, b}: {r: number, g: number, b: number};
const context: CanvasRenderingContext2D;
const {width, height} = context.canvas;
const imageData = context.getImageData(0, 0, width, height);

const data = wasm.flood_fill(
  context,
  imageData.data,
  Math.round(startX), Math.round(startY), // Important that it is rounded before passing it to wasm
  r, g, b, a,
  200 // color tolerance
);

context.putImageData(new ImageData(data, width, height), 0, 0);
```

Benchmarks between an equivalent function implemented in JavaScript shows an improvement in speed of 3 to 5 times for the wasm version.
One flood fill takes ~50-60ms in wasm and ~230ms in JS for a 800x660 canvas.
