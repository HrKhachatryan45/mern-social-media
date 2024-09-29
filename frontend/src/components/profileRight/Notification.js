import React from 'react';
import {Link} from "react-router-dom";
import {useAuthContext} from "../../context/useAuthContext";
import useListenNotifications from "../../hooks/useListenNotifications";

function Notification({notification}) {
    const {authUser} =useAuthContext()
    useListenNotifications()
    return (
        <div className={'w-full   h-fit flex items-center justify-between xl:mb-6 lg:mb-6 md:mb-4 sm:mb-2 mb-1'}>
            <section className={'w-5/6  h-fit flex items-center justify-start'}>
                <section className={'flex items-center justify-center'}>
                    {notification.senderId._id && notification.senderId.isDeleted !== true ? <Link
                            to={notification.senderId._id === authUser._id ? '/profile' : `/profile/${notification.senderId._id}`}>
                            <img src={notification.senderId.images.profileImage}
                                 className={'w-8 h-8 xl:w-12 xl:h-12 lg:w-10 lg:h-10 md:w-10 md:h-10 sm:w-8 sm:h-8 rounded-full'}/>
                        </Link> :
                        <img src={ notification.senderId.images.profileImage}
                             className={'w-8 h-8  xl:w-12 xl:h-12 lg:w-10 lg:h-10  md:w-10 md:h-10 sm:w-8 sm:h-8 rounded-full'}/>
                    }
                    <div className={'w-fit h-fit flex flex-col ml-2  items-start justify-center'}>
                        {notification.senderId._id && notification.senderId.isDeleted !== true ? <Link
                                to={notification.senderId._id === authUser._id ? '/profile' : `/profile/${notification.senderId._id}`}>
                                <h4 className={'text-black mb-0  font-bold xl:text-[16px] lg:text-[14px] md:text-[14px] sm:text-[12px] text-[10px]'}>@{notification.senderId.username}</h4>
                            </Link> :
                            <h4 className={'text-black mb-0  font-bold  xl:text-[16px] lg:text-[14px] md:text-[14px] sm:text-[12px] text-[10px]'}>@{notification.senderId.username}</h4>
                        }
                        <h2 className={'text-gray-400  xl:text-[16px] lg:text-[14px] md:text-[14px] sm:text-[12px] text-[8px]'}>{notification.content}</h2>
                    </div>
                </section>
            </section>
            {notification.postId && <section className={'w-fit h-fit'}>
                {notification.postId.photo && !notification.postId.video &&
                    <img className={'xl:w-28 xl:h-12 lg:w-16 lg:h-10 md:w-20 md:h-10 sm:w-16 sm:h-10 w-16 h-10'} src={notification.postId.photo}/>}
                {notification.postId.video && !notification.postId.photo && <video className={'xl:w-28 xl:h-12 lg:w-16 lg:h-10 md:w-20 md:h-10  sm:w-16 sm:h-10 m-16 h-10'}>
                    <source src={notification.postId.video}/>
                </video>}
                {notification.postId.video && notification.postId.photo &&
                    <img className={'xl:w-28 xl:h-12 lg:w-16 lg:h-10 md:w-20 md:h-10  sm:w-16 sm:h-10 w-16 h-10'} src={notification.postId.photo}/>}
            </section>}
        </div>
    );
}

export default Notification;