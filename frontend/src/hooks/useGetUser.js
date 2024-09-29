import {toast} from "react-toastify";

const useGetUser = () => {
        const getUser = async  (userId) => {
            try {
                const response = await fetch(`/api/settings/user/${userId}`);
                const json = await response.json();

                return json
            }catch (error) {
                toast.error(error.message)
                console.log('error', error)
            }
        }


    return {getUser}
}
export default useGetUser;