<template>
  <v-container fluid>
    <p class="text-subtitle-2 green--text" v-if="edition_mode">Label</p>
    <question :content="content" @onDeleteQuestion="deleteQuestion"></question>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import Question from "./Question.vue";

export default {
  name: "Label",
  components: { Question },
  props: {
    content: Object,
  },
  computed: {
    ...mapState({ edition_mode: (state) => state.settings.edition_mode }),
  },
  methods: {
    deleteQuestion() {
      this.$emit("onDeleteQuestion", this.content.id);
    },
  },
};
</script>

<style></style>
