<template>
  <v-container fluid>
    <p class="text-subtitle-2 green--text" v-if="edition_mode">Radiogroup</p>
    <v-row align="center">
      <v-col cols="11" class="pb-0">
        <v-text-field
          v-if="edition_mode"
          dense
          color="light-green"
          v-model="content.question"
          placeholder="Question"
        ></v-text-field>
        <v-subheader v-else class="text-subtitle-1 text-sm-h6">{{ content.question }}</v-subheader>
      </v-col>
      <v-col cols="1">
        <v-btn icon color="deep-orange accent-4" v-if="edition_mode" @click="deleteQuestion()">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <v-row align="center" class="mt-0" v-if="content.options.length > 0">
      <v-col cols="11">
        <v-radio-group v-model="option_selected" dense>
          <v-radio
            class="shrink ml-2"
            :value="opt.value"
            v-for="opt in content.options"
            :key="opt.value"
          >
            <template v-slot:label>
              <v-col cols="11" class="pb-0">
                <v-text-field
                  dense
                  v-if="edition_mode"
                  color="light-green"
                  class="mr-2"
                  v-model="opt.text"
                  placeholder="option"
                ></v-text-field>
                <span v-else class="my-1 text-subtitle-2">{{ opt.text }}</span>
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
            </template>
          </v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
    <a class="text-subtitle-2" color="light-green" @click="addOption()" v-if="edition_mode">
      + Add option
    </a>
  </v-container>
</template>
<script>
import { mapState } from "vuex";
import { createNanoId } from "@/assets/helpers.js";

export default {
  props: {
    content: Object,
  },
  data() {
    return {
      option_selected: null,
    };
  },
  created() {
    if (this.content.options.length == 0) {
      this.addOption();
    }
  },
  computed: {
    ...mapState({ edition_mode: (state) => state.builder.edition_mode }),
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
