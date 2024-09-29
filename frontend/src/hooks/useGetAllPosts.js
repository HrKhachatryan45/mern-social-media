import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {usePostContext} from "../context/usePostContext";
import {useAuthContext} from "../context/useAuthContext";
import {useSocketContext} from "../context/useSocketContext";

const useGetAllPosts = () => {
    const [loading, setLoading] = useState(false);
    const {setAllPosts} = usePostContext()
    const {authUser} = useAuthContext()
    const {socket} = useSocketContext()
    useEffect(() => {
        const getAllPosts = async () =>{
            setLoading(true)
            try {
                const response = await fetch('/api/profile/getAllPosts')
                const json = await response.json()
                console.log('json',json)
                if (response.ok){
                    setAllPosts(json)
                }
                if (!socket) return ;
                socket.on('updateUser',(updatedUser)=> {
                    console.log('updated',updatedUser)
                    setAllPosts((prevPosts) => {
                        return prevPosts.map((post) => {
                            if (post.userId._id === updatedUser._id) {
                                return {
                                    ...post,
                                    userId: {
                                        ...post.userId,
                                        fullName: updatedUser.fullName,
                                        username: updatedUser.username,
                                        images: {
                                            ...post.userId.images,
                                            profileImage: updatedUser.images.profileImage,
                                        },
                                    },
                                };
                            }
                            return post;
                        });
                    });
                })
                socket.on('deleteUserForPosts',(updatedPosts)=>{
                    if (updatedPosts.length > 0) {
                        setAllPosts(updatedPosts)
                    }else{
                        setAllPosts([])
                    }
                    console.log(updatedPosts,'updatedPosts')
                })
            }catch (error) {
                toast.error(error.message)
                console.log('error',error)
                return null;
            }finally {
                setLoading(false)
            }
            return  () =>{
                socket.off('updateUser')
                socket.off('deleteUserForPosts')
            }
        }
        getAllPosts()
    }, [setAllPosts,authUser,socket]);
    return {loading}
}
export default useGetAllPosts;