import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import settings from "./modules/settings";
import builder from "./modules/builder";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    settings,
    builder,
  },
  plugins: [createPersistedState()],
});
