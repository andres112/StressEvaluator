<template>
  <v-container fluid>
    <p class="text-subtitle-2 green--text" v-if="edition_mode">Single Text</p>
    <question :content="content" @onDeleteQuestion="deleteQuestion"></question>

    <v-row align="center">
      <v-col cols="10" class="d-flex" :class="[edition_mode?'ml-8':'ml-2']">
        <v-text-field
          dense
          :disabled="edition_mode"
          color="light-green"
          v-model="answer_selected"
          placeholder="Write your short answer."
          counter
          maxlength="100"
        ></v-text-field>
      </v-col>
    </v-row>

    <!-- Question settings -->
    <div v-if="edition_mode">
      <div class="d-inline-flex">
        <v-checkbox dense v-model="content.required" class="ml-1" label="Required"></v-checkbox>
      </div>
    </div>
  </v-container>
</template>
<script>
import { mapState } from "vuex";
import Question from "./Question.vue";

export default {
  name: "SingleText",
  components: { Question },
  props: {
    content: Object,
  },
  data() {
    return {
      answer_selected: null,
    };
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
