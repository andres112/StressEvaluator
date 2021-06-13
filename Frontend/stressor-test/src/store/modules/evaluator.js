import { removeEmpty } from "@/assets/helpers.js";

const state = { test_id: null, selected_test: null, test_list: [] };
const mutations = {
  setTestId(state, value) {
    state.test_id = value;
  },
  setSelectedTest(state, payload) {
    state.selected_test = payload;
    state.test_id = state.selected_test._id;
  },
  setTestList(state, payload) {
    state.test_list = [];
    state.test_list = [...payload];
  },
};
const actions = {
  async createEvaluation({ commit }, payload) {
    try {
      const req = await fetch(process.env.VUE_APP_BUILDER_URL + "test", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const res = await req.json();
      commit("setTestId", res.test_id);
    } catch (error) {
      console.log(error);
    }
  },
  async searchOneEvaluation({ commit }, id) {
    try {
      const req = await fetch(process.env.VUE_APP_BUILDER_URL + "test/" + id);
      const res = await req.json();
      if (req.status != 200) {
        commit("setTestList", []);
      } else {
        commit("setTestList", [res]);
      }
    } catch (error) {
      console.log(error);
    }
  },
  async searchMultipleEvaluations({ commit }, payload) {
    try {
      payload = removeEmpty(payload);
      const url = new URL(process.env.VUE_APP_BUILDER_URL + "find_test");
      url.search = new URLSearchParams(payload).toString();
      const req = await fetch(url);
      const res = await req.json();
      commit("setTestList", res);
    } catch (error) {
      console.log(error);
    }
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
