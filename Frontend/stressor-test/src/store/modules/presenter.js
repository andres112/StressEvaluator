import { createNanoId } from "@/assets/helpers.js";

const state = {
  evaluation: null,
};
const getters = {};
const mutations = {
  setEvaluation(state, payload) {
    state.evaluation = payload;
  },
  clearStates(state) {
    state.evaluation = null;
  },
};
const actions = {
  // TODO: create session for user evaluation
  async createSession({ commit }, test_id) {
    try {
      const payload = {
        session_id: createNanoId(),
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
      console.log(await req.json());
      return req;
    } catch (error) {
      console.log(error);
    }
  },
  // TODO: get the evaluation by identifier
  async getEvaluation({ commit, dispatch }, test_id) {
    try {
      const url = process.env.VUE_APP_BASE_URL + "test/" + test_id;
      const req = await fetch(url);
      const res = await req.json();
      if (req.status != 200) {
        commit("setEvaluation", null);
      } else {
        commit("setEvaluation", res);
        const req_session = await dispatch("createSession", test_id);
        // return response of create session
        return req_session;
      }
      // return response of get evaluation
      return req;
    } catch (error) {
      console.log(error);
    }
  },
  // TODO: get step by step identifier and evaluation id
  // TODO: send step answers after saving or timesup
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
