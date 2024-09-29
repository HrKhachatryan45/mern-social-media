import {toast} from "react-toastify";
import {useState} from "react";


const useGetPostLink = () => {
    const [loading, setLoading] = useState(false);
    const getPostLink =async (postId) => {
        setLoading(true)
        try {
            const response = await fetch(`/api/profile/getPost/${postId}`);
            const json = await response.json();

            return json
        }catch (error) {
            toast.error(error.message)
            console.log('error', error)
        }finally {
            setLoading(false)
        }
    }
    return {getPostLink,loading}
 }
 export default useGetPostLink;
