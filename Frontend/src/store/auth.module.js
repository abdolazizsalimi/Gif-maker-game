import AuthService from "@/services/auth.service";

const cred = JSON.parse(localStorage.getItem("cred"));
const initialState = cred
  ? {
      status: { logged_in: true },
      user: cred.user,
      access_token: cred.access_token,
    }
  : { status: { logged_in: false }, access_token: null, user: null };

export const auth = {
  namespaced: true,
  state: initialState,
  actions: {
    login({ commit }, user) {
      return AuthService.login(user).then(
        (response) => {
          commit("loginSuccess", response);
          return Promise.resolve(response);
        },
        (error) => {
          commit("loginFailure");
          return Promise.reject(error);
        },
      );
    },
    logout({ commit }) {
      AuthService.logout();
      commit("logout");
    },
  },
  mutations: {
    loginSuccess(state, { access_token, user }) {
      state.status.logged_in = true;
      state.access_token = access_token;
      state.user = user;
    },
    loginFailure(state) {
      state.status.logged_in = false;
      state.access_token = null;
      state.user = null;
    },
    logout(state) {
      state.status.logged_in = false;
      state.access_token = null;
      state.user = null;
    },
  },
};
