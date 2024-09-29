import {createContext, useContext, useState} from "react";


export  const  PostContext = createContext();

export  const usePostContext = () => {
    return useContext(PostContext);
}

export const PostContextProvider = ({ children }) => {
    const [allPosts,setAllPosts] = useState([]);

    console.log('All Posts',allPosts)
    return <PostContext.Provider value={{allPosts,setAllPosts}}>{children}</PostContext.Provider>
}


