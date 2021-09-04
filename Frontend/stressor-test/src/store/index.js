import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import settings from "./modules/settings";
import builder from "./modules/builder";
import presenter from "./modules/presenter";
// NOTE: stimulus section
import stimulus from "./modules/stimulus";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    settings,
    builder,
    presenter,
    // NOTE: stimulus section
    stimulus,
  },
  plugins: [createPersistedState()],
});
