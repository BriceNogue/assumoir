import AsyncStorage from "@react-native-async-storage/async-storage";

type Headers = {
  Accept: string;
  "Content-type"?: string;
  Authorization?: string;
};

const API_BASE_URL_CONST = "http://localhost:3000/api";

export default async function fetchData(
  path: string,
  method: string,
  body?: object,
  useToken?: boolean,
) {
  const token = await AsyncStorage.getItem("token");
  const endpoint = API_BASE_URL_CONST;
  const headers: Headers = {
    Accept: "application/json",
    "Content-type": "application/json",
  };
  if (token !== undefined && useToken) {
    headers["Authorization"] = "Bearer " + token;
  }
  return fetch(endpoint + path, {
    headers,
    method,
    ...(body && method !== "GET" ? { body: JSON.stringify(body) } : {}),
  })
    .then(async (response) => {
      if (!response.ok) {
        console.log("Error, in route !");
        const { message } = await response.json();
        throw Error("Erreur : " + message);
      }
      return response.json();
    })
    .catch((error) => {
      console.log(error.message);
      throw Error(error.message);
    });
}

export async function fetchDocument(
  path: string,
  method: string,
  body?: any,
  useToken?: boolean,
) {
  const token = await AsyncStorage.getItem("token");
  const endpoint = API_BASE_URL_CONST;
  const headers: Headers = {
    Accept: "application/json",
  };
  if (token !== undefined && useToken) {
    headers["Authorization"] = "Bearer " + token;
  }
  return fetch(endpoint + path, {
    headers,
    method,
    ...(body ? { body } : {}),
  })
    .then(async (response) => {
      if (!response.ok) {
        console.log("Error, in route !");
        const { message } = await response.json();
        throw Error("Erreur : " + message);
      }
      return response.json();
    })
    .catch((error) => {
      console.log(error.message);
      throw Error(error.message);
    });
}
