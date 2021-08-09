<template>
  <v-layout justify-center align-center>
    <v-card class="text-center top-20" elevation="0">
      <v-card-title class="d-flex justify-center text-md-h2 text-sm-h4 text-h5 font-weight-bold">
        Stress Evaluator
      </v-card-title>
      <p class="text-subtitle-2 mb-6 blue--text">Evaluation Mode</p>
      <v-card-text>
        <v-form @submit.prevent="onSubmit()">
          <v-col cols="12" class="mx-auto">
            <v-text-field
              v-model="id"
              label="Evaluation Id"
              outlined
              clearable
              color="light-blue"
              class="mb-1"
              hint="UUID version 4 format"
              required
            ></v-text-field>
          </v-col>

          <v-btn
            color="light-blue"
            class="mt-2 text-capitalize"
            large
            elevation="2"
            type="submit"
            :loading="result_loading"
            :disabled="!id"
          >
            <v-icon color="white">mdi-magnify</v-icon>
            <span class="text-h6 font-weight-bold mx-2 white--text"
              >Search</span
            >
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-layout>
</template>

<script>
import { mapActions, mapMutations } from "vuex";

export default {
  name: "PresenterSearch",
  data() {
    return {
      result_loading: false,
      id: null,
    };
  },
  created() {
    this.clearStates();
  },
  methods: {
    ...mapActions({
      getEvaluation: "presenter/getEvaluation",
    }),
    ...mapMutations({
      setNotifications: "settings/setNotifications",
      clearStates: "presenter/clearStates",
    }),
    async onSubmit() {
      this.result_loading = true;
      const res = await this.getEvaluation(this.id);
      // Validate if response exist and is published
      if (res?._id && res.published) {
        this.$router.push(`/presenter/${this.id}`);
      } else {
        this.sendNotification();
      }
      this.result_loading = false;
    },
    sendNotification() {
      const msg = {
        isOn: true,
        text:
          "Evaluation not found, check the evaluation id. If the problem persists, please contact the evaluator.",
        timeout: 5000,
        status: "error",
      };
      this.setNotifications(msg);
    },
  },
};
</script>

<style scoped>
.top-20 {
  position: absolute;
  top: 20%;
}
</style>
