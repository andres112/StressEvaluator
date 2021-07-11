<template>
  <v-card elevation="0" justify="center">
    <v-app-bar dark color="light-blue">
      <!-- Test title -->
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
        1 of {{ evaluation.number_of_steps }} Tasks
      </div>
    </v-app-bar>

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
  </v-card>
</template>

<script>
import { mapState } from "vuex";
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
      current_tab: 0,
    };
  },
  computed: {
    ...mapState({
      evaluation: (state) => state.presenter.evaluation,
      current_step: (state) => state.presenter.current_step,
    }),
  },
  methods: {
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
  },
};
</script>

<style></style>
