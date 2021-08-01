<template>
  <v-layout justify-center align-center fill-height column>
    <p class="text-md-h2 text-sm-h3 text-h4 font-weight-bold">
      Stress Evaluator
    </p>
    <p class="text-subtitle-2 mb-6 blue--text">Evaluation Mode</p>
    <v-card elevation="0" class="container">
      <v-row justify="center">
        <v-col cols="12" lg="11">
          <v-list-item two-line class="mb-4">
            <v-list-item-content>
              <v-list-item-title class="text-md-h4 text-h5 font-weight-bold">
                {{ evaluation.name }}
                <v-chip
                  class="font-weight-bold ml-2"
                  color="deep-orange accent-4"
                  v-if="evaluation.closed"
                  dark
                >
                  Closed
                </v-chip>
              </v-list-item-title>
              <v-list-item-subtitle>
                <strong>Evaluation id:</strong> {{ evaluation._id }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-col>
      </v-row>

      <v-card-text class="pb-6">
        <v-row justify="center">
          <v-col cols="12" md="7" lg="6" class="text-subtitle-1 text-sm-h6">
            <p
              class="text-md-justify deep-orange--text text--accent-4"
              v-if="evaluation.closed"
            >
              The evaluation is closed and no further responses will be
              accepted.
            </p>
            <p class="description pr-4">
              {{ evaluation.description }}
            </p>
          </v-col>
          <v-col cols="12" md="5">
            <v-card shaped color="light-blue lighten-5">
              <v-list-item two-line v-for="(item, index) in ownerInfo" :key="index">
                <v-list-item-content>
                  <v-list-item-title
                    class="text-sm-h5 text-lg-h4 text-h6 font-weight-bold"
                  >
                    {{ item }}
                  </v-list-item-title>
                  <v-list-item-subtitle class="text-capitalize">
                    {{ index }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-text>
        <user-form ref="userForm"></user-form>
      </v-card-text>

      <v-card-actions>
        <v-row justify="center">
          <v-col cols="10" sm="6" md="4" lg="2">
            <v-btn
              color="light-blue"
              class="my-4 text-capitalize white--text"
              x-large
              block
              @click.prevent="start()"
              :loading="loading"
              :disabled="evaluation.closed"
            >
              <v-icon left large>
                mdi-play
              </v-icon>
              <span class="text-subtitle-1 text-sm-h5 font-weight-bold mx-2"
                >Start</span
              >
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-layout>
</template>

<script>
import { mapState, mapActions } from "vuex";
import UserForm from "@/components/Common/UserForm";

export default {
  name: "PresenterIntroduction",
  components: {
    UserForm,
  },
  data() {
    return {
      loading: false,
      owner_info: ["owner", "organization", "email"],
    };
  },
  computed: {
    ...mapState({ evaluation: (state) => state.presenter.evaluation }),
    validateUserForm() {
      debugger;
      return this.$refs.userForm.valid;
    },
    ownerInfo() {
      const owner_info = {
        owner: this.evaluation?.owner,
        organization: this.evaluation?.organization ?? "--",
        email: this.evaluation?.email,
      };
      return owner_info;
    },
  },
  methods: {
    ...mapActions({ createSession: "presenter/createSession" }),
    async start() {
      const user_form = this.$refs.userForm;
      if (!user_form.valid) {
        user_form.validate();
        return;
      }
      this.loading = true;
      const test_id = this.evaluation._id;
      const res = await this.createSession({
        test_id: test_id,
        user: user_form.user,
      });
      if (res?.session_id) {
        this.loading = false;
        this.$router.push(`/presenter/${test_id}/session/${res.session_id}`);
      }
    },
  },
};
</script>

<style lang="scss">
.description {
  white-space: pre-wrap;
  text-align: justify;
}
</style>
