import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import builder from "./modules/builder";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    builder,
  },
  plugins: [createPersistedState()],
});
