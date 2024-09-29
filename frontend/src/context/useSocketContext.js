import {createContext, useContext, useEffect, useState} from "react";
import {io} from  'socket.io-client'
import {useAuthContext} from "./useAuthContext";
export const SocketContext = createContext();

export const useSocketContext = () =>{
    return useContext(SocketContext);
}

export const SocketContextProvider = ({children}) => {
    const [socket,setSocket] = useState(null);
    const {authUser} = useAuthContext()
    const [onlineUsers,setOnlineUsers] =useState([])
    useEffect(() => {
        if (authUser){
            const socket = io('http://localhost:8080/',{
                query:{
                    userId: authUser._id
                }
            })

            setSocket(socket)

            socket.on('getOnlineUsers',(receivedOnlineUsers)=>{
                setOnlineUsers(receivedOnlineUsers)
                console.log(receivedOnlineUsers,'onlineUsers')
            })


            const handleActivity = () => {
                socket.emit('lastActivity',authUser._id)
            };

            window.addEventListener('mousemove', handleActivity);
            window.addEventListener('keypress', handleActivity);

            return ()=>{
                socket.close()
                window.removeEventListener('mousemove', handleActivity);
                window.removeEventListener('keypress', handleActivity);
            }
        }else{
           if (socket){
               socket.close()
               setSocket(null)
           }
        }
    }, [authUser]);

    return <SocketContext.Provider value={{socket,onlineUsers}}>{children}</SocketContext.Provider>
}

