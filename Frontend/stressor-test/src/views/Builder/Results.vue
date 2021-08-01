<template>
  <div>
    <builder-results></builder-results>
    <notification></notification>
  </div>
</template>

<script>
import BuilderResults from "@/components/BuilderResults";
import Notification from "@/components/Common/Notification.vue";
export default {
  name: "Results",

  components: { BuilderResults, Notification },
};
</script>

<style></style>
