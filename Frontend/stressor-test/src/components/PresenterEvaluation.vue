<template>
  <v-card elevation="0">
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
    <!-- TODO: Step with type 'consent', will modify session element and responses -->
    <pre>{{ evaluation }}</pre>
  </v-card>
</template>

<script>
import { mapState } from "vuex";
import { textLength } from "@/assets/helpers";

export default {
  name: "PresenterEvaluation",
  data() {
    return {
      current_tab: 0,
    };
  },
  computed: {
    ...mapState({ evaluation: (state) => state.presenter.evaluation }),
  },
  methods: {
    //Adapt the text length according screen size
    getNewLengthText(text) {
      const new_text = textLength(text, this);
      return new_text;
    },
  },
};
</script>

<style></style>
