import {toast} from "react-toastify";
import {useEffect, useState} from "react";
import {useConversationContext} from "../context/useConversationContext";

const useGetMessages = () => {
    const [loading, setLoading] = useState(false);
    const {selectedConversation,setMessages,messages} = useConversationContext()

    useEffect(() => {
        const getMessages = async () => {
            setLoading(true)
            try {
                const response = await fetch(`/api/messages/userMessages/${selectedConversation._id}`)
                const json = await response.json()
                if (json.error){
                    setMessages([])
                }
                if (response.ok){
                    setMessages(json)
                }
            }catch (error) {
                toast.error(error.message)
                console.log('error',error)
                return null;
            }finally {
                setLoading(false)
            }
        }
        if (selectedConversation && selectedConversation._id) {
            getMessages();
        }
    }, [selectedConversation]);

    return {messages,loading}
}
export default useGetMessages;
