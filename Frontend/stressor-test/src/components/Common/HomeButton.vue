<template>
  <v-btn
    absolute
    fab
    top
    left
    dark
    large
    color="light-green"
    class="mt-10 ml-3 d-none d-sm-flex"
    @click="onClick('/builder')"
  >
    <v-icon> mdi-home</v-icon>
  </v-btn>
</template>

<script>
export default {
  name:"HomeButton",
  methods: {
    onClick(route) {
      this.$router.push(`${route}`);
    },
  },
};
</script>

<style></style>
