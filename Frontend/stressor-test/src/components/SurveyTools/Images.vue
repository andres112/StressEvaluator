<template>
  <v-container fluid>
    <p class="text-subtitle-2 green--text" v-if="edition_mode">Images</p>
    <question :content="content" @onDeleteQuestion="deleteQuestion"></question>

    <!-- Image visualization section - For edition and presenter modes -->
    <v-row
      align="center"
      justify="center"
      class="my-4"
      v-if="content.options.length > 0"
    >
      <v-col
        v-for="(opt, item) in content.options"
        :key="item"
        class="d-flex child-flex"
        cols="4"
        sm="3"
        md="2"
      >
        <v-card
          :elevation="answer_selected == opt.text ? 10 : 0"
          :color="setColor(opt)"
        >
          <v-icon
            large
            v-if="answer_selected == opt.text"
            class="selected-icon"
            dark
          >
            mdi-checkbox-marked-circle-outline</v-icon
          >
          <v-img
            :src="opt.img"
            aspect-ratio="1"
            contain
            class="selectable"
            :class="{ 'img-selected': answer_selected == opt.text }"
            :alt="opt.img ? opt.img : 'Image'"
            @click="setAnswer(opt.text)"
          >
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular
                  indeterminate
                  color="grey lighten-5"
                ></v-progress-circular>
              </v-row>
            </template>
          </v-img>
        </v-card>
      </v-col>
    </v-row>

    <!-- Image url section - For edition mode -->
    <v-row
      align="center"
      class="mt-0"
      v-if="content.options.length > 0 && edition_mode"
    >
      <v-col cols="11">
        <v-row
          v-for="(opt, item) in content.options"
          :key="item"
          class="py-0 px-0 align-center"
        >
          <v-col cols="11" md="6">
            <v-text-field
              dense
              :rules="[rules.required]"
              color="light-green"
              v-model="opt.img"
              placeholder="Image url"
              prepend-icon="mdi-image"
              label="Url"
              class="ml-4"
              hint="Paste the image url"
            ></v-text-field>
          </v-col>
          <v-col cols="11" md="5">
            <v-text-field
              dense
              :rules="[rules.required]"
              color="light-green"
              v-model="opt.text"
              placeholder="Image label"
              prepend-icon="mdi-tag"
              label="Tag"
              class="ml-4"
            ></v-text-field>
          </v-col>

          <v-col cols="1">
            <v-btn
              icon
              color="deep-orange accent-4"
              v-if="edition_mode && content.options.length > 1"
              @click="deleteOption(opt.value)"
            >
              <v-icon small>mdi-close-thick</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!-- question settings -->
    <div v-if="edition_mode">
      <a class="text-subtitle-2 ml-1" color="light-green" @click="addOption()">
        + Add image
      </a>
      <br />
      <div class="d-inline-flex">
        <v-checkbox
          dense
          v-model="content.required"
          class="ml-1"
          label="Required"
        ></v-checkbox>
      </div>
    </div>
  </v-container>
</template>
<script>
import { mapState } from "vuex";
import { createNanoId } from "@/assets/helpers.js";
import Question from "./Question.vue";

const MAX_OPTIONS = 12;

export default {
  name: "Images",
  components: { Question },
  props: {
    content: Object,
  },
  data() {
    return {
      answer_selected: null,
      rules: {
        required: (value) => !!value || "Required.",
      },
    };
  },
  created() {
    if (this.content.options.length == 0) {
      this.addOption();
    }
  },
  computed: {
    ...mapState({ edition_mode: (state) => state.settings.edition_mode }),
  },
  methods: {
    deleteQuestion() {
      this.$emit("onDeleteQuestion", this.content.id);
    },
    addOption() {
      if (this.content.options.length < MAX_OPTIONS) {
        // Nano id used for creating option id
        const new_option = { value: createNanoId(), text: "", img: "" };
        this.content.options.push(new_option);
      }
    },
    deleteOption(option_id) {
      this.content.options = this.content.options.filter(
        (x) => x.value != option_id
      );
    },
    setAnswer(selected) {
      if (!this.edition_mode) this.answer_selected = selected;
    },
    setColor(image) {
      let color = "transparent";
      if (!image.img) color = "grey lighten-2";
      if (!this.edition_mode && image.text == this.answer_selected)
        color = "light-blue";
      return color;
    },
  },
};
</script>

<style scoped>
.selected-icon {
  position: absolute;
  z-index: 1;
  background: #03a9f4;
  border-radius: 50%;
}
.img-selected {
  border-radius: 50% 0% 0%;
}
</style>
