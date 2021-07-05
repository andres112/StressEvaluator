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
    step_content: Object,
  },
  data() {
    return {
      metrics: null,
      waiting: false,
      waiting_msg: null,
      properties: {},
    };
  },
  created() {
    this.properties =
      typeof this.step_content.content === "object" &&
      !!this.step_content.content
        ? this.step_content.content
        : {};
    if (!this.edition_mode) {
      this.countDown();
    }
  },
  computed: {
    ...mapState({
      edition_mode: (state) => state.settings.edition_mode,
      current_step: (state) => state.builder.current_step,
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
          (x) => x.meta?.value === this.current_step.stressor
        ) ?? NoComponent
      );
    },
    getStressorName() {
      return this.getComponent?.meta?.text ?? "Please select a Stressor.";
    },
  },
  methods: {
    ...mapMutations({ setNotifications: "settings/setNotifications" }),
    getContent() {
      const properties = this.$refs.stressor.properties;
      return { content: properties };
    },
    countDown() {
      this.waiting = true;
      const msg = ["Go!", "Set", "Ready"];
      let contDown = msg.length;
      const interval = setInterval(() => {
        this.waiting_msg = msg[contDown - 1];
        if (contDown <= 0) {
          clearInterval(interval);
          this.waiting = false;
        }
        contDown--;
      }, 1000);
    },
  },
};
</script>

<style></style>
