import React, {useEffect, useState} from 'react';
import ConversationsLeft from "../components/conversations/ConversationsLeft";
import MessagesCenter from "../components/MessagesCenter/MessagesCenter";
import MessagesRight from "../components/MessageRight/MessagesRight";
import Icons from "../components/profileRight/Icons";
import {useAuthContext} from "../context/useAuthContext";
import {toast} from "react-toastify";
import {useConversationContext} from "../context/useConversationContext";
import TrendCard from "../components/profileRight/TrendCard";
import Notifications from "../components/profileRight/Notifications";
import {useLocation} from "react-router-dom";

function Chat(props) {

    const [openTrend, setOpenTrend] = useState(false);
    const [openNotification, setOpenNotification] = useState(false);
    const { authUser, setAuthUser } = useAuthContext();
    const [isRead, setIsRead] = useState(authUser.isRead);

    const handleChange = async () => {
        setOpenNotification(!openNotification);
        setOpenTrend(false)
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
    const hf = () => {
        setOpenTrend(!openTrend)
        setOpenNotification(false)
    }

    const { selectedConversation, setSelectedConversation } = useConversationContext();

    const location = useLocation()

    useEffect(() => {
        return () => {
            localStorage.removeItem('conversation')
            setOpenTrend(false)
            setOpenNotification(false)
        }
    }, []);

    useEffect(() => {
        setOpenTrend(false)
        setOpenNotification(false)
    }, [location]);

    return (
        <div
            className={'w-full xl:h-screen lg:h-screen md:h-screen sm:h-screen  h-[88vh] bg-[#F2F2F2] flex items-start xl:items-center lg:items-center md:items-center sm:items-center justify-between relative '}
            style={{zIndex: 999}}>
            {openTrend ? <TrendCard isPhoneSize={true}/> : null}
            {openNotification ? <Notifications isPhoneSize={true}/> : null}

            <ConversationsLeft/>
            <MessagesCenter/>
            <MessagesRight/>
            <div className={'w-[6%] h-screen hidden xl:hidden lg:hidden md:flex sm:flex items-center justify-center border-l-[2px]'}>
                <section className={'w-full h-fit'}>
                    <section className={`${selectedConversation ? 'w-[80%]' : 'w-full'}`}>
                        <Icons isPhone={true} handleChange2={hf} isHorizontal={true} handleChange={handleChange}
                               open={openTrend}
                               open2={openNotification} isRead={isRead}
                               isRequired={selectedConversation ? false : true}/>
                    </section>
                </section>
            </div>
            <div
                className={'w-full h-fit flex xl:hidden lg:hidden md:hidden sm:hidden px-3 pt-1 border-t-[2px] items-center justify-center absolute bottom-2 left-0'}>
                <section className={'w-full h-fit flex items-center justify-center'}>
                    <section className={`${selectedConversation ? 'w-[80%] ' : 'w-full '}`}>
                        <Icons isPhone={true} handleChange2={hf} isHorizontal={false} handleChange={handleChange}
                               open={openTrend}
                               open2={openNotification} isRead={isRead}
                               isRequired={selectedConversation ? false : true}/>
                    </section>
                </section>
            </div>
        </div>
    );
}

export default Chat;