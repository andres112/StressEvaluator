<template>
  <v-layout justify-center align-center fill-height>
    <home-button />
    <v-card class="text-center" elevation="0">
      <v-card-title class="text-md-h2 text-sm-h4 text-h5 font-weight-bold mb-6">
        Stress Evaluator - Builder
      </v-card-title>
      <v-card-text>
        <v-col md="11" class="mx-auto">
          <v-form v-model="valid" ref="create_form">
            <v-text-field
              v-model="evaluation.name"
              :rules="[rules.required, rules.minLength]"
              label="Evaluation Name"
              outlined
              clearable
              color="light-green"
              counter
              maxlength="75"
              class="mb-3"
              required
              hint="The name may not be changed later."
            ></v-text-field>
            <v-text-field
              v-model="evaluation.owner"
              :rules="[rules.required]"
              label="Evaluation Owner"
              outlined
              clearable
              color="light-green"
              counter
              maxlength="50"
              class="mb-3"
              required
            ></v-text-field>
            <v-textarea
              v-model="evaluation.description"
              :rules="[rules.required, rules.counter_desc]"
              outlined
              label="Evaluation Description"
              color="light-green"
              counter
              rows="9"
              no-resize
              required
            >
            </v-textarea>
          </v-form>
        </v-col>
        <v-col cols="8" md="4" class="mx-auto">
          <v-btn
            color="light-green"
            class="mt-2 text-capitalize"
            x-large
            dark
            block
            @click.prevent="onSubmit()"
          >
            <span class="text-h6 text-sm-h5 font-weight-bold mx-2"
              >Continue</span
            >
          </v-btn>
        </v-col>
      </v-card-text>
    </v-card>
  </v-layout>
</template>

<script>
import { mapActions, mapMutations } from "vuex";
import HomeButton from "@/components/Common/HomeButton.vue";

export default {
  name: "BuilderCreate",
  components: {
    HomeButton,
  },
  data() {
    return {
      valid: false,
      evaluation: { name: null, description: null, owner: null },
      rules: {
        required: (value) => !!value || "Required.",
        minLength: (value) =>
          (value && value.length >= 5) || "Min. 5 characters.",
        counter_desc: (value) =>
          (value && value.length <= 750) || "Max. 750 characters.",
      },
    };
  },
  created() {
    this.cleanStates();
  },
  methods: {
    ...mapActions({ createEvaluation: "evaluator/createEvaluation" }),
    ...mapMutations({ cleanStates: "evaluator/cleanStates" }),
    async onSubmit() {
      this.$refs.create_form.validate();
      if (this.valid) {
        await this.createEvaluation(this.evaluation);
        //TODO: create a loading variable before to sent next view
        await this.$router.push(`/builder/steps`);
      }
    },
  },
};
</script>

<style></style>
