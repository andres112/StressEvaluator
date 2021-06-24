<template>
  <v-card elevation="0">
    <v-app-bar dense flat dark color="light-green">
      <v-app-bar-title class="text-capitalize mr-2">
        {{ textLength(selected_test.name) }}
      </v-app-bar-title>

      <!-- Editor button for test information edition - top-left side-->
      <v-dialog v-model="edit_dialog" persistent>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </template>
        <builder-create @trigger="closeDialog" ref="create_dialog"></builder-create>
      </v-dialog>

      <v-spacer></v-spacer>

      <!-- Add and Delete step button - top-right side-->
      <step-buttons></step-buttons>

      <!-- Tabs -->
      <template v-slot:extension>
        <v-tabs background-color="light-green" dark v-model="current_tab">
          <v-tab v-for="item in steps" :key="item._id">
            {{ textLength(item.name) }}
          </v-tab>
        </v-tabs>
      </template>
    </v-app-bar>

    <!-- Tab content -->
    <v-tabs-items v-model="current_tab">
      <v-tab-item v-for="item in steps" :key="item._id">
        <v-card>
          <!-- Step setting section -->
          <v-card-text class="pb-0">
            <builder-step-settings :br="br[item.type]"></builder-step-settings>
          </v-card-text>

          <v-divider class="mx-4"></v-divider>

          <!-- Step content section -->
          <v-card-text>
            <!-- load dinamically the component according item.type -->
            <component
              :is="currentComponent(item)"
              :step_content="item.content"
              :ref="item._id"
            ></component>
          </v-card-text>
          <v-card-text style="height: 100px; position: relative">
            <v-fab-transition>
              <v-btn
                color="light-blue"
                dark
                absolute
                top
                right
                fab
                x-large
                :loading="saving"
                @click.prevent="uploadStep($refs[item._id])"
              >
                <v-icon x-large>mdi-cloud-upload</v-icon>
              </v-btn>
            </v-fab-transition>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import BuilderCreate from "./BuilderCreate.vue";
import BuilderStepSettings from "./Common/StepSettings.vue";
import StepButtons from "./Common/StepButtons.vue";

// Step components
import TextEditor from "./StepComponents/TextEditor.vue";
import Questionnaire from "./StepComponents/Questionnaire.vue";

export default {
  name: "BuilderSteps",
  components: {
    TextEditor,
    Questionnaire,
    BuilderCreate,
    BuilderStepSettings,
    StepButtons,
  },
  data() {
    return {
      current_tab: 0,
      saving: false,
      edit_dialog: null,
      br: {
        consent: { name: true, type: false, duration: false },
        question: { name: true, type: true, duration: true },
        stress: { name: true, type: true, duration: true },
        new: { name: true, type: true, duration: true },
      },
    };
  },
  created() {
    this.setEditionMode(true);
    this.setCurrentStep(this.steps[this.current_tab]);
  },
  destroyed() {
    this.setEditionMode(false);
  },
  computed: {
    ...mapState({
      selected_test: (state) => state.builder.selected_test,
      steps: (state) => state.builder.steps,
      current_step: (state) => state.builder.current_step,
    }),
  },
  methods: {
    ...mapActions({
      updateStep: "builder/updateStep",
      updateEvaluation: "builder/updateEvaluation",
    }),
    ...mapMutations({
      setEditionMode: "builder/setEditionMode",
      setCurrentStep: "builder/setCurrentStep",
    }),
    textLength(text) {
      const LENGTHS = new Map([
        ["xs", 10],
        ["sm", 20],
        ["md", 30],
        ["lg", 50],
        ["xl", 75],
      ]);
      const len = LENGTHS.get(this.$vuetify.breakpoint.name);
      return text.length > len ? `${text.slice(0, len)}...` : text.slice(0, len);
    },

    // Update step info when user click on upload button
    async uploadStep(comp, isTest = false) {
      this.saving = true;
      let payload = {
        test_id: this.current_step.test_id,
        _id: this.current_step._id,
      };
      // Execute function in child component for save specific content
      const content = Array.isArray(comp) ? comp[0].getContent() : comp.getContent();
      for (const item in content) {
        payload[item] = content[item];
      }
      if (isTest) {
        await this.updateEvaluation(payload);
      } else {
        payload["name"] = this.current_step.name;
        payload["type"] = this.current_step.type;
        payload["duration"] = this.current_step.duration;
        await this.updateStep(payload);
      }
      this.saving = await false;
    },

    // Close the Test editior dialog
    closeDialog(isSave) {
      this.edit_dialog = false;
      if (isSave) {
        this.uploadStep(this.$refs.create_dialog, true);
      }
    },

    // Assign the component according the type of step
    currentComponent(item) {
      if (item.type === "consent") {
        return TextEditor;
      }
      if (item.type === "question") {
        return Questionnaire;
      }
    },
  },
  watch: {
    current_tab() {
      this.setCurrentStep(this.steps[this.current_tab]);
    },
  },
};
</script>

<style></style>
