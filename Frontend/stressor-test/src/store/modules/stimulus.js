const state = {
  bridgeIp: null,
  dockIp: null,
  stimulus_settings: null,
  connected: null,
  music: null,
  color: null,
};
const mutations = {
  setBridgeIp(state, ip) {
    state.bridgeIp = ip;
  },
  setDockIp(state, ip) {
    state.dockIp = ip;
  },
  setConnect(state, connected) {
    state.connected = connected;
  },
  setSettings(state, payload) {
    state.stimulus_settings = payload;
  },
  setMusic(state, name) {
    state.music = name;
  },
  setColor(state, color) {
    state.color = color;
  },
};
const actions = {
  async discoverBridge({ commit }) {
    try {
      const req = await fetch(
        process.env.VUE_APP_MUSIC_LIGHTS_URL + "discover_bridge"
      );
      if (req.status === 200) {
        const res = await req.json();
        const bridges = Object.values(res.phillips).map(
          (x) => x.match(/\/\/(.*?):/i)[1]
        );
        const docks = res.nanoleaf.map((x) => x["ip"]);
        commit("setBridgeIp", bridges[0]);
        commit("setDockIp", docks[0]);
      }
    } catch (error) {
      console.error(error);
    }
  },
  async connectLights({ state, commit }) {
    try {
      const req = await fetch(
        process.env.VUE_APP_MUSIC_LIGHTS_URL + "connect_lights",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dock_ip: state.dockIp,
            bridge_ip: state.bridgeIp,
            // dock_ip: "192.168.1.105",
            // bridge_ip: "192.168.1.100",
          }),
        }
      );
      if (req.status === 200) {
        const res = await req.json();
        commit("setConnect", true);
      } else {
        commit("setConnect", false);
      }
    } catch (error) {}
  },
  async controlLights({ state }, commands) {
    try {
      const valid_command = {
        on: null,
        lights: null,
        rgb: null,
        ambient: null,
      };
      Object.keys(valid_command).forEach((x) => {
        valid_command[x] = commands[x];
      });

      //Phillips controller
      const req = await fetch(
        process.env.VUE_APP_MUSIC_LIGHTS_URL + "control_lights",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...valid_command,
          }),
        }
      );
      if (req.status === 200) {
        const res = await req.json();
      }

      //Nanoleaf controller
      const nanoreq = await fetch(
        process.env.VUE_APP_MUSIC_LIGHTS_URL + "control_nanoleaf",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...valid_command,
          }),
        }
      );
      if (nanoreq.status === 200) {
        const nanores = await nanoreq.json();
      }
    } catch (error) {
      console.error(error);
    }
  },
  async controlMusic({ commit }, commands) {
    try {
      const url = new URL(
        `${process.env.VUE_APP_MUSIC_LIGHTS_URL}control_music/${commands?.action}`
      );
      const req = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // TODO: pending to send the song_id
        body: JSON.stringify(commands),
      });
      if (req.status === 200) {
        const res = await req.json();
      }
    } catch (error) {
      console.error(error);
    }
  },
};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
