import {useAuthContext} from "../../context/useAuthContext";
import {getFullTime} from "../../utils/getFullTime";

function EachComment({message}) {
    const {authUser} = useAuthContext()
    const isFromMe = authUser._id === message.senderId._id
    return (
        <div
            className={`  w-full h-fit mb-4  px-2 flex items-center justify-start ${isFromMe?'flex-row-reverse':'flex-row'}  `}>
            <div className={`w-10 rounded-full ${isFromMe?'ml-4':'mr-4'}`}>
                <img alt="Tailwind CSS chat bubble component" className={'rounded-full'}
                     src={message.senderId.images.profileImage}/>
            </div>
            <div className={`w-fit flex  justify-start flex-col ${isFromMe?'items-end':'items-start'}`}>
                <div className={`flex items-center ${isFromMe?'flex-row-reverse':'flex-row'} `}>
                    <h2 className={`text-black font-bold m-0 ${isFromMe?'ml-3 ':'mr-3'}`}>{message.senderId.fullName}</h2>
                    <h4 className={'text-sm m-0'}>{getFullTime(message.createdAt)}</h4>
                </div>
                <div className={` xl:text-md lg:text-md md:text-sm sm:text-sm text-[10px] font-customTwo flex items-center  `}>{message.commentMessage}</div>

            </div>
        </div>
    );
}

export default EachComment;