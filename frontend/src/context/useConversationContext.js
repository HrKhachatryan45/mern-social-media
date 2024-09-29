import {createContext, useContext, useEffect, useState} from "react";


export  const ConversationContext = createContext();

export const useConversationContext = () => {
    return useContext(ConversationContext);
}

export const ConversationContextProvider = ({children}) => {
    const [selectedConversation, setSelectedConversation] = useState(JSON.parse(localStorage.getItem("conversation")) || null);
    const [messages,setMessages] = useState([])
    console.log(selectedConversation,'selected conversation')
        console.log('all messages',messages)
    return <ConversationContext.Provider value={{selectedConversation,setSelectedConversation,messages,setMessages}}>{children}</ConversationContext.Provider>
}
