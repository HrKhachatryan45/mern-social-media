import {useEffect, useState} from "react";
import {toast} from "react-toastify";

const useGetFollower = () => {
    const [loading2, setLoading2] = useState(false);
        const getFollower =async (id) =>{
            setLoading2(true)

            try {
                const response = await fetch(`/api/profile/follower/${id}`)
                const json = await response.json()
                return json

            }catch (error) {
                toast.error(error.message)
                console.log('error',error)
                return null;
            }finally {
                setLoading2(false)
            }
        }
    return {getFollower,loading2}
}
export default useGetFollower;