<template>
  <v-container fluid>
    <p class="text-subtitle-2 green--text" v-if="edition_mode">Linear Scale</p>
    <question :content="content" @onDeleteQuestion="deleteQuestion"></question>

    <v-row align="center" class="mt-8">
      <v-col
        cols="12"
        sm="10"
        md="6"
        lg="4"
        class="pb-0 mr-4"
        v-if="edition_mode"
      >
        <v-slider
          v-model="content.options"
          color="light-green"
          thumb-color="green"
          track-color="gray"
          thumb-label="always"
          min="2"
          max="10"
          label="Max."
        ></v-slider>
      </v-col>
      <v-col cols="12" md="6" class="d-flex align-center">
        <v-rating
          :dense="$vuetify.breakpoint.smAndDown"
          :small="$vuetify.breakpoint.xsOnly"
          :large="$vuetify.breakpoint.mdAndUp"
          :readonly="edition_mode"
          color="light-blue"
          background-color="gray"
          empty-icon="mdi-checkbox-blank-circle-outline"
          full-icon="mdi-circle-slice-8"
          :length="content.options"
          v-model="answer_selected"
        >
        </v-rating>
        <label
          class="ml-6 text-subtitle-h6  text-sm-h5 font-weight-bold"
          v-if="!edition_mode"
          >{{ answer_selected }}</label
        >
      </v-col>
    </v-row>

    <!-- Question settings -->
    <div v-if="edition_mode">
      <div class="d-inline-flex">
        <v-checkbox
          dense
          v-model="content.required"
          class="ml-1"
          label="Required"
        ></v-checkbox>
      </div>
    </div>
  </v-container>
</template>
<script>
import { mapState } from "vuex";
import Question from "./Question.vue";

export default {
  name: "LinearScale",
  components: { Question },
  props: {
    content: Object,
  },
  data() {
    return {
      answer_selected: 0,
    };
  },
  created() {},
  computed: {
    ...mapState({ edition_mode: (state) => state.settings.edition_mode }),
    getMaxLength() {},
  },
  methods: {
    deleteQuestion() {
      this.$emit("onDeleteQuestion", this.content.id);
    },
  },
};
</script>

<style></style>
