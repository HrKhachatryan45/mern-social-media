import {toast} from "react-toastify";
import {useAuthContext} from "../context/useAuthContext";

const useRemoveFollower = () =>{
    const {setAuthUser} = useAuthContext()
    const removeFollower =async (followerId) => {
        try {
            const response = await fetch(`/api/profile/removeFollowing/${followerId}`,{
                method: "PATCH",
                headers:{'Content-Type': 'application/json'}
            })
            const json = await response.json()
            setAuthUser(json)
            localStorage.setItem('user',JSON.stringify(json))
            console.log(json,'UnFollowing')

        }catch (error) {
            toast.error(error.message)
            console.log('error',error)
            return null;
        }
    }
    return {removeFollower}
}
export default useRemoveFollower;