<template>
  <div id="creatorElement" class="editor-question" />
</template>

<script>
import * as SurveyCreator from "survey-creator";
import "survey-creator/survey-creator.css";
import "survey-knockout/survey.css";

export default {
  name: "surveyjs-creator-component",
  data() {
    return {
      creator: null,
    };
  },
  mounted() {
    SurveyCreator.SurveyNestedPropertyEditorItem.dragIconName =
      "icon-custom-drag";
    SurveyCreator.SurveyNestedPropertyEditorItem.deleteIconName =
      "icon-custom-delete";

    SurveyCreator.StylesManager.applyTheme();

    // Show Designer, Test Survey, JSON Editor and additionally Logic tabs
    var options = {
      showLogicTab: false,
      showJSONEditorTab: false,
      questionTypes: [
        "text",
        "checkbox",
        "radiogroup",
        "dropdown",
        "comment",
        "rating",
        "imagepicker",
        "boolean",
      ],
      pageEditMode: "single",
      showTitlesInExpressions: true,
      allowEditExpressionsInTextEditor: false,
      showSurveyTitle: "never",
    };
    //create the SurveyJS Creator and render it in div with id equals to "creatorElement"
    this.creator = new SurveyCreator.SurveyCreator("creatorElement", options);
    //Show toolbox in the right container. It is shown on the left by default
    this.creator.showToolbox = "left";
    //Show property grid in the right container, combined with toolbox
    this.creator.showPropertyGrid = "right";
    //Make toolbox active by default
    this.creator.rightContainerActiveItem("toolbox");
    //Remove default properties layout in property grid and have only one "general" category.
    SurveyCreator.SurveyQuestionEditorDefinition.definition = {};
    // set function on save callback
    // SurveyCreator.saveSurveyFunc = this.getContent();
  },
  methods: {
    getContent() {
      var yourNewSurveyJSON = this.creator.text;
      console.log(yourNewSurveyJSON);
      //send updated json in your storage
    },
  },
};
</script>

<style scoped>
.editor-question {
  height: 80vh;
  min-height: 75vh;
  overflow-y: auto;
}
</style>
