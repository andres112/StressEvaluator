<template>
  <v-layout column>
    <home-button />
    <v-layout justify-center align-center>
      <v-card class="text-center top-10" elevation="0">
        <v-card-title class="text-md-h2 text-sm-h4 text-h5 font-weight-bold">
          Stress Evaluator
        </v-card-title>
        <p class="text-subtitle-2 mb-6 green--text">Builder Mode</p>
        <v-card-text>
          <v-col cols="12" class="mx-auto">
            <v-text-field
              v-model="id"
              label="Evaluation Id"
              outlined
              clearable
              color="light-green"
              hint="UUID version 4 format"
              required
            ></v-text-field>
          </v-col>

          <v-btn
            color="light-green"
            class="text-capitalize"
            large
            elevation="2"
            type="submit"
            :loading="result_loading"
            :disabled="!id"
            @click.prevent="onSubmit()"
          >
            <v-icon color="white">mdi-magnify</v-icon>
            <span class="text-h6 font-weight-bold mx-2 white--text"
              >Search</span
            >
          </v-btn>
        </v-card-text>
      </v-card>
    </v-layout>
    <result-cards
      :evaluation="evaluation"
      v-if="result"
    ></result-cards>
  </v-layout>
</template>

<script>
import HomeButton from "@/components/Common/HomeButton";
import ResultCards from "@/components/StepComponents/ResultCards";
import { mapActions } from "vuex";

export default {
  name: "BuilderResults",
  components: { HomeButton, ResultCards },
  data() {
    return {
      result: false,
      id: null,
      result_loading: false,
      evaluation: null,
    };
  },
  methods: {
    ...mapActions({
      getEvaluation: "builder/searchOneEvaluation",
    }),
    async onSubmit() {
      this.result_loading = true;
      const res = await this.getEvaluation(this.id);
      // Validate if response exist and is published
      if (res?._id) {
        this.result = true;
        this.evaluation = res;
      } else {
        this.result = false;
      }
      this.result_loading = false;
    },
  },
  watch: {
    id() {
      this.result = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.top-10 {
  top: 10%;
}
</style>
