<template>
  <v-row align="center">
    <v-col cols="11" class="pb-0 d-flex">
      <span class="text-h5 red--text text--darken-1 mr-1" v-if="content.required">*</span>
      <v-text-field
        v-if="edition_mode"
        dense
        color="light-green"
        v-model.trim="content.question"
        placeholder="Question"
        counter
        maxlength="200"
      ></v-text-field>
      <label v-else class="text-subtitle-1 text-sm-h6 ml-1">{{ content.question }}</label>
    </v-col>
    <v-col cols="1">
      <v-btn icon color="deep-orange accent-4" v-if="edition_mode" @click="deleteQuestion()">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
import { mapState } from "vuex";

export default {
  props: {
    content: Object,
  },
  computed: {
    ...mapState({ edition_mode: (state) => state.settings.edition_mode }),
    isRequired() {
      return this.content.required ? "mdi-hexagram" : null;
    },
  },
  methods: {
    deleteQuestion() {
      this.$emit("onDeleteQuestion");
    },
  },
};
</script>

<style></style>
