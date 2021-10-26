<template>
  <v-container fluid>
    <!-- Label section - Strong title -->
    <p class="text-subtitle-2 green--text" v-if="edition_mode">Label</p>
    <question :content="content" @onDeleteQuestion="deleteQuestion"></question>
    <p
      class=" description text-subtitle-2 text-sm-subtitle-1 ml-1 mt-5"
      v-if="!edition_mode && content.description "
    >
      {{ content.description }}
    </p>
    <!-- Description section - normal subtitle -->
    <v-row align="center" v-else>
      <v-col cols="10" class="d-flex">
        <v-textarea
          dense
          color="light-green"
          v-model.trim="content.description"
          placeholder="Write a short description."
          rows="2"
          counter
          maxlength="250"
          no-resize
        ></v-textarea>
      </v-col>
    </v-row>
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
