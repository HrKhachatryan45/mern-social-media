import React, {useEffect, useState} from 'react';
import ProfileRight from "../components/profileRight/ProfileRight";
import ProfileSideSettings from "../components/profileSideForSettings/profileSideSettings";
import MyPostCenter from "../components/posts/MyPostCenter";
import TrendCard from "../components/profileRight/TrendCard";
import Notifications from "../components/profileRight/Notifications";
import Icons from "../components/profileRight/Icons";
import {useAuthContext} from "../context/useAuthContext";
import {toast} from "react-toastify";
import {useConversationContext} from "../context/useConversationContext";
import {useLocation} from "react-router-dom";

function ProfileSettings(props) {
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
        <div className={'w-full h-screen bg-[#F2F2F2] flex items-center justify-between '}>
            {openTrend ? <TrendCard isPhoneSize={true}/> : null}
            {openNotification ? <Notifications isPhoneSize={true}/> : null}
            <ProfileSideSettings/>
            <MyPostCenter/>
            <ProfileRight/>
            <div className={'w-[6%] h-screen hidden xl:hidden lg:hidden md:flex sm:flex items-center justify-center'}>
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
                className={'bg-white w-full h-fit flex xl:hidden lg:hidden md:hidden sm:hidden px-3 pt-1 pb-1  items-center justify-center absolute bottom-0 left-0'}>
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

export default ProfileSettings;