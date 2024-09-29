import React, { useEffect, useState } from 'react';
import Icons from "../profileRight/Icons";
import { useAuthContext } from "../../context/useAuthContext";
import { toast } from "react-toastify";
import { useConversationContext } from "../../context/useConversationContext";
import TrendCard from "../profileRight/TrendCard";
import Notifications from "../profileRight/Notifications";
import { MdLocationPin } from "react-icons/md";
import { useSocketContext } from "../../context/useSocketContext";
import { usePostContext } from "../../context/usePostContext";

function MessagesRight(props) {
    const [open, setOpen] = useState(true);
    const { authUser, setAuthUser } = useAuthContext();
    const [isRead, setIsRead] = useState(authUser.isRead);

    const handleChange = async () => {
        setOpen(!open);
        try {
            const response = await fetch('/api/profile/isRead', {
                method: "PATCH",
                headers: { 'Content-Type': 'application/json' },
            });
            const json = await response.json();
            setAuthUser({
                ...json,
                isRead: json.isRead,
            });
            console.log(json, 'newUpdatedUser');
            setIsRead(json.isRead);
            localStorage.setItem('user', JSON.stringify(json));
        } catch (error) {
            toast.error(error.message);
            console.log('error', error);
        }
    };

    const { selectedConversation, setSelectedConversation } = useConversationContext();

    useEffect(() => {
        if (authUser && authUser.isRead !== undefined) {
            setIsRead(authUser.isRead);
        }
    }, [authUser]);

    useEffect(() => {
        return () => {
            setSelectedConversation(null);
        };
    }, []);

    const { onlineUsers } = useSocketContext();
    const { allPosts } = usePostContext();

    const chatmatePosts = selectedConversation ? allPosts.filter((post) => post.userId._id === selectedConversation._id && post.hasOwnProperty('photo')):[];

    useEffect(() => {
        console.log(chatmatePosts);
        console.log(allPosts, 'posts');
    }, [chatmatePosts]);

    return (
        <div className={'w-[26%] border-2 h-full px-3 pt-5 relative xl:flex lg:flex md:hidden sm:hidden hidden flex-col items-center justify-start  '}>
            <section className={`${selectedConversation ? 'w-[80%]' : 'w-full'}`}>
                <Icons isPhone={false} isHorizontal={false} handleChange={handleChange} open={open} isRead={isRead} isRequired={selectedConversation ? false : true} />
            </section>
            {!selectedConversation ? (open ? <TrendCard /> : <Notifications />) : null}

            {selectedConversation ? (
                <div className={'w-full h-[94%] overflow-auto'}>
                    <div
                        className={'w-full h-fit  flex flex-col items-center justify-start xl:px-2 lg:px-0  '}>
                        <section style={{background: `url(${selectedConversation.images.profileImage === 'https://cdn-icons-png.freepik.com/256/3177/3177440.png?semt=ais_hybrid' ?'https://i1.sndcdn.com/avatars-000250434034-mk5uf1-t240x240.jpg' :selectedConversation.images.profileImage})`}}
                                 className={'w-[80%] flex flex-col items-center pb-3 justify-end sd rounded-xl xl:h-64 lg:h-52 mt-5'}>
                            <h2 className={'xl:text-xl lg:text-lg text-customGreen'}>{selectedConversation.fullName}</h2>
                            {selectedConversation.info.location &&
                                <h4 className={'text-white xl:text-md lg:text-sm flex items-center mt-2'}><MdLocationPin
                                    className={'xl:text-md lg:text-sm text-customGreen'}/> {selectedConversation.info.location}</h4>}
                        </section>
                        {onlineUsers.includes(selectedConversation._id) ?
                            <p className={'w-fit h-fit flex items-center justify-center text-md text-black mt-2'}>Online <span
                                className={`ml-2 xl:w-3.5 xl:h-3.5 lg:w-3 lg:h-3  bg-customGreen  rounded-full`}></span>
                            </p> :
                            <p className={'w-fit h-fit flex items-center justify-center text-md text-black mt-2'}>offline <span
                                className={`ml-2 xl:w-3.5 xl:h-3.5 lg:w-3 lg:h-3 bg-gray-400  rounded-full`}></span>
                            </p>}
                        {selectedConversation.info.bio &&
                            <p className={'text-md text-black text-center'}>{selectedConversation.info.bio}</p>}

                        {chatmatePosts.length > 0 ? <div
                            className={'mb-3 w-full h-fit py-2 flex items-center justify-start pl-2 border-b-2 border-black'}>
                            <p className={'text-black xl:text-lg lg:text-md'}>Media</p>
                        </div> : null}
                        {chatmatePosts && chatmatePosts.length === 1 && (
                            <img src={chatmatePosts[0].photo} className={'w-full xl:h-40 lg:h-40 '}/>
                        )}
                        {chatmatePosts && chatmatePosts.length === 2 && (
                            <div className={'w-full h-fit flex items-center justify-between'}>
                                <img src={chatmatePosts[0].photo} className={'w-[48%] xl:h-36 lg:h-28 '}/>
                                <img src={chatmatePosts[1].photo} className={'w-[48%] xl:h-36 lg:h-28 '}/>
                            </div>
                        )}
                        {chatmatePosts && chatmatePosts.length > 2 &&
                            <div className="w-full h-fit flex items-center justify-between">
                                <section className="w-[48%] h-52 flex flex-col justify-between items-center">
                                    <img src={chatmatePosts[0].photo} className="w-full h-[48%]"/>
                                    <img src={chatmatePosts[1].photo} className="w-full h-[48%] mt-2"/>
                                </section>
                                <img src={chatmatePosts[2].photo} className="w-[48%] h-52"/>
                            </div>
                        }
                    </div>
                </div>
            ) : null}
        </div>
    );
}

export default MessagesRight;
