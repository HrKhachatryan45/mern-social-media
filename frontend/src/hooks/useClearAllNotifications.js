import {useState} from "react";
import {toast} from "react-toastify";
import {useAuthContext} from "../context/useAuthContext";

const  useClearAllNotifications = () => {
    const [loading, setLoading] = useState(false)
    const {setAuthUser} = useAuthContext()
    const clearAllNotifications = async () => {
        setLoading(true)
        try {
            const response = await fetch('api/settings/clearAllNotifications',{
                method:'DELETE',
                headers:{'Content-Type':'application/json'}
            })
            const json = await response.json()
            if (json.error){
                toast.error(json.error)
            }
            if (response.ok){
                setAuthUser((prevAuthUser)=>({
                    ...prevAuthUser,
                    notifications:json.notifications
                }))
            }

        }catch (error) {
            toast.error(error.message)
            console.log('error',error)
        }finally {
            setLoading(false)
        }
    }

    return {clearAllNotifications,loading}

}
export default useClearAllNotifications;