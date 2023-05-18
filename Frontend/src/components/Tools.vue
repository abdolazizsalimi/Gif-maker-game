<template>
  <div class="container">
    <div
      class="tool-container group"
      v-for="{ name, blob, onclick } in tools"
      :key="name"
    >
      <div
        :class="{ selected: selected_tool === name, blob }"
        class="tool"
        :id="name"
        @click="onclick"
      >
        <img :src="require(`@/assets/svg/${name}.svg`)" draggable="false" />
      </div>
    </div>

    <div class="tool-modifier-container">
      <!-- Shape Modifiers -->
      <div
        class="tool-modifier-shape-container"
        v-if="selected_tool_modifier === 'shapes'"
      >
        <div
          v-for="modifier in tool_modifier_shapes"
          :key="modifier"
          class="tool-modifier-shape"
          :class="{ selected: selected_shape_modifier === modifier }"
          @click="() => selectShapeModifier(modifier)"
        >
          <svg
            v-if="modifier === 'circle'"
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
          >
            <circle cx="16" cy="16" r="14" stroke="#4D1BB6" stroke-width="4" />
          </svg>
          <svg
            v-if="modifier === 'line'"
            width="30"
            height="32"
            viewBox="0 0 30 32"
            fill="none"
          >
            <line
              x1="2"
              y1="-2"
              x2="37.7995"
              y2="-2"
              transform="matrix(0.703526 -0.710669 0.703526 0.710669 2 31.2843)"
              stroke="#4D1BB6"
              stroke-width="4"
              stroke-linecap="round"
            />
          </svg>
          <svg
            v-if="modifier === 'triangle'"
            width="37"
            height="32"
            viewBox="0 0 37 32"
            fill="none"
          >
            <path
              d="M21.3515 3.62595L34.0229 25.177C35.2547 27.2718 33.7525 30 31.1392 30H5.79634C3.18307 30 1.6809 27.2718 2.9126 25.177L15.584 3.62595C16.8587 1.45802 20.0768 1.45802 21.3515 3.62595Z"
              stroke="#4D1BB6"
              stroke-width="4"
            />
          </svg>
          <svg
            v-if="modifier === 'square'"
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
          >
            <rect
              x="2"
              y="2"
              width="28"
              height="28"
              rx="6"
              stroke="#4D1BB6"
              stroke-width="4"
            />
          </svg>
        </div>
      </div>

      <!-- Opacity Modifiers -->
      <div
        class="tool-modifier-opacity-container"
        v-if="selected_tool_modifier === 'opacity'"
      >
        <Slider
          :startingValue="opacity * 100"
          :min="20"
          :max="100"
          @update:value="(value) => $emit('update:opacity', value / 100)"
        />
      </div>

      <!-- Thickness Modifiers -->
      <div
        class="tool-modifier-thickness-container"
        v-if="selected_tool_modifier === 'thickness'"
      >
        <Slider
          :startingValue="thickness"
          :min="4"
          :max="28"
          @update:value="(value) => $emit('update:thickness', value)"
          thickness
        />
      </div>
    </div>
  </div>
</template>

<script>
import Slider from "@/components/Slider.vue";

export default {
  name: "tools",
  components: { Slider },
  props: {
    thickness: Number,
    opacity: Number,
  },
  emits: [
    "onToolChange",
    "onUndo",
    "onRedo",
    "onClear",
    "update:thickness",
    "update:opacity",
  ],
  data() {
    return {
      value: 20,
      selected_tool: "none",
      tools: [
        {
          name: "pen",
          blob: true,
          onclick: () => this.selectTool("pen", "thickness"),
        },
        {
          name: "shapes",
          blob: true,
          onclick: () => this.selectTool("shapes", "shapes"),
        },
        {
          name: "fill",
          blob: true,
          onclick: () => this.selectTool("fill", "opacity"),
        },
        {
          name: "eraser",
          blob: true,
          onclick: () =>
            this.clear_long_press_handle != null &&
            this.selectTool("eraser", "thickness"),
        },
        { name: "undo", onclick: () => this.$emit("onUndo") },
        { name: "redo", onclick: () => this.$emit("onRedo") },
      ],
      selected_tool_modifier: "none",
      selected_shape_modifier: "square",
      tool_modifier_shapes: ["square", "circle", "triangle", "line"],
      clear_long_press_handle: null,
    };
  },

  mounted() {
    // shortcuts
    window.addEventListener("keyup", (event) => {
      if (event.ctrlKey && event.code === "KeyZ") {
        //  ctrl + z : undoing shortcut
        this.$emit("onUndo");
      } else if (event.ctrlKey && event.code === "KeyY") {
        //  ctrl + y : redoing shortcut
        this.$emit("onRedo");
      } else if (event.code === "KeyF") {
        //  f : fill shortcut
        this.selectTool("fill", "opacity");
      } else if (event.code === "KeyP") {
        //  p : pen shortcut
        this.selectTool("pen", "thickness");
      } else if (event.code === "KeyS") {
        //  s : shapes shortcut
        this.selectTool("shapes", "shapes");
      } else if (event.code === "KeyE") {
        //  e: eraser shortcut
        this.selectTool("eraser", "thickness");
      }
    });
    this.selectTool("pen", "thickness");

    const eraser = document.getElementById("eraser");
    eraser.addEventListener("mousedown", this.startLongPress);
    eraser.addEventListener("touchstart", this.startLongPress);

    eraser.addEventListener("click", this.stopLongPress);
    eraser.addEventListener("mouseout", this.stopLongPress);
    eraser.addEventListener("touchend", this.stopLongPress);
    eraser.addEventListener("touchcancel", this.stopLongPress);
  },

  methods: {
    startLongPress(event) {
      if (
        (event.type === "click" && event.button !== 0) ||
        this.clear_long_press_handle != null
      )
        return;
      this.clear_long_press_handle = setTimeout(() => {
        this.$emit("onClear");
        clearTimeout(this.clear_long_press_handle);
        this.clear_long_press_handle = null;
      }, 1000);
    },
    stopLongPress() {
      if (this.clear_long_press_handle == null) return;
      clearTimeout(this.clear_long_press_handle);
      this.clear_long_press_handle = null;
    },

    selectTool(tool, modifier = "none") {
      this.selected_tool = tool;
      this.selected_tool_modifier = modifier;

      if (this.selected_tool === "shapes")
        this.$emit("onToolChange", this.selected_shape_modifier);
      else this.$emit("onToolChange", tool);
    },

    selectShapeModifier(modifier) {
      this.selected_shape_modifier = modifier;
      this.$emit("onToolChange", modifier);
    },
  },
};
</script>

<style scoped>
.container {
  @apply relative w-[129px] h-[300px] p-3 bg-tools-container rounded-xl grid grid-cols-2 grid-rows-5 gap-2;
}

.tool-container {
  @apply relative rounded-[15px];
}

.tool {
  @apply w-12 h-12 flex justify-start items-center cursor-pointer p-2 rounded-[15px] bg-[#f7f4ff] transition-all;
  @apply group-hover:bg-[#D2C7FF] duration-[250ms];
}

.tool > img {
  @apply transition w-[30px] h-[30px] group-active:scale-110;
}

#undo > img {
  @apply group-active:rotate-[-45deg] group-active:scale-100;
}

#redo > img {
  @apply group-active:rotate-45 group-active:scale-100;
}

.blob {
  @apply absolute;
}

.blob.selected {
  @apply translate-x-2 w-24 transition-all duration-[250ms];
  @apply group-hover:bg-[#f7f4ff];
}

.tool-modifier-container {
  @apply w-12 h-[219px] rounded-[15px] bg-[#f7f4ff] z-[2] col-start-2;
  grid-row: 1 / span 4;
}

.tool-modifier-shape-container {
  @apply flex flex-col justify-between items-center h-full w-full;
}

.tool-modifier-shape {
  @apply w-12 h-12 p-3 rounded-[15px] flex items-center justify-center cursor-pointer;
  @apply hover:bg-[#D2C7FF] duration-[250ms];
}

.tool-modifier-shape.selected {
  @apply bg-[#D2C7FF];
}
.tool-modifier-shape svg {
  @apply transition;
}

.tool-modifier-shape.selected svg {
  @apply scale-[1.2];
}

.tool-modifier-thickness-container,
.tool-modifier-opacity-container {
  @apply h-full w-full px-0 py-3;
}
</style>
