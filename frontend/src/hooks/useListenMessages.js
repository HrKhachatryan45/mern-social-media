import {useSocketContext} from "../context/useSocketContext";
import {useEffect} from "react";
import {usePostContext} from "../context/usePostContext";

const useListenMessages = () => {
    const {socket} = useSocketContext()
    const {setAllPosts} = usePostContext()
    useEffect(() => {
        if (!socket) return ;
        socket.on('newComment',(updatedPost)=>{
            setAllPosts((prevPosts)=>
                prevPosts.map((post)=>
                    post._id === updatedPost._id?updatedPost:post
                ))
        })
        return () => {
            socket.off("newComment")
        };
    }, [socket,setAllPosts]);

}
export default useListenMessages;