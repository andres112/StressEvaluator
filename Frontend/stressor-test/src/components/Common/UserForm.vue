<template>
  <div>
    <v-form v-model="valid" ref="user_form">
      <!-- User Information -->
      <v-row justify="center">
        <v-col cols="10" class="px-0">
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title class="text-md-h5 text-h6 font-weight-bold">
                User Information
              </v-list-item-title>
              <v-list-item-subtitle>
                Please fill the following information
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-col>
        <v-col cols="10" md="4">
          <v-text-field
            dense
            v-model="user.email"
            :rules="[rules.required, rules.email]"
            label="Email"
            outlined
            clearable
            color="light-blue"
            required
            @input="validate()"
          ></v-text-field>
        </v-col>
        <v-col cols="10" sm="4" md="3">
          <v-text-field
            v-model="user.age"
            :rules="[rules.age, rules.required]"
            dense
            label="Age"
            outlined
            color="light-blue"
            @input="validate()"
          ></v-text-field>
        </v-col>
        <v-col cols="10" sm="2" md="3">
          <v-select
            v-model="user.gender"
            :rules="[rules.required]"
            :items="gender_list"
            item-text="text"
            item-value="value"
            dense
            label="Gender"
            outlined
            color="light-blue"
            validate-on-blur
          ></v-select>
        </v-col>
        <!-- Experiment Information -->
        <v-col cols="10" sm="2">
          <v-select
            v-model="user.hand"
            :rules="[rules.required]"
            :items="hand_list"
            item-text="text"
            item-value="value"
            dense
            label="Dominant Hand"
            outlined
            color="light-blue"
            validate-on-blur
          ></v-select>
        </v-col>
      </v-row>
      <!-- Experiment Information -->
      <!-- NOTE: Hidden because the options preferences for user are not considered anymore -->
        <!--<v-row justify="center">
         <v-col cols="10" sm="3">
          <v-btn
            block
            :color="music ? null : 'red'"
            @click.prevent="isMusic = !isMusic"
            outlined
            large
          >
            <v-icon left large>
              mdi-music
            </v-icon>
            <span class="ml-2">{{ audioExperiment }}</span>
          </v-btn>
        </v-col>
        <v-col cols="10" sm="3">
          <v-btn
            block
            :color="color ? `rgba(${color.value})` : 'red'"
            @click.prevent="isColor = !isColor"
            large
            :outlined="!color"
          >
            <v-icon left large>
              mdi-lightbulb-on-outline
            </v-icon>
            <span class="ml-2">{{ colorExperiment }}</span>
          </v-btn>
        </v-col> 
      </v-row>-->
    </v-form>
    <!-- NOTE: Hidden because the options preferences for user are not considered anymore -->
    <!-- <music-selection
      v-if="isMusic"
      @onSelected="isMusic = false"
    ></music-selection>
    <color-selection
      v-if="isColor"
      @onSelected="isColor = false"
    ></color-selection> -->
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
// NOTE: Hidden because the options preferences for user are not considered anymore
// import MusicSelection from "@/components/Stimulus/MusicSelection.vue";
// import ColorSelection from "@/components/Stimulus/ColorSelection.vue";

export default {
  name: "UserForm",
  data() {
    return {
      valid: false,
      user: { email: null, age: null, gender: null, hand: null },
      gender_list: [
        { text: "Female", value: "female" },
        { text: "Male", value: "male" },
        { text: "Intersex", value: "inter" },
        { text: "Prefer not to say", value: "noapply" },
      ],
      hand_list: [
        { text: "Right", value: "right" },
        { text: "Left", value: "left" },
        { text: "Both", value: "both" },
      ],
      rules: {
        required: (value) => !!value || "Required.",
        age: (value) => (!isNaN(value) && value > 0) || "Invalid age",
        email: (value) => {
          return /.+@.+\..+/.test(value) || "E-mail must be valid";
        },
      },

      // NOTE: Hidden because the options preferences for user are not considered anymore
      // isMusic: false,
      // isColor: false,
    };
  },
  mounted() {
    // NOTE: stimulus section
    this.setColor({ name: "blue", value: [0, 225, 255] });
    this.setMusic({ name: "245", value: "245.mp3" });
  },
  computed: {
    ...mapState({
      // NOTE: stimulus section
      music: (state) => state.stimulus.music,
      color: (state) => state.stimulus.color,
    }),
    // NOTE: Hidden because the options preferences for user are not considered anymore
    // audioExperiment() {
    //   return this.music ? this.music.name : "Audio";
    // },
    // colorExperiment() {
    //   return this.color ? this.color.name : "Color Light";
    // },
  },
  methods: {
    // NOTE: stimulus section
    ...mapMutations({
      setColor: "stimulus/setColor",
      setMusic: "stimulus/setMusic",
    }),
    validate() {
      this.$refs.user_form.validate();
    },
  },
  watch: {
    // NOTE: stimulus section
    music() {
      this.user["music"] = this.music;
    },
    color() {
      this.user["color"] = this.color;
    },
  },
};
</script>

<style></style>
