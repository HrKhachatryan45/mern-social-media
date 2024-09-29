import {useSocketContext} from "../context/useSocketContext";
import {usePostContext} from "../context/usePostContext";
import {useEffect} from "react";

const useListenPostUpdates = () => {
    const {socket} = useSocketContext()
    const {setAllPosts,allPosts}= usePostContext()
    useEffect(() => {
        if (!socket) return;
        socket.on('newPost',(newPost)=>{
            setAllPosts([newPost,...allPosts])
        })
        socket.on('removePost',(removePost)=>{
            setAllPosts((prevPosts)=>
            prevPosts.filter(post=>post._id !== removePost._id)
            )
        })
    }, [setAllPosts,socket,allPosts]);
    return () => {
        socket.off('newPost')
        socket.off('removePost')
    }
}
export default useListenPostUpdates;