import {useState} from "react";
import {toast} from "react-toastify";
import {useAuthContext} from "../context/useAuthContext";

const  useChangePassword = () => {
    const [loading4, setLoading4] = useState(false);
    const {setAuthUser} = useAuthContext()
    const changePassword = async (currentPassword,newPassword,confirmNewPassword) => {
        setLoading4(true);
        try {
            const success = handleErrors(newPassword,confirmNewPassword)
            if (!success) return;
            const response = await fetch('/api/settings/changePassword',{
                method:'PATCH',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({currentPassword,newPassword})
            })
            const json = await response.json()
            console.log(json,'changePassword')
            if (response.ok){
                toast.success('Password successfully changed')
                localStorage.removeItem('user', JSON.stringify(json))
                setAuthUser(null)
            }
            if (json.error){
                toast.error(json.error)
            }
            return true;

        }catch (error) {
            toast.error(error.message)
            console.log('error',error)
            return false;
        }finally {
            setLoading4(false)
        }

    }
    return {changePassword,loading4}
}


const handleErrors = (newPassword,confirmNewPassword) => {

    if (newPassword !== confirmNewPassword) {
        toast.error('New Passwords do not match');
        return false
    }

    return  true;

}


export default useChangePassword;