<template>
  <v-card flat>
    <!-- Edition mode section -->
    <v-card-text>
      <h2 class="mb-4 text-subtitle-1 text-md-h6 font-weight-bold">
        {{ getStressorName }}
      </h2>
      <!-- Container for stressor component -->
      <v-row>
        <v-col class="editor-content" ref="editor">
          <component
            :is="getComponent"
            :content="step_content"
            ref="stressor"
          ></component>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Stressor",
  props: {
    step_content: Object,
  },
  data() {
    return {
      metrics: null,
    };
  },
  created() {
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
      return Object.values(selected_comp).find(
        (x) => x.meta?.value === this.current_step.stressor
      );
    },
    getStressorName() {
      return this.getComponent?.meta?.text ?? "Please select a Stressor.";
    },
  },
  methods: {
    getContent() {
      const properties = this.$refs.stressor.properties;
      return { content: properties };
    },
  },
};
</script>

<style></style>
