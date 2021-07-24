<template>
  <v-row class="text-sm-center">
    <v-col sm="4" md="2" cols="12" class="pb-1">
      <label class="text-subtitle-1 text-sm-h6 font-weight-bold"
        >Step Settings:
      </label>
    </v-col>
    <v-col sm="8" md="9" cols="12" class="px-1 pb-0">
      <v-layout flex-column flex-md-row>
        <v-layout flex-column flex-sm-row justify-space-between>
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
            :disabled="published_mode"
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
            :disabled="published_mode"
          ></v-select>
        </v-layout>
        <v-layout flex-column flex-sm-row justify-space-between>
          <v-autocomplete
            v-model="current_step.stressor"
            :items="stressor_list"
            item-text="text"
            item-value="value"
            dense
            label="Stressor"
            outlined
            color="light-green"
            class="mr-2"
            v-if="checkBR('stressor')"
            :disabled="published_mode"
          ></v-autocomplete>
          <v-text-field
            v-model.number="current_step.duration"
            :rules="[rules.min]"
            dense
            type="number"
            label="Duration"
            outlined
            color="light-green"
            class="mr-2"
            suffix="sec"
            v-if="checkBR('duration')"
            :disabled="published_mode"
          ></v-text-field>
        </v-layout>
      </v-layout>
    </v-col>
  </v-row>
</template>

<script>
import { mapState } from "vuex";

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
        { text: "Information", value: "info" },
      ],
      stressor_list: [],
      rules: { min: (value) => value > 0 || "Wrong value!" },
    };
  },
  created() {
    this.stressor_list = require("@/assets/stressorList.json");
  },
  computed: {
    ...mapState({
      current_step: (state) => state.builder.current_step,
      published_mode: (state) => state.settings.published_mode,
    }),
  },
  methods: {
    checkBR(el) {
      return this.br?.[el] ?? false;
    },
  },
};
</script>

<style></style>
