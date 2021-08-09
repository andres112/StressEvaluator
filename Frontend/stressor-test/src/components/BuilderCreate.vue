<template>
  <v-layout justify-center align-center fill-height>
    <home-button v-if="!edition_mode" />
    <v-card
      class="text-center"
      elevation="0"
      :loading="loading"
      loader-height="2"
      min-width="35%"
    >
      <v-card-title
        class="d-flex justify-center text-md-h2 text-sm-h3 text-h5 font-weight-bold"
      >
        Stress Evaluator
      </v-card-title>
      <p class="text-subtitle-2 mb-4 green--text">Builder Mode</p>
      <v-card-text>
        <v-col md="12" class="mx-auto">
          <v-form
            v-model="valid"
            ref="create_form"
            enctype="multipart/form-data"
          >
            <v-text-field
              dense
              v-model="evaluation.name"
              :rules="[rules.required, rules.minLength]"
              label="Evaluation Name"
              outlined
              clearable
              color="light-green"
              counter
              maxlength="75"
              class="mb-2"
              required
            ></v-text-field>
            <v-text-field
              dense
              v-model="evaluation.owner"
              :rules="[rules.required]"
              label="Evaluation Owner"
              outlined
              clearable
              color="light-green"
              counter
              maxlength="50"
              class="mb-2"
              required
            ></v-text-field>
            <v-text-field
              dense
              v-model="evaluation.organization"
              label="Organization"
              outlined
              clearable
              color="light-green"
              counter
              maxlength="50"
              class="mb-2"
            ></v-text-field>
            <v-text-field
              dense
              v-model="evaluation.email"
              :rules="[rules.required, rules.email]"
              label="Email"
              outlined
              clearable
              color="light-green"
              class="mb-2"
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
        <v-col cols="12" class="mx-auto">
          <!-- Edition mode deactivated -->
          <v-btn
            color="light-green"
            class="mt-2 text-capitalize"
            x-large
            dark
            @click.prevent="onSubmit()"
            v-if="!edition_mode"
          >
            <span class="text-h6 text-sm-h5 font-weight-bold mx-2">
              Continue
            </span>
          </v-btn>
          <!-- Edition mode activated -->
          <v-row justify="center" align="center" class="my-2">
            <v-btn
              color="deep-orange accent-4"
              class="mr-2 text-capitalize"
              large
              dark
              @click.prevent="sendEvent(false)"
              v-if="edition_mode"
            >
              <span class="text-subtitle-1 font-weight-bold mx-2">
                Cancel
              </span>
            </v-btn>
            <v-btn
              color="light-green"
              class="text-capitalize"
              large
              dark
              @click.prevent="sendEvent(true)"
              v-if="edition_mode"
            >
              <v-icon left>
                mdi-content-save
              </v-icon>
              <span class="text-subtitle-1 font-weight-bold mx-2">
                Save
              </span>
            </v-btn>
          </v-row>
        </v-col>
      </v-card-text>
    </v-card>
  </v-layout>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import HomeButton from "@/components/Common/HomeButton.vue";

export default {
  name: "BuilderCreate",
  components: {
    HomeButton,
  },
  data() {
    return {
      valid: false,
      evaluation: {
        name: null,
        description: null,
        owner: null,
        organization: null,
        email: null,
      },
      loading: null,
      rules: {
        required: (value) => !!value || "Required.",
        minLength: (value) =>
          (value && value.length >= 5) || "Min. 5 characters.",
        counter_desc: (value) =>
          (value && value.length <= 750) || "Max. 750 characters.",
        email: (value) => {
          return /.+@.+\..+/.test(value) || "E-mail must be valid";
        },
      },
    };
  },
  created() {
    if (!this.edition_mode) {
      this.cleanStates();
    } else {
      // load the information if there is a selected_test in editon mode
      for (const item in this.evaluation) {
        this.evaluation[item] = this.selected_test[item];
      }
    }
  },
  computed: {
    ...mapState({
      edition_mode: (state) => state.settings.edition_mode,
      selected_test: (state) => state.builder.selected_test,
    }),
  },
  methods: {
    ...mapActions({ createEvaluation: "builder/createEvaluation" }),
    ...mapMutations({ cleanStates: "builder/cleanStates" }),
    async onSubmit() {
      this.$refs.create_form.validate();
      if (this.valid) {
        this.loading = "success";
        await this.createEvaluation(this.evaluation);
        await this.$router.push(`/builder/steps`);
        this.loading = null;
      }
    },
    getContent() {
      return this.evaluation;
    },
    sendEvent(isSave) {
      this.$emit("trigger", isSave);
    },
  },
};
</script>

<style></style>
