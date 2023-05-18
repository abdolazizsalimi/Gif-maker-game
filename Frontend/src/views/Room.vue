<template>
  <div class="room p-5 rounded-3xl grid grid-flow-col bg-acrylic gap-6 h-4/5">
    <div
      v-if="room"
      class="
        row-span-2
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
        class="flex gap-3 items-end"
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
      <div
        v-for="_n in room.max_players - room.players.length"
        :key="_n"
        class="rounded-2xl bg-acrylic h-20 min-h-[80px]"
      />
    </div>
    <div
      class="
        bg-acrylic
        p-4
        border-4
        rounded-2xl
        grid grid-flow-row grid-cols-3
        gap-3
        h-[474px]
        overflow-y-auto
        no-scrollbar
      "
    >
      <button class="game-mode selected">
        <img
          class="w-9/12"
          :src="require(`@/assets/svg/gamemodes/normal.svg`)"
        />
        <strong class="font-black text-black font-roboto">NORMAL</strong>
      </button>

      <button class="game-mode" disabled>
          <img
          class="w-9/12"
          :src="require(`@/assets/svg/gamemodes/secret.svg`)"
        />
        <strong class="font-black text-black font-roboto">SECRET</strong>
      </button>
      <button class="game-mode" disabled>
          <img
          class="w-9/12"
          :src="require(`@/assets/svg/gamemodes/Knockoff.svg`)"
        />
        <strong class="font-black text-black font-roboto">KNOCKOFF</strong>
      </button>
      <button class="game-mode" disabled>
          <img
          class="w-9/12"
          :src="require(`@/assets/svg/gamemodes/timer.svg`)"
        />
        <strong class="font-black text-black font-roboto">SPEEDRUN</strong>
      </button>
      <button class="game-mode" disabled>
          <img
          class="w-9/12"
          :src="require(`@/assets/svg/gamemodes/score.svg`)"
        />
        <strong class="font-black text-black font-roboto">SCORE</strong>
      </button>
      <button class="game-mode" disabled>
          <img
          class="w-9/12"
          :src="require(`@/assets/svg/gamemodes/complement.svg`)"
        />
        <strong class="font-black text-black font-roboto">COMPLEMENT</strong>
      </button>
      <button class="game-mode" disabled>
          <img
          class="w-9/12"
          :src="require(`@/assets/svg/gamemodes/ice_breaker.svg`)"
        />
        <strong class="font-black text-black font-roboto">ICEBREAKER</strong>
      </button>
      <button class="game-mode" disabled>
          <img
          class="w-9/12"
          :src="require(`@/assets/svg/gamemodes/animation.svg`)"
        />
        <strong class="font-black text-black font-roboto">ANIMATION</strong>
      </button>
    </div>
    <div class="flex flex-row justify-evenly items-center">
      <Button icon="room" id="leave" @onClick="leaveRoom">Leave</Button>
      <div
        class="tooltip tooltip-open invisible"
        ref="copy_tooltip"
        data-tip="Copied!"
      >
        <Button icon="link" id="invite" class="visible" @onClick="invite"
          >Invite</Button
        >
      </div>
      <Button
        :class="{ hidden: game && game.creator != currentUser.id }"
        icon="play"
        id="start"
        @onClick="startGame"
        >Start</Button
      >
    </div>
  </div>
</template>

<script>
import Button from "@/components/Button.vue";

export default {
  name: "RoomView",
  components: { Button },
  computed: {
    room() {
      return this.$store.state.game.current?.room;
    },
    game() {
      return this.$store.state.game.current;
    },
    currentUser() {
      return this.$store.state.auth.user;
    },
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

    if (!this.$store.socket) this.$store.commit("connectSocket");

    this.$store.state.socket.on(`game${this.game._id}_join`, (user) => {
      console.log("join");
      if (user.id !== this.currentUser.id)
        this.$store.commit("game/joinUser", user);
    });

    this.$store.state.socket.on(`game${this.game._id}_leave`, (user_id) => {
      console.log("leave");
      this.$store.commit("game/leaveUser", user_id);
    });

    this.$store.state.socket.on(
      `game${this.game._id}_next`,
      async ({ room_type, payload }) => {
        await this.$store.commit("game/nextRoom", { room_type, payload });
        if (room_type === "sentence") this.$router.push("/sentence");
        else if (room_type === "draw") this.$router.push("/draw");
      },
    );
    this.$store.state.socket.on(
      `game${this.game._id}_${this.currentUser.id}_next`,
      async ({ room_type, payload }) => {
        await this.$store.commit("game/nextRoom", { room_type, payload });
        if (room_type === "sentence") this.$router.push("/sentence");
        else if (room_type === "draw") this.$router.push("/draw");
      },
    );

    this.$store.state.socket.on(
      `game${this.game._id}_done`,
      async ({ game }) => {
        await this.$store.commit("game/finishGame", game);
        this.$router.push("/results");
      },
    );
  },
  methods: {
    leaveRoom() {
      this.$store
        .dispatch("game/leave")
        .then(() => this.$store.commit("disconnectSocket"))
        .then(() => this.$router.push("/login"));
    },
    invite() {
      if (this.room)
        navigator.clipboard
          .writeText(`${window.location.host}/join/${this.room.invite_link}`)
          .then(() => {
            this.$refs.copy_tooltip.classList.remove("invisible");
            setTimeout(
              () => this.$refs.copy_tooltip.classList.add("invisible"),
              3000,
            );
          });
    },
    startGame() {
      this.$store.dispatch("game/start", this.room.invite_link);
    },
  },
};
</script>

<style scoped>
#invite :deep(button),
#leave :deep(button),
#start :deep(button) {
  font-size: 24px;
}
.game-mode {
  @apply bg-[#F7F4FF] rounded-xl w-40 h-40 disabled:cursor-default flex flex-col justify-center items-center gap-4 disabled:bg-[#D7D4DD];
}
.selected {
  @apply border-[#4d1bb6] border-4;
}
span {
  font-family: Candy Beans;
  font-style: normal;
  font-weight: normal;
  font-size: 24px;
  line-height: 31px;

  color: #f6f4ff;
}
</style>
