import {createContext, useContext, useEffect, useState} from "react";
import {useSocketContext} from "./useSocketContext";


export const AuthContext = createContext();


export const useAuthContext = () =>{
    return useContext(AuthContext)
}


export const AuthContextProvider = ({children}) => {
    const [authUser,setAuthUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
    console.log('loggined user',authUser)

    return <AuthContext.Provider value={{authUser,setAuthUser}}>{children}</AuthContext.Provider>
}


