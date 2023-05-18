<template>
  <div class="container">
    <img
      class="avatar"
      :src="require(`@/assets/svg/avatars/${avatar}.svg`)"
      draggable="false"
    />
    <strong class="username">{{ username }}</strong>
  </div>
</template>

<script>
export default {
  name: "UserCard",
  props: {
    avatar: { type: String, default: "cactus" },
    username: { type: String, default: "" },
  },
};
</script>

<style scoped>
.container {
  @apply flex items-center space-x-4 p-4 rounded-lg bg-[#F6F4FF];
}
.avatar {
  @apply w-24;
}
.username {
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 22px;
  line-height: 33px;
}
</style>
