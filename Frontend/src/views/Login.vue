<template>
  <div class="login">
    <!-- Join room Modal -->
    <!-- <div
      class="
        absolute
        z-10
        flex
        items-center
        justify-center
        bg-[#F6F4FF]
        p-6
        rounded-3xl
      "
      v-show="false"
    >
      <input class="text-black h-10" type="text" />
    </div> -->

    <!-- Center Container -->
    <div class="container">
      <div class="user">
        <div class="relative w-48 h-48">
          <div class="avatar w-48 h-48">
            <img
              :src="require(`@/assets/svg/avatars/${avatar}.svg`)"
              draggable="false"
            />
          </div>
          <div class="change-avatar" @click="changeAvatar">
            <img src="~@/assets/svg/pen.svg" alt="change" draggable="false" />
          </div>
        </div>
        <input
          v-model="username"
          class="username"
          placeholder="Username"
          type="text"
          required
        />
      </div>
      <div class="action">
        <Button class="hidden" @onClick="join" icon="room" id="join"
          >JOIN</Button
        >
        <Button @onClick="start" icon="play" id="play">START</Button>
      </div>
    </div>
  </div>
</template>

<script>
import Button from "@/components/Button.vue";

export default {
  name: "LoginView",
  components: { Button },
  data() {
    return {
      avatars: ["cactus", "cyclops_girl", "boy", "kitten", "ghost", "pizza"],
      username: "",
      avatar: "cactus",
    };
  },
  mounted() {
    // select a random avatar
    this.changeAvatar();
  },
  methods: {
    start() {
      this.$store
        .dispatch("auth/login", {
          username: this.username,
          avatar: this.avatar,
        })
        .then(() => {
          if (!this.$route.params.room_id)
            return this.$store.dispatch("game/create");
          else
            return this.$store.dispatch(
              "game/join",
              this.$route.params.room_id,
            );
        })
        .then(() => this.$router.push("/room"));
    },

    join() {
      //TODO:
    },

    changeAvatar() {
      this.avatar =
        this.avatars[Math.floor(Math.random() * this.avatars.length)];
    },
  },
};
</script>

<style scoped>
input {
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 21px;
  line-height: 33px;
}
.login {
  @apply w-8/12 h-5/6 rounded-3xl p-24 flex flex-col justify-center items-center;
  background: rgba(14, 12, 9, 0.3);
}
.container {
  @apply h-full rounded-3xl flex flex-col justify-evenly items-center border-4 px-14;
  width: fit-content;
}
.user {
  @apply flex items-center justify-between gap-12;
}
.change-avatar {
  @apply absolute w-12 h-12 flex justify-center items-center bg-[#F6F4FF] rounded-full right-3 bottom-3 p-3 cursor-pointer;
  @apply hover:bg-[#D2C7FF] active:scale-105;
}
.avatar {
  @apply border-[12px] border-[#F6F4FF] p-0 rounded-full flex justify-center items-center;
}
.avatar > img {
  @apply h-full w-full;
}
.username {
  @apply w-full h-[60px] border-4 rounded-[15px] pl-[19px] text-[#F6F4FF] focus:outline-none;
  background: rgba(247, 244, 255, 0.1);
}

.action {
  @apply flex justify-center gap-16;
}
</style>
