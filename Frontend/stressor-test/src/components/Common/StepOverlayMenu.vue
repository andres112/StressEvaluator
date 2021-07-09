<template>
  <v-overlay :value="menuOn.overlay" :opacity="0.9">
    <v-btn
      fab
      outlined
      x-small
      absolute
      right
      top
      @click="menuOn.overlay = false"
    >
      <v-icon>mdi-close-thick</v-icon></v-btn
    >
    <v-layout
      justify="center"
      align="center"
      column
      class="my-4 pb-12"
      v-show="menuOn.overlay"
    >
      <v-btn
        text
        class="text-h5 text-sm-h4 font-weight-bold text-capitalize my-2"
        dark
        @click="$router.push(`/builder`)"
        x-large
      >
        Home
      </v-btn>
      <v-btn
        text
        class="text-h5 text-sm-h4 font-weight-bold text-capitalize my-2"
        dark
        x-large
        @click.prevent="$emit('onPublish')"
        v-if="!published_mode"
        color="light-blue"
      >
        Publish Evaluation
      </v-btn>
      <v-btn
        text
        class="text-h5 text-sm-h4 font-weight-bold text-capitalize my-2"
        dark
        x-large
        v-if="published_mode"
        @click="copyLink()"
      >
        Evaluation Link
      </v-btn>
      <v-btn
        text
        class="text-h5 text-sm-h4 font-weight-bold text-capitalize my-2"
        dark
        x-large
        color="deep-orange"
        v-if="published_mode"
        @click="$emit('onClose')"
      >
        Close Evaluation
      </v-btn>
      <v-progress-linear
        indeterminate
        v-if="saving"
        color="light-green"
      ></v-progress-linear>
    </v-layout>
  </v-overlay>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { copyToClipboard } from "@/assets/helpers.js";

export default {
  props: { menuOn: Object, saving: Boolean },
  computed: {
    ...mapState({
      published_mode: (state) => state.settings.published_mode,
      selected_test: (state) => state.builder.selected_test,
    }),
  },
  methods: {
    ...mapMutations({ setNotifications: "settings/setNotifications" }),
    copyLink() {
      copyToClipboard(this.selected_test.test_link);
      const note = {
        isOn: true,
        text: "Link copied to clipboard",
        timeout: 3000,
        status: "info",
      };
      this.setNotifications(note);
    },
  },
};
</script>

<style></style>
