import React from 'react';
import {useAuthContext} from "../../context/useAuthContext";
import Notification from "./Notification";
import useListenNotifications from "../../hooks/useListenNotifications";
import useClearAllNotifications from "../../hooks/useClearAllNotifications";

function Notifications({isPhoneSize}) {
    const {authUser} = useAuthContext()
    // useListenFollowings()
    useListenNotifications()
    const {clearAllNotifications,loading} = useClearAllNotifications()
    const handleClear = async () => {
        await clearAllNotifications()
    }

    return (
        <div
            className={`${isPhoneSize?'md:w-[40%] md:h-[80%] sm:h-[80%] h-[80%] w-[55%] sm:w-[40%] absolute md:absolute sm:absolute md:right-12 sm:right-12 right-2   ':''} xl:w-full lg:w-full  xl:h-fit lg:h-fit  xl:max-h-[80%] lg:max-h-[80%]   bg-[#FAFAFA] rounded-xl ${authUser.notifications.length > 0 ?'px-6 pt-6 pb-3':'px-6 pt-3 pb-3'} flex mt-6  flex-col items-start justify-start overflow-auto  xl:static lg:static  z-[9999]`}>
            {authUser.notifications.length > 0 ?
                <div className={'w-full h-fit flex flex-col items-start justify-center'}>
                    <section className={'w-full h-fit flex items-center justify-between mb-5'}>
                        <h2 className={'xl:text-xl lg:text-lg md:text-md sm:text-sm text-sm  text-black  font-customOne'}>Notifications</h2>
                        <span className={'text-customGreen xl:text-md lg:text-sm md:text-sm sm:text-sm text-sm font-customOne cursor-pointer '} onClick={handleClear}>clear all</span>
                    </section>
                    {
                        !authUser.notifications || loading ? <span
                            className={'loading loading-spinner'}></span> : authUser.notifications.map((notification, index) => (
                            notification.senderId ? <Notification key={index} notification={notification}/> :
                                <Notification key={index} notification={{
                                    ...notification,
                                    senderId: {
                                        username: 'unknown',
                                        images: {
                                            profileImage: "https://cdn-icons-png.flaticon.com/256/4412/4412025.png"
                                        }
                                    }
                                }}/>
                        ))
                    }
                </div> :
                <div className={'w-full h-fit flex flex-col items-start justify-center'}>
                    <h2 className={' xl:text-xl lg:text-lg md:text-md sm:text-sm text-sm text-black font-customOne'}>No Notifications for you</h2>
                </div>
            }
        </div>
    );
}

export default Notifications;