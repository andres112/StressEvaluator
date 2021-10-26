<template>
  <v-overlay :value="true" opacity="0.95">
    <v-card width="25vw" light>
      <v-card-title class="d-flex justify-center mb-2">
        Music Selection
      </v-card-title>
      <v-card-subtitle class="d-flex justify-center mb-2">
        Please choose your most prefered audio from the options below.
      </v-card-subtitle>
      <v-row align-content="center" justify="center">
        <v-radio-group v-model="selected" row>
          <v-col
            v-for="audio in audio_list"
            :key="audio.value"
            xs4
            align-self-center
          >
            <v-radio
              class="text-capitalize mb-5"
              :label="audio.name"
              :value="audio"
              @click.prevent="playMusic(audio.value)"
            >
            </v-radio>
          </v-col>
        </v-radio-group>
      </v-row>
      <v-card-actions class="d-flex justify-center">
        <v-btn
          color="light-green white--text"
          class="mb-2"
          @click.prevent="next()"
          :disabled="!selected"
        >
          Continue
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-overlay>
</template>

<script>
import { mapActions, mapMutations } from "vuex";

const AUDIO_LIST = [
  { name: "audio 1", value: "129.mp3" },
  { name: "audio 2", value: "362.mp3" },
  { name: "audio 3", value: "999.mp3" },
];
export default {
  name: "MusicSelection",
  data() {
    return {
      audio_list: AUDIO_LIST,
      selected: null,
    };
  },
  props: {
    session_id: String,
    test_id: String,
  },
  methods: {
    ...mapActions({
      controlMusic: "stimulus/controlMusic",
    }),
    ...mapMutations({ setMusic: "stimulus/setMusic" }),
    playMusic(song) {
      // Play 15 seconds of the song selected
      this.controlMusic({ action: "play", song_id: song, time: 15 });
    },
    next() {
      this.controlMusic({ action: "stop" });
      this.setMusic(this.selected);
      this.$emit("onSelected");
    },
  },
};
</script>

<style></style>
