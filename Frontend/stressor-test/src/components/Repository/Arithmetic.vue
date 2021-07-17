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
          <!-- Interval duration: The time interval used to solve the task -->
          <v-text-field
            v-model.number="properties.int_duration"
            :rules="[rules.required, rules.maxInterval, rules.globalRelation]"
            dense
            type="number"
            label="Interval Duration"
            outlined
            color="light-green"
            class="mr-2 mr-md-6 mb-2"
            suffix="sec"
            background-color="white"
          ></v-text-field>
          <!-- Operation: Simple arithmetic operation -->
          <v-select
            v-model="properties.operation"
            :items="operation_list"
            item-text="text"
            item-value="value"
            dense
            label="Opeartion"
            outlined
            color="light-green"
            class="mr-2 mr-md-6 mb-2"
            background-color="white"
          ></v-select>
          <!-- Seeds: those 3 optional numbers for operating the firts number in arithmetic operation -->
          <v-row class="mb-2">
            <v-col cols="4" class="pr-0">
              <v-text-field
                v-model.number="seeds[0]"
                :rules="[rules.required]"
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
        <v-divider vertical class="my-2" v-if="edition_mode"></v-divider>
        <!-- Interactive component section -->
        <!-- Readonly when editor mode is enabled -->
        <v-col
          cols="offset-xs12"
          :sm="edition_mode ? 7 : 12"
          :md="edition_mode ? 8 : 12"
        >
          <p
            class="mb-6 text-subtitle-2 text-sm-subtitle-1 font-weight-bold"
            v-if="edition_mode"
          >
            Component
          </p>
          <v-row justify="center" class="my-6">
            <v-progress-circular
              :rotate="90"
              :size="300"
              :width="25"
              :color="getColorTime"
              v-model="step_time"
            >
              <p class="text-h2 font-weight-bold">
                {{ properties.int_duration - elapsed_time }}
              </p>
            </v-progress-circular>
          </v-row>
          <v-row justify="center" align="center" class="mb-4">
            <v-col
              cols="12"
              sm="10"
              md="5"
              lg="4"
              xl="3"
              class="d-flex justify-content-around align-center"
            >
              <h1 class="mr-2">{{ first_number }}</h1>
              <v-icon large class="mr-2">{{ getOperator }}</v-icon>
              <h1 class="mr-2">{{ second_number }}</h1>
              <v-icon large class="mr-4">mdi-equal</v-icon>
              <v-text-field
                v-model.number="result"
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
import { mapState, mapMutations } from "vuex";

// Build the stressor's properties only with parameter
const buildProperty = function(obj) {
  const { int_duration = 30, operation = "add", seed = [] } = obj;
  return {
    int_duration: int_duration,
    operation: operation,
    seed: seed,
  };
};

export default {
  name: "Arithmetic",
  props: {
    content: Object,
    isReady: Boolean,
    globalTime: Number,
  },
  data() {
    return {
      rules: {
        required: (value) => !!value || "Required.",
        maxInterval: (value) => value <= 300 || "Max. time 300s",
        globalRelation: (value) => this.globalTime % value == 0 || "This must be multiple and less than step duration",
      },
      operation_list: [
        { value: "add", text: "Add" },
        { value: "sub", text: "Subtract" },
        { value: "div", text: "Divide" },
        { value: "mul", text: "Multiply" },
      ],
      seeds: [null, null, null],

      interval: {},
      step_time: 0,
      elapsed_time: 0,

      first_number: 0,
      second_number: 0,
      result: null,

      properties: {
        int_duration: 0,
        operation: "add",
        seed: [],
      },

      metrics: {
        errors: 0,
        hits: 0,
        total: 0,
        not_ans: 0,
      },
    };
  },
  // This meta parameter allows identify this component globally
  // Must be similar than stressorList.json
  meta: { text: "Mental Arithmetic", value: "arithmetic" },
  created() {
    this.properties = buildProperty(this.content);
    this.properties.seed.forEach((x, i) => (this.seeds[i] = x));
    this.createFirstNumber();
    this.getSecondNumber();
  },
  beforeDestroy() {
    this.stopTimer();
  },
  computed: {
    ...mapState({
      edition_mode: (state) => state.settings.edition_mode,
    }),
    getOperator() {
      if (this.properties.operation == "add") return "mdi-plus";
      if (this.properties.operation == "sub") return "mdi-minus";
      if (this.properties.operation == "mul") return "mdi-close";
      if (this.properties.operation == "div") return "mdi-division";
    },
    getColorTime() {
      if (this.step_time < 50) return "light-blue";
      if (this.step_time < 85) return "yellow darken-1";
      if (this.step_time <= 100) return "deep-orange accent-3";
    },
    getResult() {
      if (this.properties.operation == "add")
        return this.first_number + this.second_number;
      if (this.properties.operation == "sub")
        return this.first_number - this.second_number;
      if (this.properties.operation == "mul")
        return this.first_number * this.second_number;
      if (this.properties.operation == "div")
        return Math.trunc(this.first_number / this.second_number);
    },
  },
  methods: {
    ...mapMutations({ setNotifications: "settings/setNotifications" }),
    // Create the first number of the operation according operation choosen
    createFirstNumber() {
      if (["sub", "div"].includes(this.properties.operation))
        this.first_number = Math.floor(1000 + Math.random() * 9000);
      if (["add", "mul"].includes(this.properties.operation))
        this.first_number = Math.floor(1 + Math.random() * 999);
    },
    // Get the second number randomly from seeds
    getSecondNumber() {
      const len = this.properties.seed.length;
      if (len <= 0) return (this.second_number = 0);
      const item = Math.floor(Math.random() * len);
      this.second_number = this.properties.seed[item];
    },
    // Validate result ingressed by user
    validateResult() {
      if (this.result > this.getResult) {
        this.metrics.errors++;
        this.stopTimer();
        this.playTimer();
        this.sendNotification("Incorrect!", "error");
        return;
      }
      if (this.result == this.getResult) {
        this.metrics.hits++;
        this.stopTimer();
        this.playTimer();
        this.sendNotification("Correct!", "ok");
        return;
      }
    },
    // Time representation in circular progress.
    playTimer() {
      this.step_time = 0;
      const rel_time = 100 / this.properties.int_duration;
      this.interval = setInterval(() => {
        if (this.step_time >= 100) {
          this.clearData();
          this.metrics.total++;
          this.metrics.not_ans++;
          this.sendNotification("Not Answered", "error");
          return;
        }
        this.step_time += rel_time;
        if (this.properties.int_duration - this.elapsed_time > 0)
          this.elapsed_time++;
      }, 1000);
    },
    // Stop current interval
    stopTimer() {
      this.clearData();
      this.metrics.total++;
      clearInterval(this.interval);
    },
    // Clear values, usually after stop interval
    clearData() {
      this.step_time = 0;
      this.elapsed_time = 0;
      this.result = null;
      this.createFirstNumber();
      this.getSecondNumber();
    },
    sendNotification(msg, type) {
      const notification = {
        isOn: true,
        text: msg,
        timeout: 1000,
        status: type,
      };
      this.setNotifications(notification);
    },
  },
  watch: {
    seeds: {
      handler() {
        this.properties.seed = this.seeds.filter((x) => x != null && x != "");
      },
      deep: true,
    },
    isReady() {
      if (this.isReady) this.playTimer();
    },
    result() {
      this.validateResult();
    },
  },
};
</script>

<style></style>
