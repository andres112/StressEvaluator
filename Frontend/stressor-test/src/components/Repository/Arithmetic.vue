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
          <v-form ref="properties_settings">
            <!-- Interval duration: The time interval used to solve the task -->
            <v-text-field
              v-model.number="properties.interval_duration"
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
          </v-form>
        </v-col>
        <v-divider vertical class="my-2" v-if="edition_mode"></v-divider>
        <!-- Interactive component section -->
        <!-- Readonly when editor mode is enabled -->
        <v-col
          cols="offset-xs12"
          :sm="edition_mode ? 7 : 12"
          :md="edition_mode ? 8 : 12"
        >
          <!-- Image indicator for sensor measurement  -->
          <div class="float-right mx-0">
            <v-img
              contain
              max-width="100"
              src="https://firebasestorage.googleapis.com/v0/b/empathy-74497.appspot.com/o/hand_sensor_icon.png?alt=media&token=a01e1cbd-169a-43af-a3c5-f386a33530f5"
            ></v-img>
          </div>
          <!-- --------------------------------------- -->
          <p
            class="mb-6 text-subtitle-2 text-sm-subtitle-1 font-weight-bold"
            v-if="edition_mode"
          >
            Component
          </p>
          <v-row justify="center" class="my-6" :class="getAnimation">
            <v-progress-circular
              :rotate="90"
              :size="300"
              :width="25"
              :color="getColorTime"
              v-model="step_time"
            >
              <p class="text-h2 font-weight-bold">
                {{ properties.interval_duration - elapsed_time }}
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
                autofocus
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
import { playSound } from "@/assets/helpers";
import "animate.css";

// Build the stressor's properties only with parameter
const buildProperty = function(obj) {
  const { interval_duration = 30, operation = "add", seed = [] } = obj;
  return {
    interval_duration: interval_duration,
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
        globalRelation: (value) =>
          this.globalTime % value == 0 ||
          "This must be multiple and smaller than step duration",
      },
      operation_list: [
        { value: "add", text: "Add" },
        { value: "sub", text: "Subtract" },
        { value: "div", text: "Divide" },
        { value: "mul", text: "Multiply" },
      ],
      seeds: [null, null, null],

      animate: false,

      interval: {},
      step_time: 0,
      elapsed_time: 0,

      first_number: 0,
      second_number: 0,
      result: null,

      properties: {
        interval_duration: 0,
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
    this.animate = false;
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
    getAnimation() {
      if (this.animate) return "animate__animated animate__headShake";
    },
  },
  methods: {
    ...mapMutations({ setNotifications: "settings/setNotifications" }),
    // Create the first number of the operation according operation choosen
    createFirstNumber() {
      if (["sub", "add"].includes(this.properties.operation))
        this.first_number = Math.floor(1000 + Math.random() * 99999);
      if (["div"].includes(this.properties.operation))
        this.first_number = Math.floor(1000 + Math.random() * 9999);
      if (["mul"].includes(this.properties.operation))
        this.first_number = Math.floor(10 + Math.random() * 999);
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
        this.playSound("incorrect");
        this.stopTimer();
        this.playTimer();
        this.sendNotification("Incorrect!", "error");
        return;
      }
      if (this.result == this.getResult) {
        this.metrics.hits++;
        this.playSound("correct");
        this.stopTimer();
        this.playTimer();
        this.sendNotification("Correct!", "ok");
        return;
      }
    },
    // Time representation in circular progress.
    playTimer() {
      this.step_time = 0;
      const rel_time = 100 / this.properties.interval_duration;
      this.interval = setInterval(() => {
        this.elapsed_time++;
        if (this.step_time >= 100) {
          this.clearData(rel_time, 1);
          this.metrics.total++;
          this.metrics.not_ans++;
          this.playSound("incorrect");
          this.sendNotification("Not Answered", "error");
          return;
        }
        this.step_time += rel_time;
      }, 1000);
    },
    // Stop current interval
    stopTimer(ext = false) {
      // Validate if stop timer is done for external source (global time)
      if (ext) this.metrics.not_ans++;
      this.clearData();
      this.metrics.total++;
      clearInterval(this.interval);
    },
    // Clear values, usually after stop interval
    clearData(st = 0, et = 0) {
      this.step_time = st;
      this.elapsed_time = et;
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
    // Play a sound for result validation - shake animation when incorrect
    playSound(sound) {
      playSound(sound);
      if (sound == "incorrect") {
        this.animate = true;
        setTimeout(() => {
          this.animate = false;
        }, 1000);
      }
    },
  },
  watch: {
    seeds: {
      handler() {
        this.properties.seed = this.seeds.filter((x) => x != null && x != "");
      },
      deep: true,
    },
    // For asynchronous validation of global time
    async globalTime() {
      if (this.edition_mode) {
        await this.$nextTick();
        this.$refs.properties_settings.validate();
      }
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
