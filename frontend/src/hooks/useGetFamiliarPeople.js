import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {useAuthContext} from "../context/useAuthContext";

const useGetFamiliarPeople = () => {
    const [familiarPeopleData,setFamiliarPeopleData] = useState([]);
    const [loading, setLoading] = useState(false);
    const {authUser} =useAuthContext()
    const getFamiliarPeople =  async  () => {
        setLoading(true)
        try {
            const response = await fetch('api/profile/suggested-users')
            const json = await response.json()
            if (json.error){
                toast.error(json.error)
            }
            if (response.ok){
                setFamiliarPeopleData(json)
            }

        }catch (error) {
            toast.error(error.message)
            console.log('error',error)
        }finally {
            setLoading(false)
        }
    }
    useEffect(() => {

        getFamiliarPeople()
    }, [authUser.arrays]);
    return {familiarPeopleData,loading,getFamiliarPeople}
}
export default useGetFamiliarPeople;