<template>
  <div>
    <builder-modify></builder-modify>
    <notification></notification>
  </div>
</template>

<script>
import BuilderModify from "@/components/BuilderModify.vue";
import Notification from "@/components/Common/Notification.vue";
export default {
  name: "Modify",

  components: { BuilderModify, Notification },
};
</script>
