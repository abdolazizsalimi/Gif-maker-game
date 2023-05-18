<template>
  <div class="relative button-container">
    <div class="absolute top-2 h-full w-full bg-[#C0BDFF] rounded-2xl" />
    <button
      :disabled="disabled"
      @click="clicked"
      class="
        w-full
        button
        relative
        flex
        items-center
        justify-center
        gap-3
        rounded-2xl
        h-16
        px-7
        active:translate-y-2
        focus:outline-none
        cursor-pointer
        bg-[#F6F4FF]
        disabled:bg-[#D6D4DD] disabled:translate-y-2 disabled:cursor-default
      "
    >
      <img
        v-if="icon"
        class="pointer-events-none"
        :src="require(`@/assets/svg/${icon}.svg`)"
        draggable="false"
      />
      <slot />
    </button>
  </div>
</template>

<script>
export default {
  name: "Button",
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
      default: undefined,
    },
  },

  emits: ["onClick"],
  methods: {
    clicked(event) {
      this.$emit("onClick", event);
    },
  },
};
</script>

<style scoped>
.button-container {
  width: fit-content;
  height: fit-content;
}
.button {
  font-family: Candy Beans;
  font-style: normal;
  font-weight: normal;
  font-size: 33px;
  line-height: 42.75px;

  color: #4d1bb6;
}
</style>
