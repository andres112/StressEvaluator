import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import settings from "./modules/settings";
import builder from "./modules/builder";
import presenter from "./modules/presenter";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    settings,
    builder,
    presenter,
  },
  plugins: [createPersistedState()],
});
