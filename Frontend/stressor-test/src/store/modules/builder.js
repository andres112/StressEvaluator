import { removeEmpty } from "@/assets/helpers.js";

const ALLOWED_STEPS = new Set(["consent", "question", "stress"]);

const state = {
  selected_test: null,
  current_step: null,
  test_list: [],
  steps: [],
};
const mutations = {
  setSelectedTest(state, payload) {
    state.selected_test = { ...state.selected_test, ...payload };
  },
  setSteps(state, payload) {
    const allowed_steps = payload.filter((x) => ALLOWED_STEPS.has(x.type));
    state.steps = [...allowed_steps];
  },
  setCurrentStep(state, payload) {
    state.current_step = payload;
  },
  setTestList(state, payload) {
    state.test_list = [];
    state.test_list = [...payload];
  },
  cleanStates(state) {
    state.selected_test = null;
    state.steps = [];
    state.current_step = null;
  },
};
const actions = {
  //************************************************* */
  // CRUD Evaluation section
  async createEvaluation({ dispatch }, payload) {
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
      const req_test = await fetch(process.env.VUE_APP_BUILDER_URL + "test/" + res.test_id);
      const res_test = await req_test.json();
      dispatch("setSelectedTest", res_test);
    } catch (error) {
      console.log(error);
    }
  },

  async updateEvaluation({ commit }, payload) {
    try {
      const req = await fetch(process.env.VUE_APP_BUILDER_URL + "test/" + payload.test_id, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      commit("setSelectedTest", payload);
      return req;
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
  //************************************************* */

  //************************************************* */
  // CRUD Steps section
  async createStep({ dispatch }, payload) {
    try {
      const url = process.env.VUE_APP_BUILDER_URL + "test/" + payload.test_id + "/step";
      const req = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const res = await req.json();
      // fetch just create new test
      const req_test = await fetch(process.env.VUE_APP_BUILDER_URL + "test/" + res.test_id);
      const res_test = await req_test.json();
      dispatch("setSelectedTest", res_test);
    } catch (error) {
      console.log(error);
    }
  },
  async updateStep({ commit }, payload) {
    try {
      const url =
        process.env.VUE_APP_BUILDER_URL + "test/" + payload.test_id + "/step/" + payload._id;
      const req = await fetch(url, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      return req;
    } catch (error) {
      console.log(error);
    }
  },
  async deleteStep({ dispatch }, payload) {
    try {
      const url =
        process.env.VUE_APP_BUILDER_URL + "test/" + payload.test_id + "/step/" + payload._id;
      const req = await fetch(url, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const res = await req.json();
      // fetch just create new test
      const req_test = await fetch(process.env.VUE_APP_BUILDER_URL + "test/" + res.test_id);
      const res_test = await req_test.json();
      dispatch("setSelectedTest", res_test);
    } catch (error) {
      console.log(error);
    }
  },
  //************************************************* */

  async setSelectedTest({ commit }, payload) {
    try {
      commit("setSelectedTest", payload);
      // fetch steps of selected test
      const req_steps = await fetch(
        process.env.VUE_APP_BUILDER_URL + "test/" + payload._id + "/step"
      );
      const res_steps = await req_steps.json();
      commit("setSteps", res_steps);
      // when load a test set the first step by default
      commit("setCurrentStep", res_steps[0]);
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
