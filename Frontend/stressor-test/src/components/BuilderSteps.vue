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
        <v-tabs background-color="light-green" dark v-model="current_tab">
          <v-tab v-for="item in steps" :key="item._id">
            {{ item.name }}
          </v-tab>
        </v-tabs>
      </template>
    </v-app-bar>

    <v-tabs-items v-model="current_tab">
      <v-tab-item v-for="item in steps" :key="item._id">
        <v-card>
          <v-card-text>
            <text-editor :value="item.content" :ref="item._id"></text-editor>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="deep-orange accent-4"
              class="mr-2 text-capitalize"
              @click.prevent="saveContent($refs[item._id])"
              large
              dark
              :loading="saving"
              align-content-center
              v-show="!isRemovable(item)"
            >
              <v-icon left>
                mdi-delete-alert
              </v-icon>
              Delete
            </v-btn>
            <v-btn
              color="light-green"
              class="mr-6 text-capitalize"
              @click.prevent="saveContent($refs[item._id])"
              large
              dark
              :loading="saving"
              align-content-center
            >
              <v-icon left>
                mdi-content-save
              </v-icon>
              <span class="mx-2 text-subtitle-1">Save</span>
            </v-btn>
          </v-card-actions>
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
      current_tab: null,
      saving: false,
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
    async saveContent(comp) {
      this.saving = true;
      const tab_content = this.steps[this.current_tab];
      let payload = {
        test_id: tab_content.test_id,
        step_id: tab_content._id,
      };
      const step_content = comp[0].saveContent(); // execute function in child component for save specific content
      for (const item in step_content) {
        payload[item] = step_content[item];
      }
      await this.updateStep(payload);
      this.saving = await false;
    },
    isRemovable(item) {
      const no_removable = ["consent"];
      return no_removable.includes(item.type);
    },
  },
};
</script>

<style></style>
