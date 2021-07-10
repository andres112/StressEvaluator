<template>
  <v-card elevation="0">
    <v-app-bar dense flat dark color="light-blue">
      <!-- Test title -->
      <div class="text-capitalize text-h6 text-md-h5">
        {{ getNewLengthText(evaluation.name) }}
      </div>

      <!-- Tabs -->
      <template v-slot:extension>
        <v-tabs
          background-color="light-blue"
          dark
          v-model="current_tab"
          center-active
        >
          <!-- <v-tab v-for="item in steps" :key="item._id">
            {{ textLength(item.name) }}
          </v-tab> -->
        </v-tabs>
      </template>
    </v-app-bar>
    <!-- TODO: Step with type 'consent', will modify session element and responses -->
    {{ evaluation }}
  </v-card>
</template>

<script>
import { mapState } from "vuex";
import { textLength } from "@/assets/helpers";

export default {
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
