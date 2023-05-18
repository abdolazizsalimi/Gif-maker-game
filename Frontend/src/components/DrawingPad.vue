<template>
  <div class="drawing-pad-root relative">
    <canvas
      ref="draw_canvas"
      class="absolute top-0 left-0 touch-none"
      :width="this.width"
      :height="this.height"
      :style="{ cursor: cursor }"
    />
    <canvas
      ref="preview_canvas"
      class="absolute top-0 left-0 touch-none"
      :width="this.width"
      :height="this.height"
      :style="{ cursor: cursor }"
    />
  </div>
</template>

<script>
import {
  NoneTool,
  PenTool,
  SquareTool,
  CircleTool,
  TriangleTool,
  LineTool,
  FillTool,
  EraserTool,
} from "@/tools";

class DrawHistory {
  history = [];
  pointer = -1;
  MAX_HISTORY = 10;

  push(data) {
    this.history = this.history.slice(0, this.pointer + 1);
    if (this.history.length >= this.MAX_HISTORY) {
      this.history.shift();
      this.pointer--;
    }

    this.history.push(data);
    this.pointer++;
  }

  forward() {
    if (this.pointer >= this.history.length - 1)
      return this.history[this.pointer];
    // increment pointer then return the data
    return this.history[++this.pointer];
  }

  backward() {
    if (this.pointer <= 0) return this.history[this.pointer];
    // decrement pointer then return the data
    return this.history[--this.pointer];
  }

  reset() {
    this.history = [];
    this.pointer = -1;
  }
}

export default {
  name: "DrawingPad",
  props: {
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    style: {
      type: Object,
      default: function () {
        return { color: "#000000", thickness: 5.0 };
      },
    },
    toolType: { type: String, default: "pen" },
  },

  data() {
    return {
      is_drawing: false,
      draw_context: null,
      preview_context: null,
      history: new DrawHistory(),
      tool: null,
      strategies: {
        pen: PenTool,
        square: SquareTool,
        circle: CircleTool,
        triangle: TriangleTool,
        line: LineTool,
        fill: FillTool,
        eraser: EraserTool,
      },
      cursor: "default",
    };
  },

  mounted() {
    this.tool =
      this.toolType in this.strategies
        ? new this.strategies[this.toolType]()
        : new NoneTool();

    const draw_canvas = this.$refs.draw_canvas;
    const preview_canvas = this.$refs.preview_canvas;
    this.draw_context = draw_canvas.getContext("2d");
    this.preview_context = preview_canvas.getContext("2d");
    // mouse listeners
    preview_canvas.addEventListener("mousedown", this.startDrawing, false);
    preview_canvas.addEventListener("mousemove", this.draw, false);
    preview_canvas.addEventListener("mouseup", this.stopDrawing, false);
    preview_canvas.addEventListener("mouseout", this.stopDrawing, false);
    // touch listeners
    preview_canvas.addEventListener("touchstart", this.startDrawing, false);
    preview_canvas.addEventListener("touchmove", this.draw, false);
    preview_canvas.addEventListener("touchend", this.stopDrawing, false);
    // pointer
    preview_canvas.addEventListener("pointerdown", this.startDrawing, false);
    preview_canvas.addEventListener("pointermove", this.draw, false);
    preview_canvas.addEventListener("pointerup", this.stopDrawing, false);

    this.clearCanvas();
  },

  methods: {
    startDrawing(event) {
      if (event.button != 0 || this.is_drawing) return;

      this.is_drawing = true;

      this.tool.startDrawing({ event, dp: this });
      if (event.cancelable) event.preventDefault();
    },

    draw(event) {
      if (!this.is_drawing) return;
      this.tool.draw({ event, dp: this });
    },

    stopDrawing(event) {
      if (!this.is_drawing) return;

      this.is_drawing = false;

      this.tool.stopDrawing({ event, dp: this });

      // push state of drawing in history stack
      this.history.push(
        this.draw_context.getImageData(0, 0, this.width, this.height),
      );
      if (event.cancelable) event.preventDefault();
    },

    clearCanvas() {
      this.draw_context.fillStyle = "#F6F4FF";
      this.draw_context.fillRect(0, 0, this.width, this.height);
      // push state of drawing in history stack
      this.history.push(
        this.draw_context.getImageData(0, 0, this.width, this.height),
      );
    },

    redoDrawing() {
      this.draw_context.putImageData(this.history.forward(), 0, 0);
    },

    undoDrawing() {
      this.draw_context.putImageData(this.history.backward(), 0, 0);
    },

    serialize() {
      return this.$refs.draw_canvas.toDataURL("image/png");
    },

    // eslint-disable-next-line no-unused-vars
    deserialize(data) {},
  },

  computed: {
    canRedoDrawing() {
      return this.history.pointer < this.history.history.length - 1;
    },

    canUndoDrawing() {
      return this.history.pointer > 0;
    },
  },

  watch: {
    toolType(newToolType) {
      this.tool =
        newToolType in this.strategies
          ? new this.strategies[newToolType]()
          : new NoneTool();
    },
    style(newStyle) {
      this.cursor = `url("data:image/svg+xml,<svg version='1.1' fill='none' stroke='none' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='${
        newStyle.thickness
      }px' height='${newStyle.thickness}px' viewBox='0 0 ${
        2 * newStyle.thickness + 4
      } ${
        2 * newStyle.thickness + 4
      }' xml:space='preserve'> <path fill='none' stroke='black' stroke-width='3' d='M ${
        newStyle.thickness + 2
      }, ${newStyle.thickness + 2} m -${newStyle.thickness}, 0 a ${
        newStyle.thickness
      },${newStyle.thickness} 0 1,0 ${2 * newStyle.thickness},0 a ${
        newStyle.thickness
      },${newStyle.thickness} 0 1,0 -${
        2 * newStyle.thickness
      },0'/><path  fill='none' stroke='rgb(252, 252, 252)' stroke-width='3' d='M ${
        newStyle.thickness + 2
      }, ${newStyle.thickness + 2} m -${newStyle.thickness - 2}, 0 a ${
        newStyle.thickness - 2
      },${newStyle.thickness - 2} 0 1,0 ${2 * (newStyle.thickness - 2)},0 a ${
        newStyle.thickness - 2
      },${newStyle.thickness - 2} 0 1,0 -${
        2 * (newStyle.thickness - 2)
      },0'/> </svg>") ${newStyle.thickness / 2.0} ${
        newStyle.thickness / 2.0
      }, default`;
    },
  },
};
</script>
