import React, {useEffect, useState} from 'react';
import Icons from "./Icons";
import TrendCard from "./TrendCard";
import ShareButton from "./ShareButton";
import Notifications from "./Notifications";
import {useAuthContext} from "../../context/useAuthContext";
import {toast} from "react-toastify";

function ProfileRight(props) {
    const [open,setOpen] = useState(true);
    const {authUser,setAuthUser} = useAuthContext()
    const [isRead,setIsRead] = useState(authUser.isRead)

    const handleChange =async () => {
        setOpen(!open)
        try {
            const response = await fetch('/api/profile/isRead',{
                method:"PATCH",
                headers:{'Content-Type':'application/json'},
            })
            const json = await response.json()
            setAuthUser({
                ...json,
                isRead:json.isRead,
            })
            console.log(json,'newUpdatedUser')
            setIsRead(json.isRead)
            localStorage.setItem('user',JSON.stringify(json))
        }catch (error) {
            toast.error(error.message)
            console.log('error', error)
        }

        // setIsRead(true)
    }

    useEffect(() => {
        if (authUser && authUser.isRead !== undefined) {
            setIsRead(authUser.isRead);
        }
    }, [authUser]);

    useEffect(() => {
        console.log(isRead,'show')
    }, [isRead,setAuthUser]);

    return (
        <div className={'w-[28%] h-full px-3 pt-5 relative xl:block lg:block md:hidden sm:hidden hidden'}>
            <Icons isPhone={false} isHorizontal={false} handleChange={handleChange} isRequired={true} open={open} isRead={isRead}/>
            {open ? <TrendCard/>:<Notifications/>}
            <ShareButton/>
        </div>
    );
}

export default ProfileRight;