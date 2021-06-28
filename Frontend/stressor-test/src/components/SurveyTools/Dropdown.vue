<template>
  <v-container fluid>
    <p class="text-subtitle-2 green--text" v-if="edition_mode">Dropdown</p>
    <question :content="content" @onDeleteQuestion="deleteQuestion"></question>
    <v-row align="center" class="mt-0" v-if="content.options.length > 0">
      <!-- for edition mode -->
      <v-col cols="11" v-if="edition_mode">
        <ol
          v-for="(opt, item) in content.options"
          :key="opt.value"
          class="d-flex py-0 px-0 align-center"
        >
          <v-col cols="11" class="d-flex align-center">
            <span class="text-h6 grey--text" disabled>{{ item + 1 }}</span>
            <v-text-field
              dense
              color="light-green"
              v-model="opt.text"
              placeholder="Option"
              class="ml-4"
              counter
              maxlength="150"
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
        </ol>
      </v-col>
      <!-- For test implementation mode -->
      <v-col cols="10" v-else class="mt-4">
        <v-select
          class="ml-2"
          v-model="answer_selected"
          :items="dropdown_items"
          label="Select your answer"
          :multiple="content.multiple"
        ></v-select>
      </v-col>
    </v-row>

    <!-- question settings -->
    <div v-if="edition_mode">
      <a class="text-subtitle-2 ml-1" color="light-green" @click="addOption()">
        + Add option
      </a>
      <br />
      <div class="d-inline-flex">
        <v-checkbox dense v-model="content.required" class="ml-1" label="Required"></v-checkbox>
        <v-checkbox dense v-model="content.multiple" class="ml-3" label="Multiple"></v-checkbox>
      </div>
    </div>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import { createNanoId } from "@/assets/helpers.js";
import Question from "./Question.vue";
import Checkbox from "./Checkbox.vue";

export default {
  name: "Dropdown",
  components: { Question, Checkbox },
  props: {
    content: Object,
  },
  data() {
    return {
      answer_selected: null,
      dropdown_items: [],
    };
  },
  created() {
    if (this.edition_mode) {
      if (this.content.options.length == 0) {
        this.addOption();
      }
    } else {
      this.dropdown_items = this.content.options.map((x) => x.text);
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
      // Nano id used for creating option id
      const new_option = { value: createNanoId(), text: "" };
      this.content.options.push(new_option);
    },
    deleteOption(option_id) {
      this.content.options = this.content.options.filter((x) => x.value != option_id);
    },
  },
};
</script>

<style scoped></style>
