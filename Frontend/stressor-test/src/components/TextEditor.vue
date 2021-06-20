<template>
  <v-container class="pt-0">
    <div class="editor-node" ref="editorNode"></div>
    <v-row class="mt-2 d-flex justify-center">
      <v-btn color="success" @click.prevent="saveContent" large>
        <v-icon left>
          mdi-content-save
        </v-icon>
        Save
      </v-btn>
    </v-row>
  </v-container>
</template>

<script>
import Quill from "quill";

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
      },
    };
  },
  props: {
    value: Array,
  },
  mounted() {
    this.initializeEditor();
  },
  methods: {
    initializeEditor() {
      // Create the Quill instance
      this.editorInstance = new Quill(this.$refs.editorNode, this.editorOpts);

      if (this.value) {
        // Set initial content that's going to be picked up by Quill
        this.editorInstance.setContents(this.value);
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
    saveContent() {
      const content = this.editorInstance.getContents();
      this.$emit("onSubmit", { step: { content: content.ops } });
    },
  },
};
</script>

<style>
.editor-node {
  height: 75vh;
  min-height: 75vh;
  overflow-y: auto;
}
.ql-editor {
  font-size: 18px;
  overflow-y: auto;
}
</style>
