import { removeEmpty } from "@/assets/helpers.js";

const ALLOWED_STEPS = new Set(["consent", "question", "stress"]);

const state = {
  selected_test: null,
  test_list: [],
  steps: [],
  edition_mode: false,
};
const mutations = {
  setSelectedTest(state, payload) {
    state.selected_test = payload;
  },
  setSteps(state, payload) {
    state.test_list = [];
    const allowed_steps = payload.filter((x) => ALLOWED_STEPS.has(x.type));
    state.steps = [...allowed_steps];
  },
  setTestList(state, payload) {
    state.test_list = [];
    state.test_list = [...payload];
  },
  cleanStates(state) {
    state.selected_test = null;
    state.steps = [];
  },
  setEditionMode(state, value) {
    state.edition_mode = value;
  },
};
const actions = {
  //************************************************* */
  // CRUD Evaluation section
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

  async updateEvaluation({ commit }, payload) {
    try {
      const req = await fetch(
        process.env.VUE_APP_BUILDER_URL + "test/" + payload.test_id,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
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
  async updateStep({ commit }, payload) {
    try {
      const url =
        process.env.VUE_APP_BUILDER_URL +
        "test/" +
        payload.test_id +
        "/step/" +
        payload.step_id;
      await fetch(url, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
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
        process.env.VUE_APP_BUILDER_URL + "test/" + payload._id + "/steps"
      );
      const res_steps = await req_steps.json();
      commit("setSteps", res_steps);
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