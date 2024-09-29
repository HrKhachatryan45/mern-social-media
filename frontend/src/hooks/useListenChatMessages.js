import {useSocketContext} from "../context/useSocketContext";
import {useEffect} from "react";
import {useConversationContext} from "../context/useConversationContext";

const useListenChatMessages = () => {
    const {socket} = useSocketContext()
    const {setMessages,messages} = useConversationContext()
    useEffect(() => {
        if (!socket) return;

        socket?.on('newMessage', (newMessage) => {
            setMessages([...messages,newMessage])
        })

        return () => socket.off('newMessage')
    }, [socket, setMessages, messages]);
}
export default useListenChatMessages;