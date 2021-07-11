<template>
  <div>
    <v-btn icon class="mt-1 mr-0">
      <v-icon large icon @click.prevent="addStep()">mdi-plus-thick</v-icon>
    </v-btn>
    <v-btn large icon v-if="showDelete" class="mt-1 mr-0">
      <v-icon @click.prevent="delStep()">mdi-trash-can</v-icon>
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
      return this.current_step?.type !== "consent";
    },
  },
  methods: {
    ...mapActions({
      createStep: "builder/createStep",
      deleteStep: "builder/deleteStep",
    }),
    addStep() {
      this.$emit("onSave", this.current_step._id);
      const new_step = {
        test_id: this.current_step.test_id,
        name: "New step",
        type: "question",
        content: [],
      };
      this.createStep(new_step);
      this.$emit("addStepTab");
    },
    delStep() {
      this.deleteStep(this.current_step);
    },
  },
};
</script>

<style></style>
