import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {usePostContext} from "../context/usePostContext";
import {useSocketContext} from "../context/useSocketContext";

const useUnLikePost = () =>{
    const {setAllPosts} = usePostContext()
    const {socket} = useSocketContext()
    useEffect(() => {
        if (!socket) return
        const handlePostUnLiked = (updatedPost) => {
            console.log("Post unliked event received:", updatedPost); // Debugging line
            setAllPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post._id === updatedPost._id ? updatedPost : post
                )
            );
        };

        socket.on("postUnLiked", handlePostUnLiked);

        return () => {
            socket.off("postUnLiked");
        };
    }, [setAllPosts]);
    const unLikePost =async (postId) => {
        try {
            const response = await  fetch(`/api/profile/unlikePost/${postId}`,{
                method:'PATCH',
                headers:{'Content-Type':'application/json'}
            })
            const json = await response.json()
            console.log('liked post',json)
            setAllPosts((prevPosts)=>prevPosts.map((post)=>post._id === postId ?json:post))
        }catch (error) {
            toast.error(error.message)
            console.log('error',error)
        }
    }
    return {unLikePost}
}
export default useUnLikePost