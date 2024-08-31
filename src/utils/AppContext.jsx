import axios from "axios";
import { createContext } from "react";

export const AppContext = createContext()

function AppProvider({ children }){

    axios.defaults.xsrfCookieName = 'csrftoken'
    axios.defaults.xsrfHeaderName = 'X-CSRFToken'
    axios.defaults.withCredentials = true

    const client = axios.create({
        baseURL: "http://127.0.0.1:8000"
    })

    const logout = () => {
        client.post('/logout',{
            withCredentials: true
        }).then((response)=>{
            console.log(response)
        })
    }

    return(
        <AppContext.Provider value={{
            client,
            logout
        }}>
            { children }
        </AppContext.Provider>
    )
}
export default AppProvider