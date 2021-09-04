<template>
  <v-overlay :value="true">
    <v-card class="text-center" light>
      <v-card-title class="d-flex justify-center"
        >Ambient Conditions</v-card-title
      >
      <v-card-text>
        <v-form ref="create_form">
          <v-text-field
            dense
            v-model="ambient.light"
            :rules="[rules.required, rules.minValue]"
            prepend-inner-icon="mdi-lightbulb-on-outline"
            suffix="lux"
            label="Ambient Light"
            outlined
            color="light-blue"
            class="mb-2"
            required
          ></v-text-field>
          <v-text-field
            dense
            v-model="ambient.temperature"
            :rules="[rules.required]"
            prepend-inner-icon="mdi-thermometer"
            append-icon="mdi-temperature-celsius"
            label="Ambient Temperature"
            outlined
            color="light-blue"
            required
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions class="d-flex justify-center">
        <v-btn @click.prevent="next()" color="light-green" class="mb-2" dark
          >Continue</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-overlay>
</template>

<script>
// NOTE: stimulus section
import { mapState, mapActions, mapMutations } from "vuex";

export default {
  name: "AmbientConditions",
  props: {
    step_id: String,
    session_id: String,
    test_id: String,
  },
  data() {
    return {
      ambient: { light: null, temperature: null },
      rules: {
        required: (value) => !!value || "Required.",
        minValue: (value) => value > 0 || "Min value greater than 0",
      },
    };
  },
  computed: {
    ...mapState({
      stimulus_settings: (state) => state.stimulus.stimulus_settings,
    }),
  },
  methods: {
    ...mapActions({ updateSession: "presenter/updateSession" }),
    ...mapMutations({ setSettings: "stimulus/setSettings" }),
    async next() {
      // Modify the local state
      const new_settings = this.stimulus_settings.map((x) => {
        if (x.step_id == this.step_id) {
          x.ambient = this.ambient;
        }
        return x;
      });
      this.setSettings(new_settings);

      // Modify the remote register in DB
      const session_update = {
        test_id: this.test_id,
        session_id: this.session_id,
        settings: new_settings,
      };
      await this.updateSession(session_update);
      this.$emit("onEndAmbient");
    },
  },
};
</script>

<style></style>
