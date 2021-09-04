<template>
  <v-container class="py-0 px-0 pr-md-6">
    <v-progress-linear
      :value="remainingTime"
      reverse
      rounded
      height="12"
      v-if="stepDuration"
      color="light-green"
    ></v-progress-linear>
    <div
      class="editor-node"
      :class="{ edition: edition_mode }"
      ref="editorNode"
    ></div>
  </v-container>
</template>

<script>
import Quill from "quill";
import { mapState } from "vuex";

const toolbarOptions = [
  [{ font: [] }],
  [{ size: ["small", false, "large", "huge"] }], // custom dropdown
  ["bold", "italic", "underline", "strike"], // toggled buttons
  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ list: "ordered" }, { list: "bullet" }],
  [{ align: [] }],
  [{ script: "sub" }, { script: "super" }], // superscript/subscript
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  ["link", "blockquote", "code-block"],
  ["clean"], //clean the format
];

export default {
  name: "TextEditor",
  data() {
    return {
      editorDelta: null,
      editorContent: null,
      editorInstance: null,
      editorOpts: {
        modules: {
          toolbar: toolbarOptions,
        },
        theme: "snow",
        readOnly: false,
      },
      remainingTime: 100,
      answers: {},
    };
  },
  props: {
    step_data: Object,
  },
  created() {
    if (this.stepDuration) {
      this.countDown();
    }
  },
  mounted() {
    this.initializeEditor();
  },
  computed: {
    ...mapState({
      edition_mode: (state) => state.settings.edition_mode,
      published_mode: (state) => state.settings.published_mode,
    }),
    stepDuration() {
      return this.step_data.duration > 0 && !this.edition_mode;
    },
  },
  methods: {
    initializeEditor() {
      // Validate if edition_mode
      if (!this.edition_mode || this.published_mode) {
        this.editorOpts.readOnly = true;
        this.editorOpts.theme = "bubble";
      }

      // Create the Quill instance
      this.editorInstance = new Quill(this.$refs.editorNode, this.editorOpts);

      if (this.step_data.content) {
        // Set initial content that's going to be picked up by Quill
        this.editorInstance.setContents(this.step_data.content);
      }

      // Setup handler for whenever things change inside Quill
      this.editorInstance.on("text-change", this.onEditorContentChange);

      // Save any initial content to this.editorContent
      this.setEditorContent();
    },
    onEditorContentChange() {
      // Whenever we change anything, update this.editorContent
      this.setEditorContent();
    },
    setEditorContent() {
      this.editorContent = this.editorInstance.getText().trim()
        ? this.editorInstance.root.innerHTML
        : "";
    },

    // If the step has duration, executes the countdown
    countDown() {
      this.answers = {
        start_time: Math.floor(Date.now() / 1000),
        step_id: this.step_data._id,
        type: this.step_data.type,
        end_time: null,
        content: {},
      };
      const decrease_factor = 100 / this.step_data.duration;
      this.remainingTime = 100;
      const interval = setInterval(() => {
        this.remainingTime -= decrease_factor;
        if (this.remainingTime <= 0) {
          clearInterval(interval);
          this.$emit("onEnd");
        }
      }, 1000);
    },

    getContent() {
      const content = this.editorInstance.getContents();
      return { content: content.ops };
    },
    // Get step answers in user implementation mode
    getAnswer() {
      this.answers.end_time = Math.floor(Date.now() / 1000);
      return this.answers;
    },
  },
};
</script>

<style lang="scss" scoped>
.editor-node {
  height: 78vh;
  min-height: 78vh;
  overflow-y: auto;
  &.edition {
    height: 70vh;
    min-height: 70vh;
  }
}
.ql-editor {
  font-size: 18px;
  overflow-y: auto;
}
</style>
