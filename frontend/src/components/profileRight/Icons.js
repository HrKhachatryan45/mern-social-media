import React, {useEffect, useState} from 'react';
import {RiHome6Fill} from "react-icons/ri";
import {IoNotificationsOutline, IoSettingsOutline} from "react-icons/io5";
import {BsChatSquareText} from "react-icons/bs";
import {Link} from "react-router-dom";
import {useAuthContext} from "../../context/useAuthContext";
import {MdOutlineInfo} from "react-icons/md";
import useListenNotifications from "../../hooks/useListenNotifications";
import {FaHashtag} from "react-icons/fa6";

function Icons({handleChange,isRead,isPhone,open,isRequired,isHorizontal,open2,handleChange2}) {
    const {authUser} = useAuthContext()
    useListenNotifications()
    const latestNotification = authUser.notifications && authUser.notifications.length > 0
        ?authUser.notifications[authUser.notifications.length - 1]:null
    console.log(authUser.notifications,'notification');

    useEffect(() => {
        if (latestNotification){
            const id =setTimeout(()=>{
                latestNotification.shouldShake = false
            },1000)
            return () => clearTimeout(id)
        }
    }, [latestNotification]);

    const shakeClassName =latestNotification && latestNotification.shouldShake ? 'shake' : ''

    const [endPoint,setEndPoint] =useState('')

    useEffect(() => {

        const baseUrl = new  URL(origin)
        const baseHost =baseUrl.host

        const fullUrl = window.location.href

        const baseUrlString = `${baseUrl.protocol}//${baseHost}`;

        const replacedURL = fullUrl.replace(baseUrlString,'')

        setEndPoint(replacedURL)
    }, []);

    useEffect(() => {
        console.log(endPoint,'currentEndPoint')
    }, [endPoint]);


    return (
        <div className={`w-full h-fit flex ${isHorizontal?'flex-col md:pl-2 sm:pl-1':''} items-center justify-between cursor-pointer `}>
            <Link to={'/'}>
                <RiHome6Fill className={`xl:text-[30px] lg:text-[25px] md:text-[30px] sm:text-[20px]  ${endPoint === '/'?'text-customGreen':'text-gray-400'}  cursor-pointer`}/>
            </Link>
            <Link to={'/profile'}>
                <IoSettingsOutline className={`xl:text-[30px] lg:text-[25px] md:text-[30px] sm:text-[20px] ${isHorizontal? 'mt-3':''}  ${endPoint === '/profile'?'text-customGreen':'text-gray-400'} text-black cursor-pointer`}/>
            </Link>
            { !isPhone  ? (isRequired ? (open ? <div className={'indicator'}>
                        {authUser.notifications && authUser.notifications.length > 0 && isRead === false ?
                            <span
                                className="indicator-item badge border-none bg-[#00B7DE]  absolute top-1 right-2 text-white flex items-center justify-center xl:text-md lg:text-sm md:text-md">{!isRead ?
                                <MdOutlineInfo/> : ''}</span>
                            : null}
                        <IoNotificationsOutline onClick={handleChange}
                                                className={`xl:text-[30px] lg:text-[25px] md:text-[30px] ${isHorizontal ? 'mt-3' : ''} text-gray-400 cursor-pointer ${shakeClassName}`}/>
                    </div> :
                    <FaHashtag onClick={handleChange}
                               className={`xl:text-[30px] lg:text-[25px] md:text-[30px] sm:text-[20px] ${isHorizontal ? 'mt-3' : ''}  cursor-pointer text-gray-400`}/>) : null
            ) : <div className={`flex ${isHorizontal?'flex-col':''}`}>
                <div className={'indicator'}>
                    {authUser.notifications && authUser.notifications.length > 0 && isRead === false ?
                        <span
                            className={`indicator-item badge border-none bg-[#00B7DE]  absolute xl:top-3 lg:top-3 md:top-3 sm:top-3 top-0    ${isHorizontal?'-left-3':'right-1'} text-white sm:!px-[7px] sm:py-[4px] flex items-center justify-center xl:text-md lg:text-sm md:text-md sm:text-sm`}>{!isRead ?
                            <MdOutlineInfo/> : ''}</span>
                        : null}
                    <IoNotificationsOutline onClick={handleChange}
                                            className={`xl:text-[30px] lg:text-[25px] md:text-[30px] sm:text-[20px] ${isHorizontal ? 'mt-3' : ''} ${open2?'text-customGreen':'text-gray-400'} cursor-pointer ${shakeClassName}`}/>
                </div>
                <FaHashtag onClick={handleChange2}
                           className={`xl:text-[30px] lg:text-[25px] md:text-[30px] sm:text-[20px] ${isHorizontal ? 'mt-3' : 'ml-16'} ${open?'text-customGreen':'text-gray-400'}  cursor-pointer `}/>

            </div>

            }





            <Link to={'/chat'}>
                <BsChatSquareText
                    className={`xl:text-[30px] lg:text-[25px] md:text-[30px] sm:text-[20px] ${isHorizontal ? 'mt-3' : ''}  cursor-pointer    ${endPoint === '/chat' ? 'text-customGreen' : 'text-gray-400'}`}/>
            </Link>
        </div>
    );
}

export default Icons;