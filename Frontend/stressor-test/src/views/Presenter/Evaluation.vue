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
  name: "EvaluationPresenter",
  components: { PresenterEvaluation, Notification },
};
</script>

<style></style>
