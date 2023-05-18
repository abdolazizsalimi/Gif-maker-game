<template>
  <div></div>
</template>

<script>
export default {
  name: "JoinView",
  mounted() {
    if (!this.$store.state.auth.status.logged_in)
      this.$router.push(`/login/${this.$route.params.room_id}`);

    this.$store
      .dispatch("game/join", this.$route.params.room_id)
      .then(() => this.$router.push("/room"));
  },
};
</script>
