import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import evaluator from "./modules/evaluator";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    evaluator,
  },
  plugins: [createPersistedState()],
});
