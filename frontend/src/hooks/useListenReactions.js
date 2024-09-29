import {useEffect} from "react";
import {useSocketContext} from "../context/useSocketContext";
import {useConversationContext} from "../context/useConversationContext";

const useListenReactions = () => {
    const {socket} = useSocketContext()
    const {setMessages,messages} = useConversationContext()
    useEffect(() => {
        if (!socket) return;

        const handleMessageWithReaction = (updatedMessage) => {
            console.log('Received updated message:', updatedMessage);
           if (!updatedMessage.isDeleted){
               setMessages((prevMessages) =>
                   prevMessages.map((message) =>
                       message._id === updatedMessage._id ? updatedMessage : message
                   )
               );
           }else{
                setMessages((prevMessages) => prevMessages.filter((message) => message._id !== updatedMessage._id))
           }
        };

        socket.on('messageWithReaction', handleMessageWithReaction);

        // Cleanup on unmount
        return () => {
            socket.off('messageWithReaction', handleMessageWithReaction);
        };
    }, [socket,messages,setMessages])

}
export default useListenReactions;