<template>
  <v-container class="mt-4">
    <v-row dense>
      <!-- Evaluation information card -->
      <v-col cols="6">
        <v-card>
          <v-card-title class="text-h5 font-weight-bold">Information</v-card-title>
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
            <v-row class="mb-4">
              <v-col
                cols="12"
                md="6"
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
            <v-row class="mb-4">
              <v-col
                cols="12"
                md="6"
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
      <v-col cols="6">
        <v-card>
          <v-card-title>Downloads</v-card-title>
          <v-card-text>
            {{ evaluation }}
          </v-card-text>
        </v-card>
      </v-col>
      <!-- Evaluation statistics summary download card -->
      <v-col cols="12">
        <v-card><v-card-title>Summary</v-card-title></v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "PresenterResultCards",
  props: {
    evaluation: Object,
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
        steps: this.evaluation?.number_of_steps,
      };
      return other_info;
    },
  },
  methods: {
    setTextSpaces(text) {
      return text.replace("_", " ");
    },
    formatDate(date_string) {
      if (date_string) {
        const date = new Date(date_string);
        return date.toLocaleDateString();
      }
      return "--";
    },
  },
};
</script>

<style></style>
