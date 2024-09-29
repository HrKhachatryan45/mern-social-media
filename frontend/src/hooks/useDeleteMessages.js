import {toast} from "react-toastify";

const useDeleteMessages = () => {
    const deleteMessages = async (messages) => {
        try {
            const response = await fetch(`/api/messages/deleteMessages/`, {
                method: "DELETE",
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify(messages)
            })
            console.log(messages,'popo')


            const json = await response.json()

        }catch (error) {
            toast.error(error.message)
            console.log('error',error)
        }
    }
    return {deleteMessages}
}
export default useDeleteMessages;