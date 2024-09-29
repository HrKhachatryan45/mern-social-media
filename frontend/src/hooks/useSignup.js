import { useState} from "react";
import {toast} from "react-toastify";
import {useAuthContext} from "../context/useAuthContext";

const useSignup = () => {
    const [loading,setLoading] = useState(false);
    const {setAuthUser} = useAuthContext();
    const signup = async ({fullName,username,email,password,confirmPassword}) => {
        setLoading(true)
        try {
        const success = handleErrors({fullName,username,email,password,confirmPassword})
        if (!success) return;
        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({fullName,username,email,password,confirmPassword})
        })
        const json = await response.json()
            console.log('json',json)

        if (json.error){
            throw new Error(json.error)
        }
        if (response.ok){
            toast.success('User successfully signed up')
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
    return {signup,loading}

}

export default useSignup;

const handleErrors = ({fullName,username,email,password,confirmPassword}) => {
    if (!fullName || !username || !password || !confirmPassword || !email) {
        toast.warn('All fields must be filled in');
        return false
    }
    return true
}