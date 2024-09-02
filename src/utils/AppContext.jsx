import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AppContext = createContext();

function AppProvider({ children }) {
  axios.defaults.xsrfCookieName = "csrftoken";
  axios.defaults.xsrfHeaderName = "X-CSRFToken";
  //   axios.defaults.withCredentials = true;

  const client = axios.create({
    baseURL: "http://3.24.168.183",
  });
  let [authToken, setAuthToken] = useState(() =>
    localStorage.getItem("token") ? localStorage.getItem("token") : null
  );

  let [refreshToken, setRefreshToken] = useState(() =>
    localStorage.getItem("refresh") ? localStorage.getItem("refresh") : null
  );
  

  const [events, setEvents] = useState([]);

  

  const clearToken = () => {
    localStorage.getItem("token") && localStorage.removeItem("token")
    authToken && setAuthToken(null)

    // localStorage.getItem("refresh") && localStorage.removeItem("refresh")
    // refreshToken && setRefreshToken(null)
  }
 
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
        setAuthToken,
        events,
        setEvents,
        clearToken,
        refreshToken,
        setRefreshToken
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
export default AppProvider;
