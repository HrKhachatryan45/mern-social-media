import {toast} from "react-toastify";
import {useConversationContext} from "../context/useConversationContext";

const useSendSharedMessage = () => {
    const {setMessages} = useConversationContext()

    const sendSharedMessage =async (message,photo,video,audio,receiverIds,messages,pic,username,postId) => {
        try {

           const response =  await fetch('/api/messages/newSharedMessage',{
                method: 'POST',
                headers:{'Content-Type': 'application/json'},
                body:JSON.stringify({message,photo,video,audio,receiverIds,messages,pic,username,postId})
            })
            const json = await response.json()

            console.log(json,'myJSON')

            setMessages((prevMessages)=>[...prevMessages,json].flat())

            console.log(message,photo,video,audio,receiverIds,messages,pic,username,'details')

            setTimeout(()=>{
                json.map((message) => {
                    setMessages((prevMessages)=> prevMessages.filter((item)=>item._id !== message._id))

                })
            },100)

        }catch (error) {
            toast.error(error.message)
            console.log('error',error)
            return false;
        }
    }
    return {sendSharedMessage}
}
export default useSendSharedMessage