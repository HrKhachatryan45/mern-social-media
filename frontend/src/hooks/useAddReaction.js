import {useConversationContext} from "../context/useConversationContext";
import {toast} from "react-toastify";
import {useEffect} from "react";
import {useSocketContext} from "../context/useSocketContext";

const useAddReaction = () => {
    const {setMessages} = useConversationContext()


    const addReaction = async (reaction,messageId,type,index) => {
        console.log(type,'fe')
        try {
         const response = await fetch(`/api/messages/reactToMessage/${messageId}`,{
             method: "PATCH",
             headers:{'Content-Type':'application/json'},
             body: JSON.stringify({reaction,type,index})
         })
            const json =await response.json()
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
    return {addReaction}
}
export default useAddReaction