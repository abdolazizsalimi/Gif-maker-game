<template>
  <div
    class="relative flex flex-col justify-between items-center w-full h-full"
  >
    <div ref="click_area" class="absolute inset-0 z-30 touch-none" />
    <div class="absolute top-[10px] bottom-[20px] w-[3px] bg-[#4D1BB6] z-0" />
    <div
      ref="thumb"
      class="
        absolute
        w-6
        h-6
        bg-[#4D1BB6]
        origin-center
        rounded-3xl
        border-[3px] border-[#F6F4FF]
        transition-all
        ease-linear
        duration-100
        z-20
      "
    />
    <div ref="starter" class="z-10">
      <svg class="w-5 h-5" viewBox="0 0 20 20" fill="none" v-if="thickness">
        <circle cx="10" cy="10" r="10" fill="#4D1BB6" />
        <circle
          cx="10"
          cy="10"
          r="5.5"
          stroke-width="3"
          fill="#4D1BB6"
          stroke="#F6F4FF"
        />
      </svg>
      <svg class="w-10 h-10" viewBox="0 0 40 40" fill="none" v-else>
        <circle
          cx="20"
          cy="20"
          r="18.5"
          fill="#F6F4FF"
          stroke-width="3"
          stroke="#4D1BB6"
        />
        <circle cx="20" cy="20" r="14" fill="#4d1bb6" fill-opacity="0.2" />
      </svg>
    </div>

    <svg ref="finisher" class="w-10 h-10 z-10" viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="20" fill="#4D1BB6" />
      <circle
        cx="20"
        cy="20"
        r="15.5"
        stroke-width="3"
        fill="#4D1BB6"
        stroke="#F6F4FF"
      />
    </svg>
  </div>
</template>

<script>
import { clamp, map } from "@/utils/maths";

export default {
  name: "slider",
  emits: ["update:value"],
  props: {
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 100,
    },
    startingValue: {
      type: Number,
      default: 0,
    },
    thickness: Boolean,
  },
  data() {
    return {
      value: this.startingValue,
      is_dragging: false,
    };
  },
  mounted() {
    const click_area = this.$refs.click_area;

    // mouse listeners
    click_area.addEventListener("mousedown", this.startDraging, false);
    click_area.addEventListener("mousemove", this.drag, false);
    click_area.addEventListener("mouseup", this.stopDraging, false);
    click_area.addEventListener("mouseout", this.stopDraging, false);
    // touch listeners
    click_area.addEventListener("touchstart", this.startDraging, false);
    click_area.addEventListener("touchmove", this.drag, false);
    click_area.addEventListener("touchend", this.stopDraging, false);
    // pointer
    click_area.addEventListener("pointerdown", this.startDraging, false);
    click_area.addEventListener("pointermove", this.drag, false);
    click_area.addEventListener("pointerup", this.stopDraging, false);

    const position = map(
      this.value,
      this.min,
      this.max,
      this.$refs.starter.clientHeight / 2.0,
      this.$refs.click_area.clientHeight -
        this.$refs.finisher.clientHeight / 2.0,
    );
    this.$refs.thumb.style.top = `${position - 12}px`;
  },
  unmounted() {
    const click_area = this.$refs.click_area;

    // mouse listeners
    click_area.removeEventListener("mousedown", this.startDraging, false);
    click_area.removeEventListener("mousemove", this.drag, false);
    click_area.removeEventListener("mouseup", this.stopDraging, false);
    click_area.removeEventListener("mouseout", this.stopDraging, false);
    // touch listeners
    click_area.removeEventListener("touchstart", this.startDraging, false);
    click_area.removeEventListener("touchmove", this.drag, false);
    click_area.removeEventListener("touchend", this.stopDraging, false);
    // pointer
    click_area.removeEventListener("pointerdown", this.startDraging, false);
    click_area.removeEventListener("pointermove", this.drag, false);
    click_area.removeEventListener("pointerup", this.stopDraging, false);
  },
  methods: {
    startDraging(event) {
      if (event.button != 0 || this.is_dragging) return;

      this.is_dragging = true;
      this.value = Math.round(
        map(
          clamp(
            event.offsetY,
            this.$refs.starter.clientHeight / 2.0,
            this.$refs.click_area.clientHeight -
              this.$refs.finisher.clientHeight / 2.0,
          ),
          this.$refs.starter.clientHeight / 2.0,
          this.$refs.click_area.clientHeight -
            this.$refs.finisher.clientHeight / 2.0,
          this.min,
          this.max,
        ),
      );
      if (event.cancelable) event.preventDefault();
    },

    drag(event) {
      if (!this.is_dragging) return;

      this.value = Math.round(
        map(
          clamp(
            event.offsetY,
            this.$refs.starter.clientHeight / 2.0,
            this.$refs.click_area.clientHeight -
              this.$refs.finisher.clientHeight / 2.0,
          ),
          this.$refs.starter.clientHeight / 2.0,
          this.$refs.click_area.clientHeight -
            this.$refs.finisher.clientHeight / 2.0,
          this.min,
          this.max,
        ),
      );
    },

    stopDraging(event) {
      if (!this.is_dragging) return;

      this.is_dragging = false;
      this.$emit("update:value", this.value);
      if (event.cancelable) event.preventDefault();
    },
  },
  watch: {
    value(newValue) {
      const position = map(
        newValue,
        this.min,
        this.max,
        this.$refs.starter.clientHeight / 2.0,
        this.$refs.click_area.clientHeight -
          this.$refs.finisher.clientHeight / 2.0,
      );
      this.$refs.thumb.style.top = `${position - 12}px`;
    },
  },
};
</script>
