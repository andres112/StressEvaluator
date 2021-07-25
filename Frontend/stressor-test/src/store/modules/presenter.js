import { createNanoId } from "@/assets/helpers.js";

const state = {
  evaluation: null,
  current_step: null,
  session_id: null,
};
const getters = {};
const mutations = {
  setEvaluation(state, payload) {
    state.evaluation = payload;
  },
  setCurrentStep(state, payload) {
    state.current_step = payload;
  },
  setSessionId(state, id) {
    state.session_id = id;
  },
  clearStates(state) {
    state.evaluation = null;
    state.session_id = null;
    state.current_step = null;
  },
};
const actions = {
  //************************************************* */
  // CRUD Evaluation session
  // Create session for user evaluation
  async createSession({ commit, dispatch, state }, session_data) {
    try {
      commit("setSessionId", createNanoId());
      const payload = {
        session_id: state.session_id,
        test_id: session_data.test_id,
        user: session_data.user,
      };
      const url =
        process.env.VUE_APP_BASE_URL + "create_session/" + session_data.test_id;
      const req = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const res = await req.json();
      // Get the first step which is the evaluation's informed consent
      const step_payload = {
        test_id: payload.test_id,
        step_id: state.evaluation.steps[0],
      };
      await dispatch("getStep", step_payload);

      return res;
    } catch (error) {
      console.log(error);
    }
  },

  // Update session data
  async updateSession({ commit }, payload) {
    try {
      // Url for session updating
      const url =
        process.env.VUE_APP_BASE_URL +
        "test/" +
        payload.test_id +
        "/session/" +
        payload.session_id;
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

  async closeSession({ commit }, payload) {
    try {
      // Url for session updating
      const url =
        process.env.VUE_APP_BASE_URL +
        "close_session/" +
        payload.test_id +
        "/session/" +
        payload.session_id;
      const req = await fetch(url);
      return req;
    } catch (error) {
      console.log(error);
    }
  },
  //************************************************* */

  //************************************************* */
  // Step response section
  // Update session responses
  async updateResponses({ commit }, payload) {
    try {
      // Url for session updating
      const url =
        process.env.VUE_APP_BASE_URL +
        "test/" +
        payload.test_id +
        "/session/" +
        payload.session_id;
      if (payload?.response) {
        const req = await fetch(url, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload.response),
        });
        return req;
      }
    } catch (error) {
      console.log(error);
    }
  },
  //************************************************* */

  // Get the evaluation by identifier
  async getEvaluation({ commit }, test_id) {
    try {
      // firt clean all the states of previous evaluations
      commit("clearStates");
      const url = process.env.VUE_APP_BASE_URL + "test/" + test_id;
      const req = await fetch(url);
      const res = await req.json();
      if (req.status != 200) {
        commit("setEvaluation", null);
      } else {
        commit("setEvaluation", res);
      }
      // return response of get evaluation
      return res;
    } catch (error) {
      console.log(error);
    }
  },

  // Get step by step identifier and evaluation id
  async getStep({ commit, dispatch, state }, payload) {
    try {
      const url =
        process.env.VUE_APP_BASE_URL +
        "test/" +
        payload.test_id +
        "/step/" +
        payload.step_id;
      const req = await fetch(url);
      if (req?.status == 200) {
        const res = await req.json();
        // After step is retrieved update the session
        const new_step = {
          test_id: payload.test_id,
          session_id: state.session_id,
          current_step: payload.step_id,
        };
        await dispatch("updateSession", new_step);
        commit("setCurrentStep", res);
      }
      return req;
    } catch (error) {
      console.log(error);
    } finally {
      // Every time step is retrieved, ensure edition_mode is off
      commit("settings/setEditionMode", false, { root: true });
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
