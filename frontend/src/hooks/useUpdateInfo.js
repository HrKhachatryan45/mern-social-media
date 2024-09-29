import {useState} from "react";
import {toast} from "react-toastify";
import {useAuthContext} from "../context/useAuthContext";

const useUpdateInfo = () => {
    const [loading3, setLoading3] = useState(false);
    const {setAuthUser} = useAuthContext()
    const updateInfo = async (formData) => {
        setLoading3(true)
        try {
            const response = await fetch('api/settings/updateInfo',{
                method: 'PATCH',
                body:formData
            })
            const json = await response.json()

            if (json.error){
                toast.error(json.error)
            }
            console.log(json,'updated User')

            // if (response.ok){
            //     localStorage.setItem('user',JSON.stringify(json))
            //     setAuthUser(json)
            // }

        }catch (error) {
            toast.error(error.message)
            console.log('error',error)
        }finally {
            setLoading3(false)
        }
    }
    return {updateInfo,loading3}
}
export default useUpdateInfo;