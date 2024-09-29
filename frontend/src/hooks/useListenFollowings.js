import {useSocketContext} from "../context/useSocketContext";
import {useEffect} from "react";
import {useAuthContext} from "../context/useAuthContext";


const useListenFollowings = () => {
    const {socket} = useSocketContext()
    const {setAuthUser,authUser} = useAuthContext()
    useEffect(() => {
        if (!socket) return ;
        socket.on('followerAdded',(updatedUser) => {
            updatedUser.notifications.forEach(notification => {
                if (notification.receiverId.includes(authUser._id)) {
                    notification.shouldShake = true;
                }
            });
            localStorage.setItem('user',JSON.stringify(updatedUser))
            setAuthUser(updatedUser)
            console.log('updatedUser Added',updatedUser)
        })

        socket.on('followerRemoved',(updatedUser) => {
            updatedUser.notifications.forEach(notification => {
                if (notification.receiverId.includes(authUser._id)) {
                    notification.shouldShake = true;
                }
            });
            localStorage.setItem('user',JSON.stringify(updatedUser))
            setAuthUser(updatedUser)
            console.log('updatedUser Removed',updatedUser)
        })


        return () => {
            socket.off("followerAdded")
            socket.off("followerRemoved")
        };
    }, [setAuthUser,socket]);
}
export default useListenFollowings;