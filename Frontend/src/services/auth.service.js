import { BACKEND_URL } from "@/constants";

const axios = require("axios").create({
  baseURL: `${BACKEND_URL}/auth/`,
  timeout: 10000,
});

class AuthService {
  login({ username, avatar }) {
    return axios
      .post("login", {
        username,
        avatar,
      })
      .then((response) => {
        if (response.data)
          localStorage.setItem("cred", JSON.stringify(response.data));
        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("cred");
  }
}

export default new AuthService();
