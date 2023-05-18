<template>
  <div class="result p-5 rounded-3xl grid grid-flow-col bg-acrylic gap-6 h-4/5">
    <div
      v-if="room"
      class="
        overflow-y-auto
        no-scrollbar
        flex flex-col
        gap-3
        p-4
        border-4
        rounded-2xl
        w-80
        h-full
        max-w-xs
      "
    >
      <div
        v-for="player in room.players"
        :key="player.id"
        class="flex gap-3 items-end rounded-2xl p-3"
        :class="{ selected: player.id == selected }"
        @click="selected = player.id"
      >
        <div
          class="
            border-[2px] border-[#F6F4FF]
            p-0
            rounded-full
            flex
            justify-center
            items-center
            w-[80px]
            h-[80px]
            min-w-[80px] min-h-[80px]
          "
        >
          <img
            class="h-full w-full"
            :src="require(`@/assets/svg/avatars/${player.avatar}.svg`)"
            draggable="false"
          />
        </div>
        <span
          class="
            rounded-2xl
            bg-acrylic
            w-full
            h-fit
            p-2
            border-4 border-[#F6F4FF]
          "
          >{{ player.username }}</span
        >
      </div>
    </div>
    <div
      class="
        p-4
        border-4
        rounded-2xl
        flex flex-col
        gap-3
        h-full
        w-[500px]
        overflow-y-auto
        no-scrollbar
      "
    >
      <div
        class="m-6 indicator"
        :v-if="result.timeline"
        v-for="(sender, index) in reversePair[selected]"
        :key="index"
      >
        <div
          class="
            indicator-item indicator-bottom indicator-start
            border-[2px] border-[#F6F4FF]
            p-0
            rounded-full
            flex
            justify-center
            items-center
            w-[50px]
            h-[50px]
          "
        >
          <img
            class="h-full w-full"
            :src="require(`@/assets/svg/avatars/${sender.player.avatar}.svg`)"
            draggable="false"
          />
        </div>
        <div
          v-if="sender.room_type === 'sentence'"
          class="bg-[#F4F4FF] text-black font-robot p-6 rounded-2xl font-bold"
        >
          {{ sender.payload }}
        </div>
        <img
          v-else-if="sender.room_type === 'draw'"
          class="bg-[#F4F4FF] text-black font-robot p-6 rounded-2xl font-bold"
          :src="sender.payload"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "JoinView",
  data() {
    return {
      selected: "",
    };
  },
  mounted() {
    this.selected = this.room?.players[0].id;
  },
  computed: {
    room() {
      return this.$store.state.game.current?.room;
    },
    result() {
      return this.$store.state.game.current;
    },
    currentUser() {
      return this.$store.state.auth.user;
    },
    reversePair() {
      const pair = this.result.room.players.reduce(
        (acu, player) => Object.assign(acu, { [player.id]: [] }),
        {},
      );
      for (
        let i = 0;
        i < this.result.pairs[Object.keys(this.result.pairs)[0]].length;
        i++
      ) {
        for (const player in this.result.pairs) {
          pair[this.result.pairs[player][i]].push({
            player: this.result.room.players.find((p) => p.id == player),
            payload: this.result.timeline[this.result.pairs[player][i]][i],
            room_type: this.result.rounds[i].room_type,
          });
        }
      }
      return pair;
    },
  },
};
</script>

<style scoped>
.selected {
  @apply bg-acrylic;
}
</style>
