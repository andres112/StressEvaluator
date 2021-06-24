<template>
  <v-row class="text-sm-center">
    <v-col sm="4" md="3" cols="12" class="pb-1">
      <label class="text-subtitle-1 text-sm-h6 font-weight-bold">Step Settings: </label>
    </v-col>
    <v-col sm="8" cols="12">
      <v-layout justify-space-around>
        <v-text-field
          v-model="current_step.name"
          dense
          label="Name"
          outlined
          clearable
          color="light-green"
          hint="5 char min"
          class="mr-2"
          counter
          maxlength="25"
          v-if="checkBR('name')"
        ></v-text-field>
        <v-select
          v-model="current_step.type"
          :items="types"
          item-text="text"
          item-value="value"
          dense
          label="Type"
          outlined
          color="light-green"
          class="mr-2"
          v-if="checkBR('type')"
        ></v-select>
        <v-text-field
          v-model="current_step.duration"
          dense
          type="number"
          label="Duration"
          outlined
          color="light-green"
          class="mr-2"
          suffix="sec"
          hint="0 is infinite "
          v-if="checkBR('duration')"
        ></v-text-field>
      </v-layout>
    </v-col>
  </v-row>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "BuilderStepSettings",
  props: {
    br: Object,
  },
  data() {
    return {
      types: [
        { text: "Questionnaire", value: "question" },
        { text: "Stressor", value: "stress" },
      ],
    };
  },
  computed: {
    ...mapState({ current_step: (state) => state.builder.current_step }),
  },
  methods: {
    ...mapActions({
      updateStep: "builder/updateStep",
    }),
    checkBR(el) {
      return this.br?.[el] ?? false;
    },
  },
};
</script>

<style></style>
