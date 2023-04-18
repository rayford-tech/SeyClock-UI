import * as c from "./constants";
import queryString from "query-string";

const api = async function (
  method,
  url,
  data = {},
  headers = {},
  debug = false
) {
  try {
    const response = await fetch(`${c.API_URL}${url}`, {
      method: method.toUpperCase(),
      body: queryString.stringify(data),
      credentials: api.credentials,
      headers: Object.assign({}, api.headers, headers),
    });
    const dataResponse = await (debug ? response.status : response.json());
    if (dataResponse?.message == "Unauthenticated.") {
    }
    return dataResponse;
  } catch (error) {
    console.log(error);
  }
};

api.credentials = "include";
api.headers = {
  "Accept": "application/json",
  "Content-Type": "application/json",
};

["get", "post", "put", "delete"].forEach((method) => {
  api[method] = api.bind(null, method);
});

export { api };
