import {toast} from "react-toastify";
import {usePostContext} from "../context/usePostContext";

const useRemovePost = () => {
    const {setAllPosts} = usePostContext()
    const removePost =async (postId) => {
        try {
            const response = await fetch(`/api/profile/removePost/${postId}`,{
                method: 'DELETE',
                headers:{'Content-Type': 'application/json'}
            })
            const json = await response.json()

            if (json.error){
                toast.error(json.error)
            }else {
                toast.success("Post removed successfully");
            }

        }catch (error) {
            toast.error(error.message)
            console.log('error',error)
            return null;
        }
    }
    return {removePost}
}
export default useRemovePost