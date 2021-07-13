import { removeEmpty } from "@/assets/helpers.js";

const ALLOWED_STEPS = new Set(["consent", "question", "stress", "info"]);

const state = {
  selected_test: null,
  current_step: null,
  test_list: [],
  steps: [],
};
const mutations = {
  setSelectedEvaluation(state, payload) {
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
    state.test_list = [];
  },
};
const actions = {
  //************************************************* */
  // CRUD Evaluation section
  async createEvaluation({ dispatch }, payload) {
    try {
      // create new test
      const req = await fetch(process.env.VUE_APP_BASE_URL + "test", {
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
        process.env.VUE_APP_BASE_URL + "test/" + res.test_id
      );
      const res_test = await req_test.json();
      dispatch("setSelectedEvaluation", res_test);
    } catch (error) {
      console.log(error);
    }
  },

  async updateEvaluation({ commit }, payload) {
    try {
      const req = await fetch(
        process.env.VUE_APP_BASE_URL + "test/" + payload.test_id,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      commit("setSelectedEvaluation", payload);
      return req;
    } catch (error) {
      console.log(error);
    }
  },

  async searchOneEvaluation({ commit }, id) {
    try {
      const req = await fetch(process.env.VUE_APP_BASE_URL + "test/" + id);
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
      const url = new URL(process.env.VUE_APP_BASE_URL + "find_test");
      url.search = new URLSearchParams(payload).toString();
      const req = await fetch(url);
      const res = await req.json();
      commit("setTestList", res);
    } catch (error) {
      console.log(error);
    }
  },
  async deleteEvaluation({ commit, state }, test_id) {
    try {
      const req = await fetch(
        process.env.VUE_APP_BASE_URL + "test/" + test_id,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      if (req.status == 200) {
        const payload = state.test_list.filter((x) => x._id != test_id);
        commit("setTestList", payload);
      }
      return req;
    } catch (error) {
      console.log(error);
    }
  },

  async publishEvaluation({ commit, dispatch }, test_id) {
    try {
      const payload = {
        published: true,
        test_link: `${process.env.VUE_APP_PRESENTER_URL}presenter/${test_id}`,
      };
      const req = await fetch(
        process.env.VUE_APP_BASE_URL + "test/" + test_id,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      if (req.status === 200) {
        commit("settings/setPublishedMode", true, {
          root: true,
        });
        // fetch the updated test
        const req_test = await fetch(
          process.env.VUE_APP_BASE_URL + "test/" + test_id
        );
        const res_test = await req_test.json();
        dispatch("setSelectedEvaluation", res_test);
      }
      return req;
    } catch (error) {
      console.log(error);
    }
  },

  async closeEvaluation({ commit }, test_id) {
    try {
      const payload = {
        closed: true,
      };
      const req = await fetch(
        process.env.VUE_APP_BASE_URL + "test/" + test_id,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      return req;
    } catch (error) {
      console.log(error);
    }
  },
  //************************************************* */

  //************************************************* */
  // CRUD Steps section
  async createStep({ dispatch }, payload) {
    try {
      const url =
        process.env.VUE_APP_BASE_URL + "test/" + payload.test_id + "/step";
      const req = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const res = await req.json();
      // fetch the updated test
      const req_test = await fetch(
        process.env.VUE_APP_BASE_URL + "test/" + res.test_id
      );
      const res_test = await req_test.json();
      dispatch("setSelectedEvaluation", res_test);
    } catch (error) {
      console.log(error);
    }
  },
  async updateStep({ commit }, payload) {
    try {
      const url =
        process.env.VUE_APP_BASE_URL +
        "test/" +
        payload.test_id +
        "/step/" +
        payload._id;
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
        process.env.VUE_APP_BASE_URL +
        "test/" +
        payload.test_id +
        "/step/" +
        payload._id;
      const req = await fetch(url, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const res = await req.json();
      // fetch just create new test
      const req_test = await fetch(
        process.env.VUE_APP_BASE_URL + "test/" + res.test_id
      );
      const res_test = await req_test.json();
      dispatch("setSelectedEvaluation", res_test);
    } catch (error) {
      console.log(error);
    }
  },
  //************************************************* */

  async setSelectedEvaluation({ commit }, payload) {
    try {
      // set retrieved evaluation
      commit("setSelectedEvaluation", payload);
      // update published mode with selected evaluation
      commit("settings/setPublishedMode", payload?.published, { root: true });
      // fetch steps of selected test
      const req_steps = await fetch(
        process.env.VUE_APP_BASE_URL + "test/" + payload._id + "/step"
      );
      if (req_steps?.status == 200) {
        const res_steps = await req_steps.json();
        // First ensure the order of the steps
        const step_array = payload?.steps.map(function(step_id) {
          return res_steps.find((x) => x._id === step_id);
        });
        commit("setSteps", step_array);
        commit("setCurrentStep", step_array[0]);
      }
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
