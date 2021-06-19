import { removeEmpty } from "@/assets/helpers.js";

const state = { selected_test: null, test_list: [], steps: [] };
const mutations = {
  setSelectedTest(state, payload) {
    state.selected_test = payload;
  },
  setSteps(state, payload) {
    state.test_list = [];
    state.steps = [...payload];
  },
  setTestList(state, payload) {
    state.test_list = [];
    state.test_list = [...payload];
  },
  cleanStates() {
    state.selected_test = null;
    state.steps = [];
  },
};
const actions = {
  async createEvaluation({ commit }, payload) {
    try {
      // create new test
      const req = await fetch(process.env.VUE_APP_BUILDER_URL + "test", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const res = await req.json();
      // fetch just create new test
      const req_test = await fetch(
        process.env.VUE_APP_BUILDER_URL + "test/" + res.test_id
      );
      const res_test = await req_test.json();
      commit("setSelectedTest", res_test);
      // fetch steps of new test
      const req_steps = await fetch(
        process.env.VUE_APP_BUILDER_URL + "test/" + res.test_id + "/steps"
      );
      const res_steps = await req_steps.json();
      commit("setSteps", res_steps);
    } catch (error) {
      console.log(error);
    }
  },
  async setSelectedTest({ commit }, payload) {
    try {
      commit("setSelectedTest", payload);
      // fetch steps of selected test
      const req_steps = await fetch(
        process.env.VUE_APP_BUILDER_URL + "test/" + payload._id + "/steps"
      );
      const res_steps = await req_steps.json();
      commit("setSteps", res_steps);
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
