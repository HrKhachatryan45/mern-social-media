import {toast} from "react-toastify";
import {useConversationContext} from "../context/useConversationContext";

const useDeleteMessage = () => {
    const {setMessages} = useConversationContext()
    const deleteMessage = async (messageId,type,index) => {
        try {
            const response = await fetch(`/api/messages/deleteMessage/${messageId}`, {
                method: "DELETE",
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({type,index})
            })

            const json = await response.json()

            console.log(json,'json of del')

            if (!json.isDeleted){
                setMessages((prevMessages) =>
                    prevMessages.map((message) =>
                        message._id === messageId ? json : message
                    )
                );
            }else{
                setMessages((prevMessages) => prevMessages.filter((message) => message._id !== messageId))
            }


        }catch (error) {
            toast.error(error.message)
            console.log('error',error)
        }
    }
    return {deleteMessage}
}
export default useDeleteMessage;