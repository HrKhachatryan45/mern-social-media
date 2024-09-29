import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {usePostContext} from "../context/usePostContext";
import {useSocketContext} from "../context/useSocketContext";

const useLikePost = () =>{
    const {setAllPosts} = usePostContext()
    const {socket} = useSocketContext()
    useEffect(() => {
        if (!socket) return
        const handlePostLiked = (updatedPost) => {
            console.log("Post liked event received:", updatedPost); // Debugging line
            setAllPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post._id === updatedPost._id ? updatedPost : post
                )
            );
        };

        socket.on("postLiked", handlePostLiked);

        return () => {
            socket.off("postLiked");
        };
    }, [setAllPosts]);


    const likePost =async (postId) => {
        try {
            const response = await  fetch(`/api/profile/likePost/${postId}`,{
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
    return {likePost}
}
export default useLikePost