import axios from "axios";
import { createContext, useState } from "react";

export const AppContext = createContext();

function AppProvider({ children }) {
  axios.defaults.xsrfCookieName = "csrftoken";
  axios.defaults.xsrfHeaderName = "X-CSRFToken";
  axios.defaults.withCredentials = true;

  const client = axios.create({
    baseURL: "http://127.0.0.1:8000",
  });
  let [authToken, setAuthToken] = useState(() =>
    localStorage.getItem("token") ? localStorage.getItem("token") : null
  );

  const logout = () => {
    client
      .post("/logout", {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response);
      });
  };

  return (
    <AppContext.Provider
      value={{
        client,
        logout,
        authToken,
        setAuthToken
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
export default AppProvider;
