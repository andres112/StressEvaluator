<template>
  <div id="creatorElement" class="editor-question" />
</template>

<script>
import * as SurveyCreator from "survey-creator";
import "survey-creator/survey-creator.css";
import "survey-knockout/survey.css";

export default {
  name: "surveyjs-creator-component",
  props: {
    step_content: Object,
  },
  data() {
    return {
      creator: null,
    };
  },
  mounted() {
    SurveyCreator.SurveyNestedPropertyEditorItem.dragIconName = "icon-custom-drag";
    SurveyCreator.SurveyNestedPropertyEditorItem.deleteIconName = "icon-custom-delete";

    var mainColor = "#7ff07f";
    var mainHoverColor = "#6fe06f";
    var textColor = "#4a4a4a";
    var defaultThemeColorsEditor = SurveyCreator.StylesManager.ThemeColors["default"];
    defaultThemeColorsEditor["$primary-color"] = mainColor;
    defaultThemeColorsEditor["$secondary-color"] = mainColor;
    defaultThemeColorsEditor["$primary-hover-color"] = mainHoverColor;
    defaultThemeColorsEditor["$primary-text-color"] = textColor;
    defaultThemeColorsEditor["$selection-border-color"] = mainColor;

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
      pageEditMode: "multiple",
      showTitlesInExpressions: false,
      allowControlSurveyTitleVisibility: false,
      showSurveyTitle: "never",
      showOptions: false,
      isAutoSave: true,
      designerHeight: "75vh",
    };
    //create the SurveyJS Creator and render it in div with id equals to "creatorElement"
    this.creator = new SurveyCreator.SurveyCreator("creatorElement", options);
    //Show toolbox in the right container. It is shown on the left by default
    this.creator.showToolbox = "left";
    //Show property grid in the right container, combined with toolbox
    this.creator.showPropertyGrid = "left";
    // Remove survey setting button: For the simplicity of this implementation
    this.creator.toolbarItems.remove((x) => x.id === "svd-survey-settings");
    this.creator.onShowingProperty.add(function(sender, options) {
      if (options.obj.getType() == "survey") {
        options.canShow = options.property.name == "";
      }
    });

    //Make toolbox active by default
    this.creator.rightContainerActiveItem("toolbox");
    //Remove default properties layout in property grid and have only one "general" category.
    SurveyCreator.SurveyQuestionEditorDefinition.definition = {};

    // Load existent questionnaire
    if (this.step_content) {
      this.creator.text = JSON.stringify(this.step_content);
    }
  },
  methods: {
    getContent() {
      const survey_json = JSON.parse(this.creator.text);
      return { content: survey_json };
    },
  },
};
</script>

<style lang="scss" scoped>
.editor-question {
  height: 75vh;
  min-height: 75vh;
  overflow-y: auto;
}
</style>
