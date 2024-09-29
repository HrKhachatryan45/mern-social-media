import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {usePostContext} from "../context/usePostContext";

const useGetTrendings = () => {
    const [loading,setLoading] = useState(false);
    const [allTrendings, setAllTrendings] = useState([]);
    const {allPosts} = usePostContext()
    useEffect(() => {
        const getTrendings = async () => {
            setLoading(true)
            try {
                const response = await fetch("/api/profile/trending-hashtags");
                const json = await response.json()

                console.log('trends',json)
                if (json.error){
                    throw new Error(json.error)
                }
                if (response.ok){
                    setAllTrendings(json)
                }
            }catch (error) {
                toast.error(error.message)
                console.log('error',error)
            }finally {
                setLoading(false)
            }
        }
        getTrendings()
    }, [allPosts]);
    return {allTrendings,loading};
}
export default useGetTrendings;