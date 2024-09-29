import React, {useEffect, useState} from 'react';
import useGetUsersForSidebar from "../../hooks/useGetUsersForSidebar";
import {useConversationContext} from "../../context/useConversationContext";
import SearchInput from "./SearchInput";
import {useSocketContext} from "../../context/useSocketContext";
import {useAuthContext} from "../../context/useAuthContext";
import {useLocation} from "react-router-dom";

function ConversationsLeft(props) {
    const location = useLocation()
    const receivedConversation = location.state
    const  {users,loading,latestMessages} = useGetUsersForSidebar()
    const {setSelectedConversation,selectedConversation} = useConversationContext()

    useEffect(() => {
        if (receivedConversation) {
            setSelectedConversation(receivedConversation);
            localStorage.setItem('conversation', JSON.stringify(receivedConversation));
            window.history.replaceState({}, document.title, location.pathname);
        }
    }, [receivedConversation, location, setSelectedConversation]);

    const handleSelect = (conversation) => {
        setSelectedConversation(conversation)
        localStorage.setItem('conversation', JSON.stringify(conversation))
    }
    const [userValue,setUserValue] = useState('');

    const {onlineUsers} = useSocketContext()
    const [filteredUsers,setFilteredUsers] = useState([])




    useEffect(() => {
       if (userValue !== ''){
           setFilteredUsers(
               users.filter((user)=>
                   user.fullName.toLowerCase().includes(userValue.toLowerCase())
               )
           )
       }else{
           setFilteredUsers(users)
       }
    }, [userValue,users]);

    const {authUser} = useAuthContext()
    const handleChange = (value) => {
        setUserValue(value)
    }


    const extractTime = (time) => {
        const now = new Date();
        const diffMs = now - new Date(time); // difference in milliseconds
        console.log(diffMs,'time')
        const diffMins = Math.floor(diffMs / (1000 * 60)); // difference in minutes
        console.log(diffMins,'mins')
        if (diffMins < 1) return 'now';
        if (diffMins < 60) return `${diffMins}ms`;

        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours}hs`;

        const diffDays = Math.floor(diffHours / 24);
        if (diffDays < 30)  return `${diffDays}ds`;

        const diffMonths = Math.floor(diffDays / 30);
        if (diffMonths < 12) return `${diffMonths}mns`;

        const diffYears = Math.floor(diffMonths / 12);
        return `${diffYears}ys `;
    };


    return (
        <div className={'w-[38%] xl:w-[24%] lg:w-[24%] md:w-[32%] sm:w-[32%] h-[95%]   xl:h-full lg:h-full md:h-full sm:h-full border-2 border-b-0  xl:px-3 lg:px-3 md:px-3 sm:px-3 px-1 py-2 flex flex-col items-center justify-start overflow-auto'}>
            <SearchInput userValue={userValue } isBorder={false} onInputChange={handleChange}/>
            {loading ?<span className={'loading loading-spinner'}></span>:filteredUsers.map((user) => {
                const userMessages = latestMessages[user._id];
                const isOnline = onlineUsers.includes(user._id)
                    const latestMessage = userMessages ? userMessages[userMessages.length - 1] : null;
                return (
                    <div onClick={() => handleSelect(user)}
                         className={`cursor-pointer xl:px-3 lg:px-3 md:px-3 sm:px-3 px-[4px] pt-2 ${selectedConversation && selectedConversation._id === user._id ? ' bg-gradient-to-r from-[rgba(0,234,151,1)] to-[rgba(0,167,243,1)] border-none text-white  rounded-lg text-[15px]' : 'bg-white'} rounded-lg xl:mb-3 md:mb-3 lg:mb-3 sm:mb-3 mb-2 w-full h-fit flex flex-col items-start justify-center `}
                         key={user._id}>
                        <section className={'w-full h-full flex items-center justify-between'}>
                           <div className={'w-fit h-full  max-w-[95%] flex items-center justify-start'}>
                               <div className="relative">
                                   <img className={'w-8 h-8 xl:w-12 xl:h-12 lg:w-10 lg:h-10 md:w-10 md:h-10 sm:w-8 sm:h-8 rounded-full'} src={user.images.profileImage}/>
                               </div>
                               <h2 className={` ml-2 text-[10px] xl:text-lg lg:text-md md:text-sm sm:text-[12px]  font-bold ${selectedConversation && selectedConversation._id === user._id ? 'text-white' : 'text-black'}`}>{user.fullName.length > 17 ?user.fullName.slice(0,15)+'...':user.fullName}</h2>
                               {selectedConversation && selectedConversation._id === user._id ? null :
                                   <span
                                       className={`xl:ml-2 lg:ml-2 md:ml-2 sm:ml-1 xl:w-3.5 xl:h-3.5 lg:w-3 lg:h-3 md:h-2.5 md:w-2.5 sm:w-2 sm:h-2 ${isOnline ? 'bg-customGreen' : 'bg-gray-400'}  rounded-full`}></span>
                               }
                           </div>
                            <div className={'w-fit  max-w-fit  h-fit flex items-center justify-end'}>
                                <p className={`xl:text-md text-[10px] lg:text-md md:text-sm sm:text-[12px] ${selectedConversation && selectedConversation._id === user._id ? 'text-white' : 'text-black'}`}>{extractTime(user.lastActivity)}</p>
                            </div>
                        </section>

                        {latestMessage ? (
                                <>
                                    {latestMessage.videos.some(video => video.hasOwnProperty('url')) && !latestMessage.message.content && !latestMessage.photos.some(photo => photo.hasOwnProperty('url')) && !latestMessage.audio.hasOwnProperty('url') && (
                                        <p className={`m-0 my-2 text-[10px] xl:text-md lg:text-sm md:text-sm sm:text-[12px] ${selectedConversation && selectedConversation._id === user._id ? 'text-white' : 'text-gray-400'}`}>
                                            {!latestMessage || latestMessage.senderId.toString() !== authUser._id.toString() ? null : 'Me: '} Video
                                        </p>
                                    )}
                                    {latestMessage.photos.some(photo => photo.hasOwnProperty('url')) && !latestMessage.message.content && !latestMessage.videos.some(video => video.hasOwnProperty('url')) && !latestMessage.audio.hasOwnProperty('url') && (
                                        <p className={`m-0 my-2 text-[10px] xl:text-md lg:text-sm md:text-sm sm:text-[12px] ${selectedConversation && selectedConversation._id === user._id ? 'text-white' : 'text-gray-400'}`}>
                                            {!latestMessage || latestMessage.senderId.toString() !== authUser._id.toString() ? null : 'Me: '} Photo
                                        </p>
                                    )}
                                    {latestMessage.audio.hasOwnProperty('url') && !latestMessage.message.content && !latestMessage.videos.some(video => video.hasOwnProperty('url')) && !latestMessage.photos.some(photo => photo.hasOwnProperty('url')) && (
                                        <p className={`m-0 my-2 text-[10px] xl:text-md lg:text-sm md:text-sm sm:text-[12px] ${selectedConversation && selectedConversation._id === user._id ? 'text-white' : 'text-gray-400'}`}>
                                            {!latestMessage || latestMessage.senderId.toString() !== authUser._id.toString() ? null : 'Me: '} Audio
                                        </p>
                                    )}
                                    {latestMessage.message.content && (latestMessage.message.content || latestMessage.photos.some(photo => photo.hasOwnProperty('url')) || latestMessage.videos.some(video => video.hasOwnProperty('url')) || latestMessage.audio.hasOwnProperty('url')) && (
                                            <p className={`m-0 my-2 text-[10px] xl:text-md lg:text-sm md:text-sm sm:text-[12px] ${selectedConversation && selectedConversation._id === user._id ? 'text-white' : 'text-gray-400'}`}>
                                                {!latestMessage || latestMessage.senderId.toString() !== authUser._id.toString() ? null : 'Me: '}
                                                {latestMessage.message.content ? (latestMessage.message.content && latestMessage.message.content.length < (latestMessage.senderId.toString() !== authUser._id.toString() ? 34 : 30) ? latestMessage.message.content : latestMessage.message.content && latestMessage.message.content.slice(0, 30) + '...') : 'No messages yet'}
                                            </p>
                                        ) }
                                    {latestMessage.photos.some(photo => photo.hasOwnProperty('url')) && !latestMessage.message.content && latestMessage.videos.some(video => video.hasOwnProperty('url')) && !latestMessage.audio.hasOwnProperty('url') && (
                                        <p className={`m-0 my-2 text-[10px] xl:text-md lg:text-sm md:text-sm sm:text-[12px] ${selectedConversation && selectedConversation._id === user._id ? 'text-white' : 'text-gray-400'}`}>
                                            {!latestMessage || latestMessage.senderId.toString() !== authUser._id.toString() ? null : 'Me: '} Media
                                        </p>
                                    )}
                                </>
                            ) :
                            <p className={`m-0 my-2 text-[10px] xl:text-md lg:text-sm md:text-sm sm:text-[12px] ${selectedConversation && selectedConversation._id === user._id ? 'text-white' : 'text-gray-400'}`}>
                                No messages yet
                            </p>
                        }

                    </div>
                )
            })
            }
            {filteredUsers.length === 0 && <h3 className={' text-[10px] xl:text-lg lg:text-md md:text-md sm:text-sm text-black'}>No Users Found !</h3>}

        </div>
    );
}

export default ConversationsLeft;