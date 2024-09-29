import {useState} from "react";
import {toast} from "react-toastify";
import {useConversationContext} from "../context/useConversationContext";

const useSendMessage = () => {
    const [loading, setLoading] = useState(false);
    const {selectedConversation,setMessages} = useConversationContext()
    const sendMessage =async (formData) => {
        setLoading(true)
        try {
            const success = handleErrors(formData)
            if (!success) return;


            const response = await fetch(`/api/messages/newMessage/${selectedConversation._id}`,{
                method: "POST",
                body: formData,
            })


            const json = await response.json()
            if (json.error){
                toast.error(json.error)
            }
            setMessages((prevMessages) => {
                if (!Array.isArray(prevMessages)) {
                    prevMessages = [];
                }
                return [...prevMessages, json];
            });
        }catch (error) {
            toast.error(error.message)
            console.log('error',error)
        }finally {
            setLoading(false)
        }
    }
    return {sendMessage,loading}
}


export default useSendMessage;


const handleErrors = (formData) => {
    const message= formData.get('message');
    const audio = formData.get('audio')
    const videos= formData.get('videos')
    const photos = formData.get('photos')

    if (message || audio || videos || photos){
        return true
    }else {
        toast.error('No details provided')
        return  false
    }
}