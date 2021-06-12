const state = { test_id: null };
const mutations = {
  setTestId(state, value) {
    state.test_id = value;
  },
};
const actions = {
  async createEvaluation({ commit }, payload) {
    try {
      console.log(process.env.VUE_APP_BUILDER_URL);
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
      console.error(error);
    }
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
