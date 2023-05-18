import { createStore } from "vuex";
import { auth } from "./auth.module";
import { game } from "./game.module";

import { io } from "socket.io-client";
import { BACKEND_URL } from "@/constants";
import authHeader from "@/services/auth-header";

const initialState = {
  socket: null,
};

const store = createStore({
  state: initialState,
  modules: {
    auth,
    game,
  },
  mutations: {
    connectSocket(state) {
      state.socket = io(BACKEND_URL, {
        extraHeaders: authHeader(),
      });
      console.log(state.socket.connected);
    },
    disconnectSocket(state) {
      state.socket = state.socket.disconnect();
    },
  },
});

export default store;
