<template>
  <v-container class="mt-4">
    <v-row dense justify="center">
      <!-- Evaluation information card -->
      <v-col cols="12" sm="10" lg="6">
        <v-card>
          <v-card-title
            class="text-h5 font-weight-bold grey--text text--darken-1"
            >Information</v-card-title
          >
          <v-card-text>
            <!-- Evaluation name and id -->
            <v-list-item two-line class="mb-4 pl-0">
              <v-list-item-content>
                <v-list-item-title class="text-md-h5 text-h6">
                  <span class="mr-2">{{ evaluation.name }}</span>
                  <v-chip
                    color="deep-orange accent-4"
                    v-if="evaluation.closed"
                    dark
                    small
                  >
                    Closed
                  </v-chip>
                  <v-chip
                    color="blue accent-4"
                    v-else-if="evaluation.published"
                    dark
                    small
                  >
                    Published
                  </v-chip>
                  <v-chip color="light-green" v-else dark small>
                    Builder
                  </v-chip>
                </v-list-item-title>
                <v-list-item-subtitle>
                  <strong>Evaluation id:</strong> {{ evaluation._id }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <!-- Evaluation owner info -->
            <v-row>
              <v-col
                cols="12"
                sm="6"
                lg="4"
                v-for="(item, index) in ownerInfo"
                :key="index"
              >
                <v-list-item two-line class="pl-0">
                  <v-list-item-content>
                    <v-list-item-title class="text-md-h5 text-h6 mr-2">
                      {{ item }}
                    </v-list-item-title>
                    <v-list-item-subtitle class="text-capitalize">
                      {{ index }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
            </v-row>
            <!-- Evaluation other information-->
            <v-row>
              <v-col
                cols="12"
                sm="6"
                lg="4"
                v-for="(item, index) in otherInfo"
                :key="index"
              >
                <v-list-item two-line class="pl-0">
                  <v-list-item-content>
                    <v-list-item-title class="text-md-h5 text-h6 mr-2">
                      {{ item }}
                    </v-list-item-title>
                    <v-list-item-subtitle class="text-capitalize">
                      {{ setTextSpaces(index) }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Evaluation results download card -->
      <v-col cols="12" sm="10" lg="6">
        <v-card>
          <v-card-title
            class="text-h5 font-weight-bold grey--text text--darken-1"
          >
            Downloads
          </v-card-title>
          <v-card-text>
            <v-row class="my-4" align="center">
              <v-col cols="5">
                <v-list-item two-line class="pl-0">
                  <v-list-item-content>
                    <v-list-item-title
                      class="font-weight-bold text-md-h5 text-h6 mr-2"
                    >
                      Complete
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      Full user information separated by session.
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
              <v-col cols="7">
                <v-btn
                  color="light-green"
                  elevation="2"
                  outlined
                  @click.prevent="download('full')"
                >
                  <v-icon>mdi-code-json</v-icon>
                  <span class="text-md-h5 text-h6 mx-2 font-weight-bold"
                    >JSON</span
                  >
                </v-btn>
              </v-col>
            </v-row>
            <v-divider class="mx-1 my-2"></v-divider>
            <v-row class="my-4" align="center">
              <v-col cols="5">
                <v-list-item two-line class="pl-0">
                  <v-list-item-content>
                    <v-list-item-title
                      class="font-weight-bold text-md-h5 text-h6 mr-2"
                    >
                      Partial
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      User responsens separated by evaluation's steps.
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
              <v-col cols="7">
                <v-btn
                  color="light-green"
                  elevation="2"
                  outlined
                  @click.prevent="download('json')"
                >
                  <v-icon>mdi-code-json</v-icon>
                  <span class="text-md-h5 text-h6 mx-2 font-weight-bold"
                    >JSON</span
                  >
                </v-btn>
                <v-btn
                  color="light-blue"
                  elevation="2"
                  class="ml-2"
                  outlined
                  @click.prevent="download('csv')"
                >
                  <v-icon>mdi-file-delimited-outline </v-icon>
                  <span class="text-md-h5 text-h6 mx-2 font-weight-bold"
                    >CSV</span
                  >
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Evaluation statistics summary download card -->
      <v-col cols="12">
        <v-card>
          <!-- General Summary -->
          <v-card-title
            class="text-h5 font-weight-bold grey--text text--darken-1"
          >
            General Summary
          </v-card-title>
          <v-card-text>
            <v-row justify="center">
              <v-col
                cols="4"
                sm="2"
                v-for="(item, index) in summary.general"
                :key="index"
              >
                <v-list-item two-line class="pl-0">
                  <v-list-item-content class="text-center">
                    <v-list-item-subtitle
                      class="text-lg-h2 text-md-h3 text-sm-h4 text-h4 mr-2"
                    >
                      <number
                        :from="0"
                        :to="item"
                        :duration="animationDuration(item)"
                        :delay="0.5"
                      ></number>
                    </v-list-item-subtitle>
                    <v-list-item-title
                      class="font-weight-bold text-lg-h5 text-md-h6 text-sm-subtitle-1 text-subtitle-2 text-capitalize"
                    >
                      {{ setTextSpaces(index) }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
            </v-row>
          </v-card-text>
          <v-divider class="mx-4"></v-divider>
          <!-- Gender Distribution -->
          <v-card-title
            class="text-h5 font-weight-bold grey--text text--darken-1"
          >
            Gender Distribution
          </v-card-title>
          <v-card-text>
            <v-row justify="center">
              <v-col
                cols="3"
                v-for="(item, index) in summary.gender"
                :key="index"
              >
                <v-list-item two-line class="pl-0">
                  <v-list-item-content class="text-center">
                    <v-list-item-subtitle
                      class="text-lg-h3 text-md-h3 text-sm-h4 text-h4 mr-2"
                    >
                      <number
                        :from="0"
                        :to="item"
                        :duration="animationDuration(item)"
                        :delay="0.5"
                      ></number>
                    </v-list-item-subtitle>
                    <v-list-item-title
                      class="font-weight-bold text-lg-h5 text-md-h6 text-sm-subtitle-1 text-subtitle-2 text-capitalize"
                    >
                      {{ setTextSpaces(index) }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
            </v-row>
          </v-card-text>
          <v-divider class="mx-4"></v-divider>
          <!-- Gender Distribution -->
          <v-card-title
            class="text-h5 font-weight-bold grey--text text--darken-1"
          >
            Age Distribution
          </v-card-title>
          <v-card-text>
            <v-row justify="center">
              <v-col
                cols="4"
                sm="2"
                v-for="(item, index) in summary.age"
                :key="index"
              >
                <v-list-item two-line class="pl-0">
                  <v-list-item-content class="text-center">
                    <v-list-item-subtitle
                      class="text-lg-h4 text-md-h4 text-sm-h5 text-h5 mr-2"
                    >
                      <number
                        :from="0"
                        :to="item"
                        :duration="animationDuration(item)"
                        :delay="0.5"
                      ></number>
                    </v-list-item-subtitle>
                    <v-list-item-title
                      class="font-weight-bold text-lg-h6 text-md-h6 text-sm-subtitle-1 text-subtitle-2 text-capitalize"
                    >
                      {{ setTextSpaces(index) }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "PresenterResultCards",
  props: {
    evaluation: Object,
    statistics: Object,
  },
  computed: {
    ownerInfo() {
      const owner_info = {
        owner: this.evaluation?.owner,
        organization: this.evaluation?.organization ?? "--",
        email: this.evaluation?.email,
      };
      return owner_info;
    },
    otherInfo() {
      const other_info = {
        creation_date: this.formatData(this.evaluation?.creation_date),
        close_date: this.formatData(this.evaluation?.close_date),
        number_of_steps: this.evaluation?.number_of_steps,
      };
      return other_info;
    },
    summary() {
      const summary = {
        general: {
          total_evaluations: this.statistics?.total,
          finished: this.statistics?.finished,
          no_finished: this.statistics?.no_finished,
          consent: this.statistics?.consent,
          no_consent: this.statistics?.no_consent,
        },
        gender: {
          female: this.statistics.gender?.female,
          male: this.statistics.gender?.male,
          intersex: this.statistics.gender?.intersex,
          no_said: this.statistics.gender?.prefer_not_say,
        },
        age: {
          "≤15": this.statistics.age?.group1,
          "16-30": this.statistics.age?.group2,
          "31-45": this.statistics.age?.group3,
          "46-60": this.statistics.age?.group4,
          "61-75": this.statistics.age?.group5,
          ">75": this.statistics.age?.group6,
        },
      };
      return summary;
    },
  },
  methods: {
    setTextSpaces(text) {
      return text.replaceAll("_", " ");
    },
    formatData(date_string) {
      if (date_string) {
        const date = new Date(date_string);
        return date.toLocaleDateString();
      }
      return "--";
    },
    download(option) {
      let params = {};
      params = { type: option === "csv" ? "csv" : "json" };
      if (option === "full") {
        params = { full: true };
      }
      this.$emit("download", params);
    },
    animationDuration(number) {
      if (number < 10) return 0.5;
      if (number < 100) return 1;
      if (number < 1000) return 3;
      return 5;
    },
  },
};
</script>

<style></style>
