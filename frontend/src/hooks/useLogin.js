import { useState} from "react";
import {toast} from "react-toastify";
import {useAuthContext} from "../context/useAuthContext";

const useLogin = () => {
    const [loading,setLoading] = useState(false);
    const {setAuthUser} = useAuthContext();
    const login = async (username,password) => {
        setLoading(true)
        try {
            const success = handleErrors(username,password)
            if (!success) return;
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({username,password})
            })
            const json = await response.json()
            console.log('json',json)
            if (json.error){
                throw new Error(json.error)
            }
            if (response.ok){
                toast.success('User successfully logged in')
                setTimeout(()=>{
                    setAuthUser(json)
                    localStorage.setItem('user',JSON.stringify(json))
                },1500)
            }
        }catch (error) {
            toast.error(error.message)
            console.log('error',error)
        }finally {
            setLoading(false)
        }
    }
    return {login,loading}

}

export default useLogin;

const handleErrors = (username,password) => {
    if (!username || !password ) {
        toast.warn('All fields must be filled in');
        return false
    }
    return true
}