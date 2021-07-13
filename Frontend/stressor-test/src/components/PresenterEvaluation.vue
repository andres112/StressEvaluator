<template>
  <v-card elevation="0" justify="center">
    <!-- Nav bar for evaluation information -->
    <v-app-bar dark color="light-blue">
      <v-list-item two-line class="my-4 pl-0">
        <v-list-item-content>
          <v-list-item-title
            class="text-capitalize text-h6 text-md-h5 font-weight-bold"
          >
            {{ getNewLengthText(evaluation.name) }}
          </v-list-item-title>
          <v-list-item-subtitle>
            <strong>Evaluation id:</strong>
            {{ getNewLengthText(evaluation._id) }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-spacer></v-spacer>
      <!-- TODO: the current task -->
      <div class="text-subtitle-2 text-sm-subtitle-1 text-md-h6">
        {{ currentTask }} of {{ evaluation.number_of_steps }} Tasks
      </div>
    </v-app-bar>

    <!-- Step title -->
    <v-card-title
      class="justify-center text-uppercase text-h5 font-weight-bold"
    >
      {{ current_step.name }}</v-card-title
    >
    <v-divider class="mx-4"></v-divider>

    <!-- Step content section -->
    <v-card-text
      ><component
        :is="currentComponent(current_step)"
        :step_content="current_step"
        :ref="current_step._id"
      ></component
    ></v-card-text>

    <!-- Step buttons section -->
    <v-card-actions class="d-flex justify-center">
      <!-- Continue button: Go to the next step without aditional action -->
      <v-btn
        color="light-green"
        class="text-capitalize"
        x-large
        dark
        v-if="current_step.type === 'info'"
      >
        <span class="text-h6 font-weight-bold mx-2">
          Continue
        </span>
      </v-btn>
      <!-- Submit button: Send data to the server -->
      <v-btn
        color="light-green"
        class="text-capitalize"
        x-large
        dark
        v-if="current_step.type === 'question'"
      >
        <span class="text-h6 font-weight-bold mx-2">
          Submit
        </span>
      </v-btn>
      <!-- Accept and Reject buttons: Boolean event i.e. informed consent step -->
      <v-btn
        color="deep-orange accent-4"
        class="mx-2 text-capitalize"
        x-large
        dark
        @click.prevent="sendConsent(false)"
        v-if="current_step.type === 'consent'"
      >
        <span class="text-h6 font-weight-bold mx-2">
          Reject
        </span>
      </v-btn>
      <v-btn
        color="light-green"
        class="mx-2 text-capitalize"
        x-large
        dark
        @click.prevent="sendConsent(true)"
        v-if="current_step.type === 'consent'"
      >
        <span class="text-h6 font-weight-bold mx-2">
          Accept
        </span>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { textLength } from "@/assets/helpers";

// Step components
import TextEditor from "./StepComponents/TextEditor.vue";
import Questionnaire from "./StepComponents/Questionnaire.vue";
import Stressor from "./StepComponents/Stressor.vue";

export default {
  name: "PresenterEvaluation",
  components: { TextEditor, Questionnaire, Stressor },
  data() {
    return {
    };
  },
  computed: {
    ...mapState({
      evaluation: (state) => state.presenter.evaluation,
      current_step: (state) => state.presenter.current_step,
      session_id: (state) => state.presenter.session_id,
    }),
    getNextStep() {
      const next_index =
        this.evaluation.steps.indexOf(this.current_step._id) + 1;
      if (next_index > 0 && next_index < this.evaluation.number_of_steps) {
        return this.evaluation.steps[next_index];
      } else return null;
    },
    currentTask(){
      return this.evaluation.steps.indexOf(this.current_step._id) + 1
    }
  },
  methods: {
    ...mapActions({
      updateSession: "presenter/updateSession",
      getStep: "presenter/getStep",
      closeSession: "presenter/closeSession",
    }),
    //Adapt the text length according screen size
    getNewLengthText(text) {
      const new_text = textLength(text, this);
      return new_text;
    },
    // Assign the component according the type of step
    currentComponent(item) {
      if (item.type === "consent" || item.type == "info") {
        return TextEditor;
      }
      if (item.type === "question") {
        return Questionnaire;
      }
      if (item.type === "stress") {
        return Stressor;
      }
    },

    async sendConsent(res) {
      const step_update = {
        test_id: this.current_step.test_id,
        step_id: this.getNextStep,
      };
      const session_update = {
        test_id: this.current_step.test_id,
        session_id: this.session_id,
        current_step: step_update.step_id,
        consent: res,
      };
      // If consent is true get the next step, but close the evaluation
      if (res) {
        const session_res = await this.updateSession(session_update);
        const step_res = await this.getStep(step_update);
      } else {
        session_update.current_step = null;
        const session_res = await this.updateSession(session_update);
        this.closeEvaluation();
      }
    },

    async closeEvaluation() {
      const close_info = {
        test_id: this.current_step.test_id,
        session_id: this.session_id,
      };
      const server_res = await this.closeSession(close_info);
      if (server_res?.status == 200) {
        this.$router.push("/acknowledge");
      }
    },
  },
};
</script>

<style></style>
