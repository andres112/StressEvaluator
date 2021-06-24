<template>
  <div>
    <v-btn icon class="mt-1 mr-0">
      <v-icon large @click.prevent="addStep()">mdi-plus-thick</v-icon>
    </v-btn>
    <v-btn icon v-if="showDelete" class="mt-1 mr-0">
      <v-icon large @click.prevent="delStep()">mdi-trash-can</v-icon>
    </v-btn>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "StepButtons",
  computed: {
    ...mapState({
      current_step: (state) => state.builder.current_step,
    }),
    showDelete() {
      return this.current_step.type !== "consent";
    },
  },
  methods: {
    ...mapActions({ createStep: "builder/createStep", deleteStep: "builder/deleteStep" }),
    addStep() {
      const new_step = {
        test_id: this.current_step.test_id,
        name: "New step",
        type: "new",
        content:{ pages: [{ name: "page 1", elements: [] }] }
      };
      this.createStep(new_step);
    },
    delStep() {
      this.deleteStep(this.current_step);
    },
  },
};
</script>

<style></style>
