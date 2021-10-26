<template>
  <v-container fluid>
    <p class="text-subtitle-2 green--text" v-if="edition_mode">Long Text</p>
    <question :content="content" @onDeleteQuestion="deleteQuestion"></question>

    <v-row align="center">
      <v-col cols="10" class="d-flex" :class="[edition_mode?'ml-8':'ml-2']">
        <v-textarea
          dense
          :disabled="edition_mode"
          color="light-green"
          v-model.trim="answer_selected"
          placeholder="Write your long answer."
          rows="3"
          counter
          maxlength="350"
          no-resize
        ></v-textarea>
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
  name: "LongText",
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
