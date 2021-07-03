<template>
  <v-card flat>
    <v-card-text>
      <v-row>
        <!-- Propierties section -->
        <v-col
          cols="offset-xs12"
          sm="5"
          md="4"
          lg="3"
          class="editor-toolbox"
          v-if="edition_mode"
        >
          <p class="mb-6 text-subtitle-2 text-sm-subtitle-1 font-weight-bold">
            Properties
          </p>
          <v-text-field
            v-model.number="properties.int_duration"
            dense
            type="number"
            label="Interval Duration"
            outlined
            color="light-green"
            class="mr-2 mr-md-6"
            suffix="sec"
            background-color="white"
          ></v-text-field>
          <v-select
            v-model="properties.operation"
            :items="operation_list"
            item-text="text"
            item-value="value"
            dense
            label="Opeartion"
            outlined
            color="light-green"
            class="mr-2 mr-md-6"
            background-color="white"
          ></v-select>
          <v-row>
            <v-col cols="4" class="pr-0">
              <v-text-field
                v-model.number="seeds[0]"
                dense
                type="number"
                label="Seed 1"
                outlined
                color="light-green"
                class="mr-2"
                background-color="white"
              ></v-text-field>
            </v-col>
            <v-col cols="4" class="px-0">
              <v-text-field
                v-model.number="seeds[1]"
                dense
                type="number"
                label="Seed 2"
                outlined
                color="light-green"
                class="mr-2"
                background-color="white"
              ></v-text-field>
            </v-col>
            <v-col cols="4" class="pl-0">
              <v-text-field
                v-model.number="seeds[2]"
                dense
                type="number"
                label="Seed 3"
                outlined
                color="light-green"
                class="mr-2"
                background-color="white"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-col>
        <v-divider vertical class="my-2"></v-divider>
        <!-- Interactive component section -->
        <!-- Readonly when editor mode is enabled -->
        <v-col
          cols="offset-xs12"
          :sm="edition_mode ? 7 : 11"
          :md="edition_mode ? 8 : 11"
        >
          <p
            class="mb-6 text-subtitle-2 text-sm-subtitle-1 font-weight-bold"
            v-if="edition_mode"
          >
            Component
          </p>
          <v-row justify="center" class="mb-6">
            <v-progress-circular
              :rotate="90"
              :size="300"
              :width="25"
              color="orange"
              v-model="step_time"
            >
              <p class="text-h2 font-weight-bold">
                {{ this.properties.int_duration - current_time }}
              </p>
            </v-progress-circular>
          </v-row>
          <v-row justify="center" align="center">
            <v-col
              cols="12"
              sm="10"
              md="5"
              lg="4"
              xl="3"
              class="d-flex justify-content-around align-center"
            >
              <h1 class="mr-2">1250</h1>
              <v-icon large class="mr-2">{{ getOperator }}</v-icon>
              <h1 class="mr-2">45</h1>
              <v-icon large class="mr-4">mdi-equal</v-icon>
              <v-text-field
                dense
                type="number"
                color="light-green"
                class="text-h6"
                :disabled="edition_mode"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Arithmetic",
  props: {
    content: Object,
  },
  data() {
    return {
      operation_list: [
        { value: "add", text: "Add" },
        { value: "sub", text: "Subtract" },
        { value: "div", text: "Divide" },
        { value: "mul", text: "Multiply" },
      ],
      interval: {},
      step_time: 0,
      current_time: 0,
      seeds: [null, null, null],
      properties: {
        int_duration: 0,
        operation: "add",
        seed: [],
      },
    };
  },
  // This meta parameter allows identify this component globally
  // Must be similar than stressorList.json
  meta: { text: "Mental Arithmetic", value: "arithmetic" },
  mounted() {
    //TODO: validate data comming from stressor component
    this.properties = this.content;
    this.properties.seed.forEach((x, i) => (this.seeds[i] = x));
    this.step_time = this.edition_mode ? 50 : 0;
    //TODO: organize this in separate function, validate errors
    if (!this.edition_mode) {
      const rel_time = 100 / this.properties.int_duration;
      this.interval = setInterval(() => {
        if (this.step_time === 100) {
          clearInterval(this.interval);
          this.step_time = 0;
          this.current_time = 0;
          return;
        }
        this.current_time++;
        this.step_time += rel_time;
      }, 1000);
    }
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  computed: {
    ...mapState({
      edition_mode: (state) => state.settings.edition_mode,
    }),
    getOperator() {
      if (this.properties.operation == "add") return "mdi-plus-thick";
      if (this.properties.operation == "sub") return "mdi-minus-thick";
      if (this.properties.operation == "mul") return "mdi-close-thick";
      if (this.properties.operation == "div") return "mdi-division";
    },
  },
  methods: {
    // Method for return error or hint and time of response
    // Total of tasks shall be carried out in Stressor parent component
  },
  watch: {
    seeds: {
      handler() {
        this.properties.seed = Object.values(this.seeds);
      },
      deep: true,
    },
  },
};
</script>

<style></style>
