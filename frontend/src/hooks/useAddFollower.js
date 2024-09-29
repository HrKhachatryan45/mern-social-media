import {toast} from "react-toastify";
import {useAuthContext} from "../context/useAuthContext";

const useAddFollower = () =>{
    const {setAuthUser} = useAuthContext()
    const addFollower =async (followerId) => {
        try {
            const response = await fetch(`/api/profile/addFollowing/${followerId}`,{
                method: "PATCH",
                headers:{'Content-Type': 'application/json'}
            })
            const json = await response.json()
            setAuthUser(json)
            localStorage.setItem('user',JSON.stringify(json))
            console.log(json,'newFollowing')

        }catch (error) {
            toast.error(error.message)
            console.log('error',error)
            return null;
        }
    }
    return {addFollower}
}
export default useAddFollower;