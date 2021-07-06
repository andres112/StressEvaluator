<template>
  <!-- FIXME- NOW :Deatache edition mode from implementation mode -->
  <v-card elevation="0">
    <!-- Overlay menu -->
    <step-overlay-menu
      :menuOn="menu"
      :saving="saving"
      @onPublish="publishCurrentEvaluation"
    ></step-overlay-menu>

    <v-app-bar
      dense
      flat
      dark
      :color="edition_mode ? 'light-green' : 'light-blue'"
    >
      <v-app-bar-nav-icon
        v-if="edition_mode"
        @click="menu.overlay = !menu.overlay"
        large
      >
      </v-app-bar-nav-icon>

      <!-- Test title -->
      <div class="text-capitalize text-h6 text-md-h5">
        {{ appTitle }}
      </div>

      <!-- Editor button for test information edition - top-left side-->
      <v-dialog
        v-model="edit_dialog"
        persistent
        v-if="edition_mode && !published_mode"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>mdi-lead-pencil</v-icon>
          </v-btn>
        </template>
        <builder-create
          @trigger="closeDialog"
          ref="create_dialog"
        ></builder-create>
      </v-dialog>

      <v-spacer></v-spacer>

      <!-- Add and Delete step button - top-right side-->
      <step-buttons
        v-if="edition_mode && !published_mode"
        @addStepTab="changeToLastTab"
        @onSave="saveWhenAdd"
      ></step-buttons>

      <!-- Tabs -->
      <template v-slot:extension>
        <v-tabs
          :background-color="edition_mode ? 'light-green' : 'light-blue'"
          dark
          v-model="current_tab"
          :show-arrows="edition_mode"
          :center-active="!edition_mode"
        >
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
          <v-card-text class="pb-0" v-if="edition_mode">
            <builder-step-settings :br="br[item.type]"></builder-step-settings>
          </v-card-text>

          <v-divider class="mx-4 mt-4" v-if="edition_mode"></v-divider>

          <!-- Step content section -->
          <v-card-text>
            <!-- load dinamically the component according item.type -->
            <component
              :is="currentComponent(item)"
              :step_content="item"
              :ref="item._id"
            ></component>
          </v-card-text>
          <v-card-text
            style="height: 100px; position: relative"
            v-if="edition_mode && !published_mode"
          >
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
                @click.prevent="uploadStep(item._id)"
              >
                <v-icon x-large>mdi-cloud-upload</v-icon>
              </v-btn>
            </v-fab-transition>
          </v-card-text>
          <v-card-actions
            class="d-flex justify-center"
            v-else-if="!edition_mode"
          >
            <v-btn
              color="light-blue"
              dark
              x-large
              :loading="saving"
              @click.prevent="saveAnswer(item._id)"
            >
              Submit
            </v-btn>
          </v-card-actions>
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
import StepOverlayMenu from "./Common/StepOverlayMenu.vue";

// Step components
import TextEditor from "./StepComponents/TextEditor.vue";
import Questionnaire from "./StepComponents/Questionnaire.vue";
import Stressor from "./StepComponents/Stressor.vue";

export default {
  name: "BuilderSteps",
  components: {
    TextEditor,
    Questionnaire,
    Stressor,
    BuilderCreate,
    BuilderStepSettings,
    StepButtons,
    StepOverlayMenu,
  },
  data() {
    return {
      current_tab: 0,
      saving: false,
      edit_dialog: null,
      menu: { overlay: false },
      br: {
        consent: { name: true, type: false, duration: false, stressor: false },
        question: { name: true, type: true, duration: false, stressor: false },
        stress: { name: true, type: true, duration: true, stressor: true },
      },
    };
  },
  created() {
    this.setEditionMode(true);
  },
  destroyed() {
    this.setEditionMode(false);
  },
  computed: {
    ...mapState({
      selected_test: (state) => state.builder.selected_test,
      steps: (state) => state.builder.steps,
      current_step: (state) => state.builder.current_step,
      edition_mode: (state) => state.settings.edition_mode,
      published_mode: (state) => state.settings.published_mode,
    }),
    appTitle() {
      return this.textLength(this.selected_test.name);
    },
  },
  methods: {
    ...mapActions({
      updateStep: "builder/updateStep",
      updateEvaluation: "builder/updateEvaluation",
      publishEvaluation: "builder/publishEvaluation",
    }),
    ...mapMutations({
      setEditionMode: "settings/setEditionMode",
      setCurrentStep: "builder/setCurrentStep",
      setNotifications: "settings/setNotifications",
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
      return text.length > len ? `${text.slice(0, len)}...` : text;
    },

    // Update step info when user click on upload button
    async uploadStep(ref_id, isTest = false) {
      this.saving = true;
      const comp = this.$refs[ref_id];
      let payload = {
        test_id: this.current_step.test_id,
        _id: this.current_step._id,
      };
      let res;
      // Execute function in child component for save specific content
      const content = Array.isArray(comp)
        ? comp[0].getContent()
        : comp.getContent();
      for (const item in content) {
        payload[item] = content[item];
      }
      if (isTest) {
        res = await this.updateEvaluation(payload);
      } else {
        payload["name"] = this.current_step.name;
        payload["type"] = this.current_step.type;
        payload["duration"] = this.current_step.duration;
        payload["stressor"] = this.current_step.stressor;
        res = await this.updateStep(payload);
      }
      this.saving = await false;
      this.sendNotification(res);
    },

    // FIXME: deatache to user implementation mode
    async saveAnswer(ref_id) {
      this.saving = true;
      const comp = this.$refs[ref_id];
      // Execute function in child component for save specific content
      const content = Array.isArray(comp)
        ? comp[0].getAnswer()
        : comp.getAnswer();
      console.log(content);
      this.saving = false;
    },

    //Publish current evaluation
    async publishCurrentEvaluation() {
      this.saving = true;
      const res = await this.publishEvaluation(this.current_step.test_id);
      this.menu.overlay = false;
      this.sendNotification(res);
      this.saving = false;
    },

    // Close the Evaluation editior dialog
    closeDialog(isSave) {
      this.edit_dialog = false;
      if (isSave) {
        this.uploadStep("create_dialog", true);
      }
    },

    saveWhenAdd(id) {
      this.uploadStep(id);
    },

    // Assign the component according the type of step
    currentComponent(item) {
      if (item.type === "consent") {
        return TextEditor;
      }
      if (item.type === "question") {
        return Questionnaire;
      }
      if (item.type === "stress") {
        return Stressor;
      }
    },

    sendNotification(res) {
      const note = { isOn: true, text: null, timeout: 3000, status: "info" };
      if (res.status == 200) {
        note.status = "ok";
        note.text = "Evaluation updated successfully.";
      }
      if (res.status == 304) {
        note.status = "info";
        note.text = "Evaluation not updated, data already updated.";
      }
      if (res.status == 404 || res.status == 500) {
        note.status = "error";
        note.text = "Evaluation not updated.";
      }
      this.setNotifications(note);
    },

    // Change automatically to the new tab after 500ms
    changeToLastTab() {
      const aux = this;
      setTimeout(function() {
        aux.current_tab = aux.steps.length - 1;
      }, 750);
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
