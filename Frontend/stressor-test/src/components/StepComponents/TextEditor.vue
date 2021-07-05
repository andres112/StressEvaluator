<template>
  <v-container class="py-0 px-0 pr-md-6">
    <div class="editor-node" :class="{ edition: edition_mode }" ref="editorNode"></div>
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
];

export default {
  name:"TextEditor",
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
    };
  },
  props: {
    step_content: Object,
  },
  mounted() {
    this.initializeEditor();
  },
  computed: {
    ...mapState({ edition_mode: (state) => state.settings.edition_mode }),
  },
  methods: {
    initializeEditor() {
      // Validate if edition_mode
      if (!this.edition_mode) {
        this.editorOpts.readOnly = true;
        this.editorOpts.theme = "bubble";
      }

      // Create the Quill instance
      this.editorInstance = new Quill(this.$refs.editorNode, this.editorOpts);

      if (this.step_content.content) {
        // Set initial content that's going to be picked up by Quill
        this.editorInstance.setContents(this.step_content.content);
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
    getContent() {
      const content = this.editorInstance.getContents();
      return { content: content.ops };
    },
  },
};
</script>

<style lang="scss" scoped>
.editor-node {
  height: 80vh;
  min-height: 80vh;
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
