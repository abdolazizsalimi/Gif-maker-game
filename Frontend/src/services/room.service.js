import authHeader from "./auth-header";
import { BACKEND_URL } from "@/constants";

const axios = require("axios").create({
  baseURL: `${BACKEND_URL}/rooms/`,
  timeout: 10000,
});

class RoomService {
  create() {
    return axios
      .post(
        "create",
        {},
        {
          headers: authHeader(),
        },
      )
      .then(({ data: room }) => room);
  }

  join({ room_id }) {
    return axios
      .post(
        "join",
        { room_id },
        {
          headers: authHeader(),
        },
      )
      .then(({ data: room }) => room);
  }

  leave() {
    return axios
      .post(
        "leave",
        {},
        {
          headers: authHeader(),
        },
      )
      .then(({ data: room }) => room);
  }

  start({ room_id }) {
    return axios
      .post(
        "start",
        { room_id },
        {
          headers: authHeader(),
        },
      )
      .then(({ data: room }) => room);
  }

  submit(data) {
    console.log("baw");
    return axios
      .post("submit", data, {
        headers: authHeader(),
      })
      .then(({ data: game }) => game);
  }
  submit2(data) {
    console.log("baw2");
    axios.post("submit", data, {
      headers: authHeader(),
    });
    return Promise.resolve({ data: "bilakh" });
  }
}

export default RoomService;
