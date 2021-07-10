<template>
  <div>
    <presenter-evaluation></presenter-evaluation>
    <notification></notification>
  </div>
</template>

<script>
import PresenterEvaluation from "@/components/PresenterEvaluation";
import Notification from "@/components/Common/Notification";

export default {
  name: "Evaluation",
  components: { PresenterEvaluation, Notification },
};
</script>

<style></style>
