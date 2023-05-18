<template>
  <div class="select-sentence w-[964px] h-[612px] rounded-3xl relative">
    <div class="flex flex-col h-full w-full justify-around items-center px-14">
      <div v-if="!canvas" class="avatar w-[235px] h-[235px]">
        <img
          :src="
            require(`@/assets/svg/avatars/${
              currentUser.avatar || 'cactus'
            }.svg`)
          "
          draggable="false"
        />
      </div>
      <div v-else class="canvas-container p-3 max-w-lg rounded-xl">
        <img class="rounded-xl" :src="canvas" draggable="false" />
      </div>
      <input
        v-model="sentence"
        class="sentence"
        placeholder="Write a Sentence"
        type="text"
        required
      />
      <Button class="w-fit" icon="done" @onClick="submit" :disabled="submitted"
        >DONE</Button
      >
    </div>
    <div class="absolute top-16 right-16 w-[112px] h-[112px]">
      <Clock :value="timer.remaining" :max="timer.duration" />
    </div>
  </div>
</template>

<script>
import Clock from "@/components/Clock.vue";
import Button from "@/components/Button.vue";
import RoomService from "@/services/room.service";

export default {
  name: "SentenceView",
  components: { Clock, Button },
  data() {
    return {
      timer: { remaining: 120.0, duration: 120.0, handle: null },
      sentence: "",
      submitted: false,
      roomService: new RoomService(),
    };
  },
  computed: {
    room() {
      return this.$store.state.game?.current?.room;
    },
    game() {
      return this.$store.state.game?.current;
    },
    currentUser() {
      return this.$store.state.auth?.user;
    },
    canvas() {
      return this.$store.state.game?.next?.payload;
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
    this.submitted = false;
  },
  methods: {
    submit() {
      if (!this.submitted) {
        this.roomService.submit({
          game_id: this.game._id,
          payload: this.sentence,
        });
        this.submitted = true;
      }
    },
  },
};
</script>

<style scoped>
input {
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 28px;
  line-height: 33px;
}
.select-sentence {
  background: rgba(14, 12, 9, 0.3);
}
.sentence {
  @apply w-full h-16 border-4 rounded-[16px] pl-[26px] text-[#F6F4FF] focus:outline-none;
  background: rgba(247, 244, 255, 0.1);
}
.avatar {
  @apply border-[12px] border-[#F6F4FF] p-0 rounded-full flex justify-center items-center;
}
.avatar > img {
  @apply h-full w-full;
}
.canvas-container {
  background: rgba(14, 12, 9, 0.3);
}
</style>
