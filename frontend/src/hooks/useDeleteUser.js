import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {useAuthContext} from "../context/useAuthContext";
import {useSocketContext} from "../context/useSocketContext";

const useDeleteUser = () => {
    const [loading5,setLoading5] = useState(false);
    const {setAuthUser} = useAuthContext()


    const deleteUser = async (password) => {
        setLoading5(true)
        try {
            const response = await fetch('/api/settings/deleteUser',{
                method:'DELETE',
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({password})
            })
            const json =await response.json()

            if (json.error){
                toast.error(json.error)
            }
            if (response.ok){
                setAuthUser(null)
                localStorage.removeItem('user')
                toast.success('User successfully deleted')
            }

        }catch (error) {
            toast.error(error.message)
            console.log('error',error)
        }finally {
            setLoading5(false)
        }
    }
    return {deleteUser,loading5}
}
export default useDeleteUser