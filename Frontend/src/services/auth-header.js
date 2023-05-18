// Return Header used to authenticate
export default function authHeader() {
  let { access_token } = JSON.parse(localStorage.getItem("cred"));

  if (access_token) {
    return { Authorization: "Bearer " + access_token };
  } else {
    return {};
  }
}
