import {toast} from "react-toastify";
import {useConversationContext} from "../context/useConversationContext";

const useDeleteReaction = () => {
    const {setMessages} = useConversationContext()
    const deleteReaction = async (messageId,type,index,reactionIndex) => {
        try {
         const response = await fetch(`/api/messages/deleteReaction/${messageId}`,{
             method:'PATCH',
             headers:{"Content-Type":"application/json"},
             body:JSON.stringify({type,reactionIndex,index})
         })

            const json = await response.json()

            setMessages((prevMessages) =>
                prevMessages.map((message) =>
                    message._id === messageId ? json : message
                )
            );

        }catch (error) {
            toast.error(error.message)
            console.log('error',error)
            return null;
        }
    }
    return {deleteReaction}
}
export default useDeleteReaction;