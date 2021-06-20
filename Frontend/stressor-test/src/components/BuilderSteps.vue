<template>
  <v-card elevation="0">
    <v-app-bar dense flat dark color="light-green">
      <v-app-bar-title class="text-capitalize">
        {{ textLength(selected_test.name) }}</v-app-bar-title
      >
      <v-btn icon>
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon large>mdi-plus</v-icon>
      </v-btn>
      <template v-slot:extension>
        <v-tabs background-color="light-green" dark v-model="selected_tab">
          <v-tab v-for="item in steps" :key="item._id">
            {{ item.name }}
          </v-tab>
        </v-tabs>
      </template>
    </v-app-bar>

    <v-tabs-items v-model="selected_tab">
      <v-tab-item v-for="item in steps" :key="item._id">
        <v-card>
          <v-card-text>
            <text-editor :value="item.content" @onSubmit="save"></text-editor>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import { mapState, mapActions } from "vuex";
import TextEditor from "./TextEditor.vue";

export default {
  name: "BuilderSteps",
  components: {
    TextEditor,
  },
  computed: {
    ...mapState({
      selected_test: (state) => state.builder.selected_test,
      steps: (state) => state.builder.steps,
    }),
  },
  data() {
    return {
      selected_tab: null,
    };
  },
  methods: {
    ...mapActions({ updateStep: "builder/updateStep" }),
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
    save({ step }) {
      const tab_content = this.steps[this.selected_tab];
      let payload = {
        test_id: tab_content.test_id,
        step_id: tab_content._id,
      };
      for (const item in step) {
        payload[item] = step[item];
      }
      this.updateStep(payload);
    },
  },
};
</script>

<style></style>
