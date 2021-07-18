<template>
  <v-card flat>
    <!-- Edition mode section -->
    <v-card-text class="container">
      <h2 class="mb-4 text-subtitle-1 text-md-h6 font-weight-bold">
        {{ getStressorName }}
      </h2>
      <!-- Container for stressor component -->
      <v-row>
        <v-col class="editor-content" ref="editor">
          <v-overlay :value="waiting">
            <v-layout justify="center" align="center">
              <p class="text-h1 font-weight-bold">{{ waiting_msg }}</p>
            </v-layout>
          </v-overlay>
          <component
            :is="getComponent"
            :content="properties"
            :isReady="!waiting"
            :globalTime="step_data.duration"
            ref="stressor"
          ></component>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import NoComponent from "@/components/Common/NoComponent.vue";

export default {
  name: "Stressor",
  components: {
    NoComponent,
  },
  props: {
    step_data: Object,
  },
  data() {
    return {
      answers: {},
      waiting: false,
      waiting_msg: null,
      properties: {},
    };
  },
  created() {
    this.properties =
      typeof this.step_data.content === "object" && !!this.step_data.content
        ? this.step_data.content
        : {};
    if (!this.edition_mode) {
      this.countDown();
    }
  },
  computed: {
    ...mapState({
      edition_mode: (state) => state.settings.edition_mode,
    }),
    // Import components automatically from @/components/Repository path
    dynamicComp() {
      const components = require.context(
        "@/components/Repository",
        false,
        /.*\.vue$/
      );
      return components
        .keys()
        .map((file) => [file.replace(/(^.\/)|(\.vue$)/g, ""), components(file)])
        .reduce((comps, [name, component]) => {
          comps[name] = component.default || component;
          return comps;
        }, {});
    },
    // Get the specific component according stressor dropdown
    getComponent() {
      const selected_comp = this.dynamicComp;
      return (
        Object.values(selected_comp).find(
          (x) => x.meta?.value === this.step_data.stressor
        ) ?? NoComponent
      );
    },
    getStressorName() {
      return this.getComponent?.meta?.text ?? "Please select a Stressor.";
    },
    comp_properties() {
      return this.$refs.stressor.properties;
    },
  },
  methods: {
    ...mapMutations({ setNotifications: "settings/setNotifications" }),
    // Get step configuration content in edition mode
    getContent() {
      return { content: this.comp_properties };
    },
    // Get step answers in user implementation mode
    getAnswer() {
      this.answers.end_time = new Date();
      this.answers.content = this.$refs.stressor.metrics;
      return this.answers;
    },

    // Initinial step contdown
    countDown() {
      this.waiting = true;
      const msg = ["Go!", "Set"];
      let contDown = msg.length;
      this.waiting_msg = "Ready"
      const interval = setInterval(() => {
        this.waiting_msg = msg[contDown - 1];
        if (contDown <= 0) {
          clearInterval(interval);
          this.waiting = false;
          this.playControl();
        }
        contDown--;
      }, 1000);
    },

    //Control the times (global and interval) in presenter time
    playControl() {
      // Initialize answers variable for user response
      this.answers = {
        start_time: new Date(),
        step_id: this.step_data._id,
        type: this.step_data.type,
        end_time: null,
        content: {},
      };
      // Initialize interval for step global time duration
      const stressor_time = setInterval(() => {
        // When time ends, stop internal stressor interval time
        clearInterval(stressor_time);
        // Execute stopTimer in stressor child (stopTimer and startTimer are madatory on children)
        this.$refs.stressor.stopTimer(true);
        this.$emit("onEnd");
      }, this.step_data.duration * 1000);
    },
  },
};
</script>

<style></style>
