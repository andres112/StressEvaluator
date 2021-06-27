const state = {
  edition_mode: false,
  notification: { isOn: false, text: null, timeout: 2000 },
};
const mutations = {
  setEditionMode(state, value) {
    state.edition_mode = !value;
  },
  setNotifications(state, payload) {
    state.notification = payload;
    state.notification.timeout = state.notification?.timeout ?? 2000;
  },
};
const actions = {};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
