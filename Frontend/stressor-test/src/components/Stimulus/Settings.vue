<template>
  <!-- NOTE: stimulus section -->
  <v-card height="75vh">
    <v-card-title class="d-flex justify-center text-h5 font-weight-bold"
      >Stimulus Settings</v-card-title
    >
    <v-card-text>
      <v-simple-table fixed-header height="350px">
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">
                Step id
              </th>
              <th class="text-left">
                Light Settings
              </th>
              <th class="text-left">
                Music Settings
              </th>
              <th class="text-left">
                Ambient Info
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in settings" :key="item.step_id">
              <td>{{ item.step_name }}</td>
              <td>
                <v-row>
                  <v-col cols="2">
                    <!-- disable stimulus for informed consent -->
                    <v-checkbox
                      v-model="item.light"
                      label="Lights"
                      color="green"
                      hide-details
                      class="mr-2"
                      :disabled="index == 0"
                    ></v-checkbox>
                  </v-col>
                  <v-col cols="3">
                    <v-text-field
                      type="number"
                      v-model.number="item.color[0]"
                      label="Red"
                      class="mr-2"
                      :disabled="!item.light"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="3">
                    <v-text-field
                      type="number"
                      v-model.number="item.color[1]"
                      label="Green"
                      class="mr-2"
                      :disabled="!item.light"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="3">
                    <v-text-field
                      type="number"
                      v-model.number="item.color[2]"
                      label="Blue"
                      class="mr-2"
                      :disabled="!item.light"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </td>
              <td>
                <!-- disable stimulus for informed consent -->
                <v-checkbox
                  v-model="item.music"
                  label="Music"
                  color="blue"
                  hide-details
                  :disabled="index == 0"
                ></v-checkbox>
              </td>
              <td>
                <!-- disable stimulus for informed consent -->
                <v-checkbox
                  v-model="item.ambient"
                  label="Ambient"
                  color="orange"
                  hide-details
                  :disabled="index == 0"
                ></v-checkbox>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card-text>
    <v-divider class="mx-2 mb-6"></v-divider>
    <v-row>
      <v-col class="d-flex">
        <p class="mx-4" cols="8">Lights:</p>
        <v-form class="text-center">
          <v-text-field
            dense
            v-model="bridgeIp"
            label="Philips Hue"
            color="green"
          ></v-text-field>
          <v-text-field
            dense
            v-model="dockIp"
            label="Nanoleaf"
            color="light-green"
          ></v-text-field>
          <v-btn
            class="mr-2"
            @click.prevent="discover()"
            dark
            :loading="discovering"
            :color="bridgeIp ? (dockIp ? 'green' : 'amber darken-1') : 'red'"
            >Discover
          </v-btn>
        </v-form>
        <div class="d-flex flex-column ma-4 align-center">
          <v-btn
            class="mb-4"
            @click.prevent="connect()"
            :color="connected ? 'green' : 'red'"
            :loading="connecting"
            dark
            >Connect</v-btn
          >
          <v-switch v-model="on" :label="on ? 'On' : 'Off'"></v-switch>
          <v-btn @click.prevent="control()">Control</v-btn>
        </div>
        <v-color-picker v-model="color"></v-color-picker>
      </v-col>
      <v-col class="d-flex" cols="4">
        <p class="mx-4">Music:</p>
        <v-btn class="mr-2" @click.prevent="playMusic()">Play/Stop</v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "StimulusSettings",
  props: {
    steps: Array,
    evalId: String,
  },
  data() {
    return {
      settings: null,
      discovering: false,
      connecting: false,
      on: false,
      color: null,
      play: false,
    };
  },
  mounted() {
    this.settings = this.steps.map(function(step) {
      return {
        step_id: step,
        step_name: step,
        light: false,
        color: [255, 255, 255],
        music: false,
        ambient: false,
      };
    });
    this.setStepName;
  },
  computed: {
    ...mapState({
      bridgeIp: (state) => state.stimulus.bridgeIp,
      dockIp: (state) => state.stimulus.dockIp,
      connected: (state) => state.stimulus.connected,
    }),
    setStepName() {
      const aux = this;
      this.settings.forEach(async (item, index) => {
        const payload = {
          test_id: aux.evalId,
          step_id: item.step_id,
          no_action: true,
        };
        const res = await aux.getStep(payload);
        aux.settings[index].step_name = await res.name;
      });
    },
  },
  methods: {
    ...mapActions({
      discoverBridge: "stimulus/discoverBridge",
      controlLights: "stimulus/controlLights",
      connectLights: "stimulus/connectLights",
      controlMusic: "stimulus/controlMusic",
      getStep: "presenter/getStep",
    }),
    async discover() {
      this.discovering = true;
      await this.discoverBridge();
      this.discovering = false;
    },
    async connect() {
      this.connecting = true;
      await this.connectLights();
      this.connecting = false;
    },
    control() {
      this.controlLights({
        rgb: [this.color.rgba.r, this.color.rgba.g, this.color.rgba.b],
        ambient: { light: 180 },  //Just for testing
       });
    },
    playMusic() {
      this.play = !this.play;
      const action = this.play ? "play" : "stop";
      this.controlMusic({ action: action });
    },
  },
  watch: {
    on(oldV, newV) {
      if (newV != oldV) {
        this.controlLights({ on: this.on });
      }
    },
  },
};
</script>

<style></style>
