<template>
  <div>
    <builder-steps></builder-steps>
    <notification></notification>
  </div>
</template>

<script>
import BuilderSteps from "@/components/BuilderSteps";
import Notification from "@/components/Common/Notification.vue";

export default {
  name: "Steps",
  components: { BuilderSteps, Notification },
};
</script>

<style></style>
