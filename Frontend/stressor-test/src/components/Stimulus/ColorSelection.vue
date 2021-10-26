<template>
  <v-overlay :value="true" opacity="0.95">
    <v-card width="25vw" light>
      <v-card-title class="d-flex justify-center mb-2">
        Color Selection
      </v-card-title>
      <v-card-subtitle class="d-flex justify-center mb-2">
        Please choose your prefered color from the options below.
      </v-card-subtitle>
      <v-row align-content="center" justify="center" class="pb-5">
        <v-col
          v-for="color in color_list"
          :key="color.name"
          cols="4"
          align-self="center"
        >
          <v-card
            :color="`rgba(${color.value})`"
            height="100px"
            link
            @click="next(color)"
          >
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </v-overlay>
</template>

<script>
import { mapMutations } from "vuex";

const COLOR_LIST = [
  { name: "blue", value: [0, 225, 255] },
  { name: "green", value: [0, 255, 125] },
];
export default {
  name: "ColorSelection",
  data() {
    return {
      color_list: COLOR_LIST,
    };
  },
  props: {
    session_id: String,
    test_id: String,
  },
  methods: {
    ...mapMutations({ setColor: "stimulus/setColor" }),
    next(color_selected) {
      this.setColor(color_selected);
      this.$emit("onSelected");
    },
  },
};
</script>

<style></style>
