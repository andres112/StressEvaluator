<template>
  <div>
    <presenter-search></presenter-search>
    <notification></notification>
  </div>
</template>

<script>
import PresenterSearch from "@/components/PresenterSearch.vue";
import Notification from "@/components/Common/Notification.vue";

export default {
  name: "HomePresenter",
  components: { PresenterSearch, Notification },
};
</script>
