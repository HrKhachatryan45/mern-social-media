import React, {useEffect, useState} from 'react';
import SearchInput from "../profileSide/SearchInput";
import useListenFollowings from "../../hooks/useListenFollowings";
import useListenProfile from "../../hooks/useListenProfile";
import AnotherProfielnfo from "./AnotherProfielnfo";
import {useNavigate} from "react-router-dom";
import useRemoveFollower from "../../hooks/useRemoveFollower";
import useAddFollower from "../../hooks/useAddFollower";
import {useAuthContext} from "../../context/useAuthContext";
import {useConversationContext} from "../../context/useConversationContext";
function AnotherProfileSideSettings({authUser2}) {
    useListenFollowings()

    const {authUser} = useAuthContext()
    useListenProfile()
    const navigate = useNavigate()
    const {setSelectedConversation} = useConversationContext()

    const {removeFollower} = useRemoveFollower()
    const {addFollower} = useAddFollower()
    const handleFollow = async  (followerId) =>{
        await addFollower(followerId)
    }
    const handleUnFollow = async  (followerId) =>{
        await removeFollower(followerId)
    }

    const handleChat = () => {
        setSelectedConversation(authUser2)
        // localStorage.setItem('conversation', JSON.stringify(authUser2))
        navigate('/chat',{state:authUser2})

    }



    return (
        <div className={'xl:w-[22%] lg:w-[26%] md:w-[30%] sm:w-[34%] w-[40%] h-full    xl:px-3 lg:px-3 md:px-3 sm:px-1 px-[5px] py-2 flex flex-col items-center justify-start overflow-auto'}>
            <SearchInput/>

            <div className={'w-full h-[92%]  '}>
                <AnotherProfielnfo authUser2={authUser2}/>
                <div className={'w-full h-fit bg-white mt-3 rounded-lg px-2 py-3'}>
                    <section className={'w-full h-fit  flex items-center justify-between'}>
                            <button
                                onClick={() => authUser.arrays.followings.includes(authUser2._id) ? handleUnFollow(authUser2._id) : handleFollow(authUser2._id)}
                                className={` flex items-center justify-center xl:h-10 lg:h-9 md:h-8 sm:h-7 h-7 xl:text-[15px] lg:text-[13px] md:text-[11px] sm:text-[9px] text-[8px] w-[48%] rounded-lg  
                                                ${authUser.arrays.followings.includes(authUser2._id) ? 'bg-transparent hover:text-white hover:border-none hover:bg-gradient-to-r from-[rgba(0,234,151,1)] to-[rgba(0,167,243,1)] text-customGreen border-2 border-customGreen' : 'text-white border-none bg-gradient-to-r from-[rgba(0,234,151,1)] to-[rgba(0,167,243,1)]'}
                                                `}>
                                {authUser.arrays.followings.includes(authUser2._id) ? "Unfollow" : "Follow"}
                            </button>
                        <button onClick={handleChat} className={'  flex items-center justify-center  xl:h-10 lg:h-9 md:h-8 sm:h-7 h-7 xl:text-[15px] lg:text-[13px] md:text-[11px] sm:text-[9px] text-[8px]  w-[48%] rounded-lg   text-white border-none bg-gradient-to-r from-[rgba(0,234,151,1)] to-[rgba(0,167,243,1)]'}>Send Message</button>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default AnotherProfileSideSettings;