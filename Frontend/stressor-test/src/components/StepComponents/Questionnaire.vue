<template>
  <v-card>
    <v-card-text v-if="edition_mode">
      <v-row>
        <v-col cols="3" sm="2" md="3" class="editor-toolbox">
          <p class="mb-2 text-subtitle-2 text-sm-subtitle-1 text-md-h6 font-weight-bold">Toolbox</p>
          <v-list flat class="editor-toolbox">
            <v-list-item-group v-model="selectedItem" color="light-green">
              <v-list-item v-for="(item, i) in items" :key="i" @click="addTool(item.value)">
                <v-list-item-icon>
                  <v-icon v-text="item.icon"></v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="item.text"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-col>
        <v-divider vertical class="my-2"></v-divider>
        <v-col cols="9" sm="10" md="9" class="editor-question" ref="editor">
          <h2 class="mb-2 text-subtitle-2 text-sm-subtitle-1 text-md-h6 font-weight-bold">
            Editor
          </h2>
          <v-card v-for="question in survey" :key="question.id" class="mb-4" shaped>
            <component
              :is="getToolComponent(question.type)"
              :content="question"
              @onDeleteQuestion="onDeleteQuestion"
            ></component>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-text v-else class="presenter-question">
      <v-card v-for="question in survey" :key="question.id" class="mb-4" shaped>
        <component :is="getToolComponent(question.type)" :content="question"></component>
      </v-card>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState } from "vuex";
import { createNanoId } from "@/assets/helpers.js";
import Checkbox from "../SurveyTools/Checkbox.vue";
import Radiogroup from "../SurveyTools/Radiogroup.vue";

export default {
  components: {
    Checkbox,
    Radiogroup,
  },
  props: {
    step_content: Array,
  },
  data: () => ({
    survey: [],
    answers: [],
    selectedItem: null,
    items: [
      { text: "Checkbox", icon: "mdi-checkbox-marked", value: "checkbox" },
      { text: "Radiogroup", icon: "mdi-radiobox-marked", value: "radio" },
      { text: "Dropdown", icon: "mdi-form-dropdown", value: "dropdown" },
      { text: "Single Input", icon: "mdi-format-text", value: "single" },
      { text: "Comment", icon: "mdi-comment-text", value: "comment" },
      { text: "Rating", icon: "mdi-star", value: "rating" },
      { text: "Boolean", icon: "mdi-toggle-switch-off", value: "boolean" },
    ],
  }),
  mounted() {
    this.survey = this.step_content;
  },
  computed: {
    ...mapState({ edition_mode: (state) => state.settings.edition_mode }),
  },
  methods: {
    addTool(tool) {
      const aux = this;
      this.survey.push({
        id: createNanoId(),
        question: null,
        type: tool,
        required: false,
        options: [],
      });
      setTimeout(function() {
        aux.$refs.editor.scrollTo({
          top: aux.$refs.editor.scrollHeight,
          behavior: "smooth",
        });
      }, 2);
    },
    getToolComponent(tool) {
      if (tool == "checkbox") {
        return Checkbox;
      }
      if (tool == "radio") {
        return Radiogroup;
      }
    },
    onDeleteQuestion(question_id) {
      this.survey = this.survey.filter((x) => x.id != question_id);
    },
    getContent() {
      return { content: this.survey };
    },
  },
};
</script>
<style scoped>
.editor-toolbox {
  background-color: #f1f8e9;
}
.editor-question {
  height: 70vh;
  max-height: 75vh;
  overflow-y: auto;
}
.presenter-question {
  height: 80vh;
  max-height: 90vh;
  overflow-y: auto;
}
</style>
