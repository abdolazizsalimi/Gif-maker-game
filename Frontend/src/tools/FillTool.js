import { hexToRGBA } from "@/utils/hexToRGBA";
import * as wff from "wasm-flood-fill";

export default class FillTool {
  startDrawing() {}
  draw() {}
  stopDrawing({ event, dp }) {
    const imageData = dp.draw_context.getImageData(0, 0, dp.width, dp.height);
    const { r, g, b } = hexToRGBA(dp.style.color);

    const data = wff.flood_fill(
      dp.draw_context,
      imageData.data,
      Math.round(event.offsetX),
      Math.round(event.offsetY), // Important that it is rounded before passing it to wasm
      r,
      g,
      b,
      dp.style.opacity,
      30, // color tolerance
    );
    dp.draw_context.putImageData(
      new ImageData(data, dp.width, dp.height),
      0,
      0,
    );
  }
}
