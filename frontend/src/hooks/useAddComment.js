import {useState} from "react";
import {useAuthContext} from "../context/useAuthContext";
import {usePostContext} from "../context/usePostContext";

const useAddComment = () => {
    const {authUser} = useAuthContext()
    const {setAllPosts} = usePostContext()
    const [loading, setLoading] = useState(false);
    const addComment = async  (commentMessage,postId) => {
        const response  = await fetch(`/api/profile/newComment/${postId}`,{
            method: 'POST',
            body: JSON.stringify({commentMessage,senderId:authUser._id}),
            headers:{'Content-Type': 'application/json'}
        })
        const json = await response.json()
        console.log(json,'comment')
        setAllPosts((prevPosts)=>
            prevPosts.map((post)=>
                post._id === json._id?json:post
            ))
    }
    return {loading,addComment}
}
export default useAddComment;