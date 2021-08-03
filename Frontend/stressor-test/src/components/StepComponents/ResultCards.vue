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
          <v-card-title
            class="text-h5 font-weight-bold grey--text text--darken-1"
          >
            General Summary
          </v-card-title>
          <pre>{{ statistics }}</pre>
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
        creation_date: this.formatDate(this.evaluation?.creation_date),
        close_date: this.formatDate(this.evaluation?.close_date),
        number_of_steps: this.evaluation?.number_of_steps,
      };
      return other_info;
    },
  },
  methods: {
    setTextSpaces(text) {
      return text.replaceAll("_", " ");
    },
    formatDate(date_string) {
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
  },
};
</script>

<style></style>
