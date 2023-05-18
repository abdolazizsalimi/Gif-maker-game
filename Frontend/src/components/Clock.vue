<template>
  <svg viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle class="body" cx="75" cy="75" r="72" stroke-width="6" />
    <g class="progress">
      <circle cx="75" cy="75" r="63" v-if="progressCompleted" />
      <path
        v-if="!progressCompleted"
        :d="`M75,75 L75,12 A63,63 0 ${largeArcSweep},0 ${end.x},${end.y} z`"
      />
    </g>
  </svg>
</template>

<script>
export default {
  props: {
    value: { type: Number, default: 0 },
    max: { type: Number, default: 100 },
    width: { type: Number, default: 150 },
    height: { type: Number, default: 150 },
  },

  computed: {
    end() {
      return {
        x: 75 - 63 * Math.sin(Math.PI * 2.0 * (this.value / this.max)),
        y: 75 - 63 * Math.cos(Math.PI * 2.0 * (this.value / this.max)),
      };
    },
    largeArcSweep() {
      return this.value / this.max > 0.5 ? 1 : 0;
    },
    progressCompleted() {
      return this.max - this.value <= 0.05;
    },
  },
};
</script>

<style scoped>
.body {
  fill: #4d1bb6;
  stroke: #ffffff;
}
.progress {
  fill: #ffffff;
}
</style>
