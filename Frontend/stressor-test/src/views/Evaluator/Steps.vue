<template>
  <h1>{{ test_id }}</h1>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Steps",
  computed: {
    ...mapState({ test_id: (state) => state.evaluator.test_id }),
  },
};
</script>

<style></style>
