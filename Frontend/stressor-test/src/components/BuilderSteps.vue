<template>
  <v-card elevation="0">
    <v-app-bar dense flat dark color="light-green">
      <v-app-bar-title class="text-capitalize"> {{ textLength(selected_test.name) }}</v-app-bar-title>
      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon large>mdi-plus</v-icon>
      </v-btn>
      <template v-slot:extension>
        <v-tabs background-color="light-green" dark v-model="selected_tab">
          <v-tab v-for="item in items" :key="item">
            {{ item }}
          </v-tab>
        </v-tabs>
      </template>
    </v-app-bar>

    <v-tabs-items v-model="selected_tab">
      <v-tab-item v-for="item in items" :key="item">
        <v-card flat>
          <v-card-text v-html="selected_test.consent"></v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "BuilderSteps",
  computed: {
    ...mapState({ selected_test: (state) => state.evaluator.selected_test }),
  },
  data() {
    return {
      selected_tab: null,
      items: ["Informed Consent"],
    };
  },
  methods: {
    textLength(text) {
      let short_text;
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          short_text = text.slice(0, 10);
          break;
        case "sm":
          short_text = text.slice(0, 20);
          break;
        case "md":
          short_text = text.slice(0, 30);
          break;
        case "lg":
          short_text = text.slice(0, 50);
          break;
        case "xl":
          return text;
      }
      return short_text + "...";
    },
  },
};
</script>

<style></style>
