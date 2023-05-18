import RoomService from "@/services/room.service";

const initialState = {
  current: null,
  next: null,
};

const roomService = new RoomService();

export const game = {
  namespaced: true,
  state: initialState,
  actions: {
    create({ commit }) {
      return roomService.create().then(
        (game) => {
          commit("createGameSuccess", game);
          return Promise.resolve(game);
        },
        (error) => {
          commit("createGameFailure");
          return Promise.reject(error);
        },
      );
    },
    join({ commit }, room_id) {
      return roomService.join({ room_id }).then(
        (game) => {
          commit("joinGameSuccess", game);
          return Promise.resolve(game);
        },
        (error) => {
          commit("joinGameFailure");
          return Promise.reject(error);
        },
      );
    },
    start({ commit }, room_id) {
      return roomService.start({ room_id }).then(
        (game) => {
          commit("startGameSuccess", game);
          return Promise.resolve(game);
        },
        (error) => {
          commit("startGameFailure");
          return Promise.reject(error);
        },
      );
    },
    leave({ commit }) {
      return roomService.leave().then(
        (game) => {
          commit("leaveGame");
          return Promise.resolve(game);
        },
        (error) => {
          commit("leaveGame");
          return Promise.reject(error);
        },
      );
    },
  },
  mutations: {
    createGameSuccess(state, game) {
      console.log(game);
      state.current = game;
    },
    createGameFailure(state) {
      state.current = null;
    },
    joinUser(state, user) {
      state.current.room.players.push(user);
    },
    leaveUser(state, user_id) {
      state.current.room.players = state.current.room.players.filter(
        (player) => player.id != user_id,
      );
    },
    joinGameSuccess(state, game) {
      state.current = game;
    },
    joinGameFailure(state) {
      state.current = null;
    },
    startGameSuccess(state, game) {
      console.log(game);
      state.current = game;
    },
    startGameFailure(state) {
      state.current = null;
    },
    leaveGame(state) {
      state.current = null;
    },
    nextRoom(state, next) {
      state.next = next;
    },
    finishGame(state, game) {
      state.current = game;
    },
  },
};
