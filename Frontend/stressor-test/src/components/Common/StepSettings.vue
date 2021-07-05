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
          ></v-autocomplete>
          <v-text-field
            v-model.number="current_step.duration"
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
      ],
      stressor_list: [],
    };
  },
  created() {
    this.stressor_list = require("@/assets/stressorList.json");
  },
  computed: {
    ...mapState({ current_step: (state) => state.builder.current_step }),
  },
  methods: {
    checkBR(el) {
      return this.br?.[el] ?? false;
    },
  },
};
</script>

<style></style>
