<template>
  <v-layout justify-center align-center fill-height>
    <v-card class="text-center" elevation="0">
      <v-card-title class="text-md-h1 text-sm-h3 text-h4 font-weight-bold">
        Stress Evaluator
      </v-card-title>
      <p class="text-subtitle-2 mb-6 green--text">Builder Mode</p>
      <v-card-text>
        <v-col cols="8" md="4" class="mx-auto">
          <v-btn
            color="light-green"
            class="my-4 text-capitalize mt-6"
            x-large
            dark
            block
            @click.prevent="onClick('/builder/create')"
          >
            <v-icon left large>
              mdi-flask-plus
            </v-icon>
            <span class="text-subtitle-1 text-sm-h5 font-weight-bold mx-2"
              >Create</span
            >
          </v-btn>
          <v-btn
            color="light-green"
            class="my-4 text-capitalize"
            x-large
            dark
            block
            @click.prevent="onClick('/builder/modify')"
          >
            <v-icon left large>
              mdi-lead-pencil
            </v-icon>
            <span class="text-subtitle-1 text-sm-h5 font-weight-bold mx-2"
              >Modify</span
            >
          </v-btn>
          <v-btn
            color="light-green"
            class="my-4 text-capitalize"
            x-large
            dark
            block
            @click.prevent="onClick('/builder/results')"
          >
            <v-icon left large>
              mdi-chart-timeline-variant-shimmer
            </v-icon>
            <span class="text-subtitle-1 text-sm-h5 font-weight-bold mx-1"
              >Results</span
            >
          </v-btn>
        </v-col>
      </v-card-text>
    </v-card>
  </v-layout>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  name: "BuilderMenu",
  created() {
    this.cleanStates();
  },
  methods: {
    ...mapMutations({ cleanStates: "builder/cleanStates" }),
    onClick(route) {
      this.$router.push(`${route}`);
    },
  },
  
};
</script>
<style></style>
