import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {useConversationContext} from "../context/useConversationContext";
import {useSocketContext} from "../context/useSocketContext";

const useGetUsersForSidebar = () =>{
    const [users, setUsers] =useState([])
    const [latestMessages, setLatestMessages] = useState({});
    const [loading, setLoading] = useState(false)
    const {messages} = useConversationContext()
    const {socket} = useSocketContext()
        const getUsersForSidebar = async () =>{
            setLoading(true)
            try {
                const response = await fetch('/api/messages/getAllUsers')

                const json = await response.json()

                setUsers(json)

                const messages = {};
                const promises = json.map(async (user) => {
                    const response = await fetch(`/api/messages/userMessages/${user._id}`);
                    const json = await response.json();
                    messages[user._id] = json;
                });
                await Promise.all(promises);
                setLatestMessages(messages);
            }catch (error) {
                toast.error(error.message)
                console.log('error',error)
            }finally {
                setLoading(false)
            }
        }

    useEffect(() => {
        if (!socket) return;

        getUsersForSidebar()
    }, [messages.length,socket]);
    useEffect(() => {
        if (!socket) return;
        socket.on('getUsersForSidebar',getUsersForSidebar)
    }, [socket]);
    return {users,latestMessages,loading,getUsersForSidebar}
}
export default useGetUsersForSidebar;