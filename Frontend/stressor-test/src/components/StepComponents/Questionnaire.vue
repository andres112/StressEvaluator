<template>
  <v-card flat>
    <!-- Edition mode section -->
    <v-card-text v-if="edition_mode">
      <v-row>
        <v-col cols="3" sm="2" class="editor-toolbox">
          <p class="mb-2 text-subtitle-2 text-sm-subtitle-1 font-weight-bold">
            Toolbox
          </p>
          <v-list flat style="background-color:transparent">
            <v-list-item-group
              v-model="selectedItem"
              color="light-green darken-2"
            >
              <v-list-item
                v-for="(item, i) in items"
                :key="i"
                @click="addTool(item.value)"
              >
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
        <v-col cols="9" class="pr-0">
          <h2
            class="mb-4 text-subtitle-2 text-sm-subtitle-1 font-weight-bold editor-title"
          >
            Editor
          </h2>
          <v-row>
            <v-col cols="12" class="editor-content" ref="editor">
              <v-card
                v-for="question in survey"
                :key="question.id"
                class="mb-4 question-card"
                shaped
                :ripple="false"
                :elevation="isSelectedCard(question.id)"
                @input="selectCard(question.id)"
                :outlined="isSelectedCard(question.id) > 2"
              >
                <component
                  :is="getToolComponent(question.type)"
                  :content="question"
                  @onDeleteQuestion="onDeleteQuestion"
                ></component>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card-text>

    <!-- User Implementation section -->
    <v-card-text v-else class="presenter container">
      <v-card
        v-for="(question, item) in survey"
        :key="question.id"
        class="mb-4"
        shaped
      >
        <v-subheader class="text-subtitle-1 blue--text"
          >{{ `Question ${item + 1}` }}
        </v-subheader>
        <component
          :is="getToolComponent(question.type)"
          :content="question"
          :ref="`ans-${question.id}`"
        ></component>
      </v-card>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState } from "vuex";
import { createNanoId } from "@/assets/helpers.js";
import Checkbox from "../SurveyTools/Checkbox.vue";
import Radiogroup from "../SurveyTools/Radiogroup.vue";
import Dropdown from "../SurveyTools/Dropdown.vue";
import SingleText from "../SurveyTools/SingleText.vue";
import LongText from "../SurveyTools/LongText.vue";
import LinearScale from "../SurveyTools/LinearScale.vue";
import Grid from "../SurveyTools/Grid.vue";

export default {
  name: "Questionnaire",
  components: {
    Checkbox,
    Radiogroup,
    Dropdown,
    SingleText,
    LongText,
    LinearScale,
    Grid,
  },
  props: {
    step_data: Object,
  },
  data: () => ({
    survey: [],
    answers: {},
    selectedItem: null,
    selectedCard: null,
    items: [
      {
        text: "Checkbox",
        icon: "mdi-checkbox-marked-outline",
        value: "checkbox",
      },
      { text: "Radiogroup", icon: "mdi-check-circle-outline", value: "radio" },
      { text: "Dropdown", icon: "mdi-form-dropdown", value: "dropdown" },
      { text: "Single Text", icon: "mdi-format-text", value: "single" },
      { text: "Long Text", icon: "mdi-text", value: "long" },
      { text: "Linear Scale", icon: "mdi-dots-horizontal", value: "rating" },
      { text: "Radiogroup Grid", icon: "mdi-dots-grid", value: "radiogrid" },
      { text: "Checkbox Grid", icon: "mdi-view-grid", value: "checkboxgrid" },
    ],
  }),
  mounted() {
    this.survey = Array.isArray(this.step_data?.content?.questions)
      ? this.step_data.content.questions
      : [];
  },
  created() {
    if (!this.edition_mode) {
      // Initialize answers variable for user response
      this.answers = {
        start_time: new Date(),
        step_id: this.step_data._id,
        type: this.step_data.type,
        end_time: null,
        content: [],
      };
    }
  },
  computed: {
    ...mapState({ edition_mode: (state) => state.settings.edition_mode }),
  },
  methods: {
    addTool(tool) {
      const aux = this;
      let q = {
        id: createNanoId(),
        question: null,
        type: tool,
        required: false,
        options: null,
      };
      if (["checkbox", "radio", "dropdown"].includes(tool)) {
        q.options = [];
      }
      if (tool == "dropdown") {
        q["multiple"] = false;
      }
      if (tool == "rating") {
        q.options = 5;
      }
      if (["radiogrid", "checkboxgrid"].includes(tool)) {
        q.options = { rows: [], columns: [] };
      }
      // Data structure for question
      this.survey.push(q);

      // auto scrolling after adding new question
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
      if (tool == "dropdown") {
        return Dropdown;
      }
      if (tool == "single") {
        return SingleText;
      }
      if (tool == "long") {
        return LongText;
      }
      if (tool == "rating") {
        return LinearScale;
      }
      if (["radiogrid", "checkboxgrid"].includes(tool)) {
        return Grid;
      }
    },
    onDeleteQuestion(question_id) {
      this.survey = this.survey.filter((x) => x.id != question_id);
    },
    // Get step configuration content in edition mode
    getContent() {
      return { content: { questions: this.survey } };
    },
    // Get step answers in user implementation mode
    getAnswer() {
      const aux = this;
      this.answers.end_time = new Date();
      // Get all the answers given by user
      this.answers.content = this.survey.map(function(x) {
        return {
          id: x.id,
          question: x.question,
          type: x.type,
          answers: aux.$refs[`ans-${x.id}`][0].answer_selected,
        };
      });
      return this.answers;
    },
    selectCard(qId) {
      this.selectedCard = qId;
    },
    isSelectedCard(qId) {
      return qId == this.selectedCard ? 20 : 2;
    },
  },
};
</script>
<style scoped></style>
