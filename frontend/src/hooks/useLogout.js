import {useState} from "react";
import {toast} from "react-toastify";
import {useAuthContext} from "../context/useAuthContext";

const useLogout = () => {
    const [loading, setLoading] = useState(false);
    const {setAuthUser} = useAuthContext()
    const logout = async () => {
    setLoading(true)
    try {
        const response = await fetch('/api/auth/logout',{
            method:'POST'
        });
        const json = await response.json();

        console.log(json,'logged out user')
        localStorage.removeItem("user");
        setAuthUser(null)
        console.log('json')

    }catch (error) {
        toast.error(error.message)
        console.log('error',error)
    }finally {
        setLoading(false)
    }

    }
    return {logout,loading}
}

export default useLogout;