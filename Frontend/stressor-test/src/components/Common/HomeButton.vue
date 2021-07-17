<template>
  <v-btn
    absolute
    fab
    top
    left
    dark
    :small="$vuetify.breakpoint.xsOnly"
    :large="$vuetify.breakpoint.smAndUp"
    color="light-green"
    class="mt-10 ml-0 ml-sm-3 d-sm-flex"
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
