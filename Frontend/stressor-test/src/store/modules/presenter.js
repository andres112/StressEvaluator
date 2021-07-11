import { createNanoId } from "@/assets/helpers.js";

const state = {
  evaluation: null,
  current_step: null,
};
const getters = {};
const mutations = {
  setEvaluation(state, payload) {
    state.evaluation = payload;
  },
  setCurrentStep(state, payload) {
    state.current_step = payload;
  },
  clearStates(state) {
    state.evaluation = null;
  },
};
const actions = {
  // Create session for user evaluation
  async createSession({ dispatch, state }, test_id) {
    try {
      const session_id = createNanoId();
      const payload = {
        session_id: session_id,
        test_id: test_id,
      };
      const url = process.env.VUE_APP_BASE_URL + "create_session/" + test_id;
      const req = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const res = await req.json();
      // get the first step which is the evaluation's informed consent
      const step_payload = {
        test_id: test_id,
        step_id: state.evaluation.steps[0],
      };
      await dispatch("getStep", step_payload);
      return res;
    } catch (error) {
      console.log(error);
    }
  },
  // Get the evaluation by identifier
  async getEvaluation({ commit }, test_id) {
    try {
      const url = process.env.VUE_APP_BASE_URL + "test/" + test_id;
      const req = await fetch(url);
      const res = await req.json();
      if (req.status != 200) {
        commit("setEvaluation", null);
      } else {
        commit("setEvaluation", res);
      }
      // return response of get evaluation
      return req;
    } catch (error) {
      console.log(error);
    }
  },
  // Get step by step identifier and evaluation id
  async getStep({ commit }, payload) {
    try {
      const url =
        process.env.VUE_APP_BASE_URL +
        "test/" +
        payload.test_id +
        "/step/" +
        payload.step_id;
      const req = await fetch(url);
      const res = await req.json();
      commit("setCurrentStep", res);
    } catch (error) {
      console.log(error);
    }
  },
  // TODO: send step answers after saving or timesup
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
