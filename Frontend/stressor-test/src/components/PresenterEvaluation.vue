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
      <div class="text-subtitle-2 text-sm-subtitle-1 text-md-h6">
        {{ currentStep }} of {{ evaluation.number_of_steps }} Steps
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
        :step_data="current_step"
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
        @click.prevent="nextStep()"
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
        :loading="sending"
        v-if="['question', 'stress'].includes(current_step.type)"
        @click.prevent="sendResponse()"
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
        :loading="sending"
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
import { mapState, mapActions, mapMutations } from "vuex";
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
      sending: false,
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
    currentStep() {
      return this.evaluation.steps.indexOf(this.current_step._id) + 1;
    },
  },
  methods: {
    ...mapActions({
      updateSession: "presenter/updateSession",
      getStep: "presenter/getStep",
      closeSession: "presenter/closeSession",
      updateResponses: "presenter/updateResponses",
    }),
    ...mapMutations({ setNotifications: "settings/setNotifications" }),
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

    // Go the next step
    async nextStep() {
      const nextStep = this.getNextStep;
      if (nextStep) {
        const step_update = {
          test_id: this.current_step.test_id,
          step_id: nextStep,
        };
        await this.getStep(step_update);
      } else {
        this.closeEvaluation();
      }
    },

    // Update session for informed consent response
    async sendConsent(res) {
      const session_update = {
        test_id: this.current_step.test_id,
        session_id: this.session_id,
        consent: res,
      };
      // If consent is true get the next step, otherwise close the evaluation
      this.sending = true;
      const update_res = await this.updateSession(session_update);
      if (res) {
        update_res?.status == 200
          ? await this.nextStep()
          : this.sendNotification();
      } else {
        this.closeEvaluation();
      }
      this.sending = false;
    },

    // Send Questionnaire and Stressor user responses
    async sendResponse() {
      this.sending = true;
      const comp = this.$refs[this.current_step._id];
      // Execute function in child component for save specific content
      const content = Array.isArray(comp)
        ? comp[0].getAnswer()
        : comp.getAnswer();
      const payload = {
        test_id: this.current_step.test_id,
        session_id: this.session_id,
        response: content,
      };
      // send the content to the server and wait for response
      const res = await this.updateResponses(payload);
      if (res?.status == 200) await this.nextStep();
      else this.sendNotification();
      this.sending = false;
    },

    // Trigger the event for closing the evaluation session.
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

    sendNotification(text, time = 5000, type = "error") {
      text =
        text ??
        "Something went wrong! please try again.If the problem persists, please contact the evaluator.";
      const msg = {
        isOn: true,
        text: text,
        timeout: time,
        status: type,
      };
      this.setNotifications(msg);
    },
  },
};
</script>

<style></style>
