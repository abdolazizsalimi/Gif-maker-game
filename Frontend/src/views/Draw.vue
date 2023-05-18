<template>
  <div class="draw">
    <div class="round hidden">2 / 2</div>
    <div class="clock">
      <Clock :value="timer.remaining" :max="timer.duration" />
    </div>
    <Button
      class="row-start-3 col-start-3 min-w-full"
      @onClick="submit"
      :disabled="submitted"
      >Done</Button
    >
    <Button
      class="row-start-3 col-start-1 min-w-full"
      @onClick="downloadResult"
      icon="download"
    />
    <div class="colors">
      <div
        v-for="color in colors"
        :key="color"
        class="color"
        :style="{ background: color }"
        @click="style.color = color"
      />
      <div class="colors-footer">
        <div class="color-picker-button" @click.stop="toggleColorPicker">
          <img src="~@/assets/svg/spectrum.svg" />
          <ColorInput
            ref="color_picker"
            v-model="style.color"
            format="hex string"
            position="right bottom"
            disable-text-inputs
          />
        </div>
        <div
          class="selected-color"
          :style="{
            backgroundColor: style.color,
          }"
        />
      </div>
    </div>
    <div class="center">
      <h3 class="sentence">{{ sentence }}</h3>
      <DrawingPad
        class="drawing-pad"
        ref="drawing_pad"
        :tool-type="tool_type"
        :style="style"
        :width="790"
        :height="470"
      />
    </div>
    <Tools
      class="tools"
      @onToolChange="(new_tool_type) => (tool_type = new_tool_type)"
      @onRedo="$refs.drawing_pad.redoDrawing()"
      @onUndo="$refs.drawing_pad.undoDrawing()"
      @onClear="$refs.drawing_pad.clearCanvas()"
      v-model:thickness="style.thickness"
      v-model:opacity="style.opacity"
    />
  </div>
</template>

<script>
import RoomService from "@/services/room.service";
import DrawingPad from "@/components/DrawingPad.vue";
import Clock from "@/components/Clock.vue";
import Tools from "@/components/Tools.vue";
import Button from "@/components/Button.vue";
import ColorInput from "vue-color-input";

export default {
  name: "DrawView",
  components: {
    DrawingPad,
    Clock,
    Tools,
    ColorInput,
    Button,
  },

  data() {
    return {
      timer: { remaining: 120.0, duration: 120.0, handle: null },
      colors: [
        "#121111",
        "#87878A",
        "#FCFCFC",

        "#FF1717",
        "#FE800C",
        "#FCD922",

        "#075C00",
        "#06AB48",
        "#78F019",

        "#002278",
        "#293CE1",
        "#70DDDD",

        "#4900A7",
        "#A229DB",
        "#F04180",

        "#3C1C0A",
        "#4F3F06",
        "#CB8B2A",
      ],
      style: {
        color: "#000000",
        thickness: 4.0,
        opacity: 1.0,
      },
      is_picker_open: false,
      tool_type: "pen",
      submitted: false,
      roomService: new RoomService(),
    };
  },

  mounted() {
    // check if the user is logged in, if not redirect to login
    if (!this.$store.state.auth.status.logged_in) this.$router.push("/login");
    // check if use is inside a room, if not logout and redirect to login
    else if (!this.$store.state.game.current) {
      this.$store
        .dispatch("auth/logout")
        .then(() => this.$router.push("/login"));
    }

    // setup timer
    this.timer.handler = setInterval(() => {
      if (this.timer.remaining > 0) this.timer.remaining -= 0.1;
      else {
        this.timer.remaining = 0;
        clearInterval(this.timer.handle);
      }
    }, 100);
  },

  unmounted() {
    clearInterval(this.timer.handle);
    this.submitted = false;
  },
  computed: {
    sentence() {
      return this.$store.state.game?.next?.payload;
    },
    game() {
      return this.$store.state.game?.current;
    },
  },
  methods: {
    downloadResult() {
      const link = document.createElement("a");
      link.download = "my-drawing.png";
      link.href = this.$refs.drawing_pad.serialize();
      console.log(link);
      link.click();
    },
    submit() {
      if (!this.submitted) {
        this.roomService.submit({
          game_id: this.game._id,
          payload: this.$refs.drawing_pad.serialize(),
        });
        this.submitted = true;
      }
    },
    toggleColorPicker() {
      if (this.is_picker_open) this.$refs.color_picker.pickEnd();
      else this.$refs.color_picker.pickStart();
      this.is_picker_open = !this.is_picker_open;
    },
  },
};
</script>

<style scoped>
.draw {
  @apply grid gap-6 place-content-center;
}

.round {
  @apply row-start-1 row-span-1 col-start-1 col-span-1 self-center;
  font-family: Candy Beans;
  font-style: normal;
  font-weight: normal;
  font-size: 57px;
  line-height: 98px;
  text-align: center;

  color: #4d1bb6;
}

.clock {
  @apply row-start-1 row-span-1 col-start-3 col-span-1 px-[11px];
}

.download {
  @apply row-start-3 row-span-1 col-start-1 col-span-1;
  width: 129px;
  height: 54px;
  cursor: pointer;

  background: #f6f4ff;
  border-radius: 16px;
}

/* colors */
.colors {
  @apply col-start-1 row-start-2;
  width: 129px;
  height: 300px;
  padding: 8.25px;

  background: rgba(14, 12, 9, 0.3);
  border-radius: 12px;

  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: repeat(6, 1fr) auto;
}

.colors .color {
  width: 30px;
  height: 30px;
  margin: 3.25px;
  cursor: pointer;

  background: #fcfcfc;
  border: 2px solid #fff8ef;
  border-radius: 12px;
}

.colors :deep(.color-input.user .box) {
  display: none;
}

.colors :deep(.color-input.user) {
  align-self: flex-start;
  justify-self: center;
}

.colors :deep(.color-input.user .picker-popup) {
  border-radius: 5px;
  padding-top: 5px;
}

.colors .colors-footer {
  display: flex;
  justify-content: space-between;
  margin: 9px 5px 5px;

  grid-row-start: 7;
  grid-row-end: 8;
  grid-column-start: 1;
  grid-column-end: 4;
}

.colors .color-picker-button {
  cursor: pointer;
  width: 48px;
  height: 48px;
  padding: 4px;

  background: #fff8ef;
  border-radius: 15px;

  display: flex;
  justify-content: center;
  align-items: center;
}

.colors .selected-color {
  width: 48px;
  height: 48px;
  border: 2px solid #ffffff;
  box-sizing: border-box;
  border-radius: 15px;
}

/* Tools */
.tools {
  @apply col-start-3 row-start-2;
}

/* Center */
.center {
  @apply col-start-2 row-span-3 flex flex-col justify-between items-center rounded-3xl gap-4;
  padding: 21px 16px 16px;

  background: rgba(14, 12, 9, 0.3);
}

.center .sentence {
  height: 64.5px;
  max-width: 790.5px;
  text-align: center;

  font-family: Catamaran;
  font-style: normal;
  font-weight: normal;
  font-size: 27px;
  line-height: 150%;

  display: flex;
  align-items: center;
  text-align: center;

  color: #f7f4ff;
  background-color: transparent;
}

.center > .drawing-pad {
  border-radius: 24px;
  overflow: hidden;
  width: 790px;
  height: 470px;
}
</style>
