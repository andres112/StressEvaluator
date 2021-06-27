<template>
  <v-container fluid>
    <p class="text-subtitle-2 green--text" v-if="edition_mode">Checkbox</p>
    <question :content="content" @onDeleteQuestion="deleteQuestion"></question>

    <v-row align="center" v-for="opt in content.options" :key="opt.value">
      <v-col cols="10" class="d-flex" :class="{ 'pb-0': !edition_mode }">
        <v-checkbox
          dense
          v-model="answer_selected"
          hide-details
          class="ml-2 mt-0"
          :value="opt.value"
          :disabled="edition_mode"
          :label="edition_mode ? null : opt.text"
        ></v-checkbox>
        <v-text-field
          dense
          v-if="edition_mode"
          color="light-green"
          v-model="opt.text"
          placeholder="Option"
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
    </v-row>
    <br />

    <!-- question settings -->
    <div v-if="edition_mode">
      <a class="text-subtitle-2 ml-1" color="light-green" @click="addOption()">
        + Add option
      </a>
      <br />
      <div class="d-inline-flex">
        <v-checkbox dense v-model="content.required" class="ml-1" label="Required"></v-checkbox>
      </div>
    </div>
  </v-container>
</template>
<script>
import { mapState } from "vuex";
import { createNanoId } from "@/assets/helpers.js";
import Question from "./Question.vue";

export default {
  name: "Checkbox",
  components: { Question },
  props: {
    content: Object,
  },
  data() {
    return {
      answer_selected: [],
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
      const new_option = { value: createNanoId(), text: "" };
      this.content.options.push(new_option);
    },
    deleteOption(option_id) {
      this.content.options = this.content.options.filter((x) => x.value != option_id);
    },
  },
};
</script>

<style></style>
