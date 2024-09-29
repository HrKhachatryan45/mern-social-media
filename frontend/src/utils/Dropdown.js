import React, {useEffect, useState} from 'react';
import {MdContentCopy} from "react-icons/md";
import {LiaSave} from "react-icons/lia";
import {RiDeleteBin6Line} from "react-icons/ri";
import {IoIosCheckboxOutline} from "react-icons/io";
import {FaRegShareFromSquare} from "react-icons/fa6";
import useAddReaction from "../hooks/useAddReaction";
import {useAuthContext} from "../context/useAuthContext";
import {saveAs} from 'file-saver'
import useDeleteMessage from "../hooks/useDeleteMessage";
import ShareBarComponent from "./ShareBarComponent";
function Dropdown({isFromMe,indexOfMessage,sizeType,messageId,audio,index,reactions,text,setIsOpen,photo,video,file,setOpenSelectBar,selectedMessages,senderId,setSelectedMessages,selectedMessagesShare,setSelectedMessagesShare}) {

    const {addReaction} = useAddReaction()

    const handleAddReaction =async (reaction) => {
            await addReaction(reaction,messageId,sizeType,index)
    }
    const {authUser} = useAuthContext()

    console.log(reactions,'reactions')
    console.log(authUser._id,'userID')
    console.log(sizeType,'ty')

    const isReactionActive = (reactionType) => {
        return reactions.some(reaction => reaction.senderId._id === authUser._id && reaction.reaction === reactionType)
    }

    const handleCopy = () => {
        setTimeout(() => {
           if (sizeType === 'message'){
               setIsOpen((prevIsOpen) => ({
                   ...prevIsOpen,
                   videos:prevIsOpen.videos.map((item)=>{
                       return {...item,isOpen:false}
                   }),
                   photos:prevIsOpen.photos.map((item)=>{
                       return {...item,isOpen:false}
                   }),
                   audio:false,
                   message: !prevIsOpen.message
               }))
           }else if (sizeType === 'audio'){
               setIsOpen((prevIsOpen) => ({
                   ...prevIsOpen,
                   message:false,
                   videos:prevIsOpen.videos.map((item)=>{
                       return {...item,isOpen:false}
                   }),
                   photos:prevIsOpen.photos.map((item)=>{
                       return {...item,isOpen:false}
                   }),
                   audio: !prevIsOpen.audio
               }))
           }else if (sizeType === 'videos'){
               setIsOpen((prevIsOpen) => ({
                   ...prevIsOpen,
                   message:false,
                   audio:false,
                   photos:prevIsOpen.photos.map((item)=>{
                       return {...item,isOpen:false}
                   }),
                   videos: prevIsOpen.videos.map((item) => {
                       if (item.url === video.url) {
                           return {...item, isOpen: !item.isOpen}
                       }
                       return item;
                   })
               }))
           }else if (sizeType === 'photos'){
               setIsOpen((prevIsOpen) => ({
                   ...prevIsOpen,
                   message:false,
                   audio:false,
                   videos:prevIsOpen.videos.map((item)=>{
                       return {...item,isOpen:false}
                   }),
                   photos: prevIsOpen.photos.map((item) => {
                       if (item.url === photo.url) {
                           return {...item, isOpen: !item.isOpen}
                       }
                       return item;
                   })
               }))
           }
        },700)
            // if (text !== null){
            //     navigator.clipboard.writeText(text)
            // }
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).catch(err => {
                console.error('Could not copy text: ', err);
            });
        } else {
            // Fallback for older iOS versions or browsers
            console.warn('Clipboard API not supported');
        }


    }
    const handleSaveFile = () => {
        if (file !== null){
            const fileName = file.substring(file.lastIndexOf('/') + 1);

            if (sizeType === 'audio'){
                saveAs(file,fileName+'.mp3')
            }else{
                saveAs(file,fileName)

            }
            setTimeout(() => {
                if (sizeType === 'message'){
                    setIsOpen((prevIsOpen) => ({
                        ...prevIsOpen,
                        videos:prevIsOpen.videos.map((item)=>{
                            return {...item,isOpen:false}
                        }),
                        photos:prevIsOpen.photos.map((item)=>{
                            return {...item,isOpen:false}
                        }),
                        audio:false,
                        message: !prevIsOpen.message
                    }))
                }else if (sizeType === 'audio'){
                    setIsOpen((prevIsOpen) => ({
                        ...prevIsOpen,
                        message:false,
                        videos:prevIsOpen.videos.map((item)=>{
                            return {...item,isOpen:false}
                        }),
                        photos:prevIsOpen.photos.map((item)=>{
                            return {...item,isOpen:false}
                        }),
                        audio: !prevIsOpen.audio
                    }))
                }else if (sizeType === 'videos'){
                    setIsOpen((prevIsOpen) => ({
                        ...prevIsOpen,
                        message:false,
                        audio:false,
                        photos:prevIsOpen.photos.map((item)=>{
                            return {...item,isOpen:false}
                        }),
                        videos: prevIsOpen.videos.map((item) => {
                            if (item.url === video.url) {
                                return {...item, isOpen: !item.isOpen}
                            }
                            return item;
                        })
                    }))
                }else if (sizeType === 'photos'){
                    setIsOpen((prevIsOpen) => ({
                        ...prevIsOpen,
                        message:false,
                        audio:false,
                        videos:prevIsOpen.videos.map((item)=>{
                            return {...item,isOpen:false}
                        }),
                        photos: prevIsOpen.photos.map((item) => {
                            if (item.url === photo.url) {
                                return {...item, isOpen: !item.isOpen}
                            }
                            return item;
                        })
                    }))
                }
            },700)
        }
    }

    const handleSelect = () => {
       if (authUser._id ===senderId){
           setOpenSelectBar(true)

           switch (sizeType) {
               case 'message':
                   const updatedMessages1 = [...selectedMessages, {
                       type: sizeType,
                       messageId,
                   }];
                   setSelectedMessages(updatedMessages1);

                   const updatedShareMessages1 = [...selectedMessagesShare,{message:text,messageId}]
                   setSelectedMessagesShare(updatedShareMessages1)
                   break;
               case 'audio':
                   const updatedMessages2 = [...selectedMessages, {
                       type: sizeType,
                       messageId,
                   }];
                   setSelectedMessages(updatedMessages2);

                   const updatedShareMessages2 = [...selectedMessagesShare,{audio:audio.url,messageId}]
                   setSelectedMessagesShare(updatedShareMessages2)

                   break;
               case 'videos':
                   const updatedMessages3 = [...selectedMessages, {
                       type: sizeType,
                       messageId,
                       index
                   }];
                   setSelectedMessages(updatedMessages3);
                   const updatedShareMessages3 = [...selectedMessagesShare,{video:video.url,messageId,index}]
                   setSelectedMessagesShare(updatedShareMessages3)
                   break ;
               case 'photos':
                   const updatedMessages4 = [...selectedMessages, {
                       type: sizeType,
                       messageId,
                       index
                   }];
                   setSelectedMessages(updatedMessages4);
                   const updatedShareMessages4 = [...selectedMessagesShare,{photo:photo.url,messageId,index}]
                   setSelectedMessagesShare(updatedShareMessages4)



                   break;
           }
       }
            if (sizeType === 'message'){
                setIsOpen((prevIsOpen) => ({
                    ...prevIsOpen,
                    videos:prevIsOpen.videos.map((item)=>{
                        return {...item,isOpen:false}
                    }),
                    photos:prevIsOpen.photos.map((item)=>{
                        return {...item,isOpen:false}
                    }),
                    audio:false,
                    message: !prevIsOpen.message
                }))
            }else if (sizeType === 'audio'){
                setIsOpen((prevIsOpen) => ({
                    ...prevIsOpen,
                    message:false,
                    videos:prevIsOpen.videos.map((item)=>{
                        return {...item,isOpen:false}
                    }),
                    photos:prevIsOpen.photos.map((item)=>{
                        return {...item,isOpen:false}
                    }),
                    audio: !prevIsOpen.audio
                }))
            }else if (sizeType === 'videos'){
                setIsOpen((prevIsOpen) => ({
                    ...prevIsOpen,
                    message:false,
                    audio:false,
                    photos:prevIsOpen.photos.map((item)=>{
                        return {...item,isOpen:false}
                    }),
                    videos: prevIsOpen.videos.map((item) => {
                        if (item.url === video.url) {
                            return {...item, isOpen: !item.isOpen}
                        }
                        return item;
                    })
                }))
            }else if (sizeType === 'photos'){
                setIsOpen((prevIsOpen) => ({
                    ...prevIsOpen,
                    message:false,
                    audio:false,
                    videos:prevIsOpen.videos.map((item)=>{
                        return {...item,isOpen:false}
                    }),
                    photos: prevIsOpen.photos.map((item) => {
                        if (item.url === photo.url) {
                            return {...item, isOpen: !item.isOpen}
                        }
                        return item;
                    })
                }))
            }

    }

    const {deleteMessage} = useDeleteMessage()

    const handleDelete = async () => {
        await deleteMessage(messageId,sizeType,index)
        setTimeout(() => {
            if (sizeType === 'message'){
                setIsOpen((prevIsOpen) => ({
                    ...prevIsOpen,
                    videos:prevIsOpen.videos.map((item)=>{
                        return {...item,isOpen:false}
                    }),
                    photos:prevIsOpen.photos.map((item)=>{
                        return {...item,isOpen:false}
                    }),
                    audio:false,
                    message: !prevIsOpen.message
                }))
            }else if (sizeType === 'audio'){
                setIsOpen((prevIsOpen) => ({
                    ...prevIsOpen,
                    message:false,
                    videos:prevIsOpen.videos.map((item)=>{
                        return {...item,isOpen:false}
                    }),
                    photos:prevIsOpen.photos.map((item)=>{
                        return {...item,isOpen:false}
                    }),
                    audio: !prevIsOpen.audio
                }))
            }else if (sizeType === 'videos'){
                setIsOpen((prevIsOpen) => ({
                    ...prevIsOpen,
                    message:false,
                    audio:false,
                    photos:prevIsOpen.photos.map((item)=>{
                        return {...item,isOpen:false}
                    }),
                    videos: prevIsOpen.videos.map((item) => {
                        if (item.url === video.url) {
                            return {...item, isOpen: !item.isOpen}
                        }
                        return item;
                    })
                }))
            }else if (sizeType === 'photos'){
                setIsOpen((prevIsOpen) => ({
                    ...prevIsOpen,
                    message:false,
                    audio:false,
                    videos:prevIsOpen.videos.map((item)=>{
                        return {...item,isOpen:false}
                    }),
                    photos: prevIsOpen.photos.map((item) => {
                        if (item.url === photo.url) {
                            return {...item, isOpen: !item.isOpen}
                        }
                        return item;
                    })
                }))
            }
        },700)

    }
    const [openShareBar,setOpenShareBar] = useState(false)
    const [sharedMessage,setSharedMessage] = useState({})

    useEffect(() => {
        console.log(photo,'photo po')
    }, [photo]);
    const shareMessage = () => {
        setOpenShareBar(true)
        switch (sizeType){
            case 'photos':
                setSharedMessage({photo,type:'photos'})
            break;
            case 'videos':
                setSharedMessage({video,type:'videos'})
            break;
            case 'audio':
                setSharedMessage({audio,type:'audio'})
            break;
            case 'message':
                setSharedMessage({text,type:'message'})
            break;
            default:
                setSharedMessage({})
             break;
        }

    }
    const handleClick = () => {
        return
    }

    return (
        <div
            className={`w-fit h-fit relative `} style={{zIndex:80}}>
            {openShareBar? <ShareBarComponent style={{ zIndex: 1000 }}   message={sharedMessage} onClick={handleClick} messages={null} setOpenShareBar={setOpenShareBar}  post={null} /> : null}
            <div className={` ${openShareBar?'hidden':''} xl:w-60 xl:h-[250px] lg:w-52 lg:h-[220px] md:w-44 md:h-[185px] sm:w-36 sm:h-[150px] z-[9999] w-28 h-[125px] bg-[rgba(219,220,220,1)] px-2 py-2 rounded-lg ${isFromMe?'myDropdown':'chatmateDropdown'} ${(sizeType === 'photos' || sizeType === 'videos')?indexOfMessage <1 ? 'top':'bottom':indexOfMessage < 2 ? 'top':'bottom'} `}  >
                <div onClick={handleCopy}
                     className={'w-full h-[17%] hover:bg-cyan-400 rounded-md cursor-pointer flex items-center justify-start xl:pl-4 lg:pl-3 md:pl-2 sm:pl-2 pl-1'}>
                    <MdContentCopy className={'text-black xl:text-xl lg:text-lg md:text-md sm:text-sm text-[10px] mr-3'}/>
                    <h3 className={'text-black xl:text-md lg:text-md sm:text-sm text-[10px]  font-[500]'}>Copy</h3>
                </div>
                <div
                    onClick={handleSaveFile}
                    className={'w-full h-[17%] hover:bg-cyan-400 rounded-md cursor-pointer flex items-center justify-start xl:pl-4 lg:pl-3 md:pl-2 sm:pl-2 pl-1'}>
                    <LiaSave className={'text-black xl:text-xl lg:text-lg md:text-md sm:text-sm text-[10px] mr-3'}/>
                    <h3 className={'text-black xl:text-md  md:text-sm lg:text-md  sm:text-sm text-[10px] font-[500]'}>Save as...</h3>
                </div>
                <div
                    onClick={handleDelete}
                    className={'w-full h-[17%] hover:bg-cyan-400 rounded-md cursor-pointer flex items-center justify-start xl:pl-4 lg:pl-3 md:pl-2 sm:pl-2 pl-1'}>
                    <RiDeleteBin6Line className={'text-black xl:text-xl lg:text-lg md:text-md sm:text-sm text-[10px] mr-3'}/>
                    <h3 className={'text-black  xl:text-md lg:text-md  md:text-sm  sm:text-sm text-[10px] font-[500]'}>Delete</h3>
                </div>
                <div
                    onClick={handleSelect}
                    className={'w-full h-[17%] hover:bg-cyan-400 rounded-md cursor-pointer flex items-center justify-start xl:pl-4 lg:pl-3 md:pl-2 sm:pl-2 pl-1'}>
                    <IoIosCheckboxOutline className={'text-black xl:text-xl lg:text-lg md:text-md sm:text-sm text-[10px] mr-3'}/>
                    <h3 className={'text-black xl:text-md lg:text-md  md:text-sm sm:text-sm text-[10px] font-[500]'}>Select</h3>
                </div>
                <div
                    onClick={shareMessage}
                    className={'w-full h-[17%] hover:bg-cyan-400 rounded-md cursor-pointer flex items-center justify-start xl:pl-4 lg:pl-3 md:pl-2 sm:pl-2 pl-1'}>
                    <FaRegShareFromSquare className={'text-black xl:text-xl lg:text-lg md:text-md sm:text-sm text-[10px] mr-3'}/>
                    <h3 className={'text-black xl:text-md lg:text-md md:text-sm sm:text-sm text-[10px]  font-[500]'}>Share</h3>
                </div>
                <div
                    className={'w-full h-[17%] flex items-center justify-center'}>
                    <section
                        className={`xl:w-9 lg:w-8 xl:h-9 lg:h-8 md:w-7 md:h-7 sm:w-6 sm:h-6 w-5 h-5 flex items-center justify-center cursor-pointer rounded-full hover:bg-cyan-400 ${isReactionActive('👍') ? 'bg-cyan-400' : ''} `}
                        onClick={() => handleAddReaction('👍')}>
                        <h2 className={'m-0 xl:text-xl lg:text-lg md:text-md sm:text-[12px] text-[8.5px]'}>👍</h2>
                    </section>
                    <section
                        className={`xl:w-9 lg:w-8 xl:h-9 lg:h-8 md:w-7 md:h-7 sm:w-6 sm:h-6 w-5 h-5 flex items-center justify-center cursor-pointer rounded-full hover:bg-cyan-400 ${isReactionActive('❤️') ? 'bg-cyan-400' : ''} `}
                        onClick={() => handleAddReaction('❤️')}>
                        <h2 className={'m-0 xl:text-xl lg:text-lg md:text-md sm:text-[12px] text-[8.5px]'}> ❤️</h2>
                    </section>
                    <section
                        className={`xl:w-9 lg:w-8 xl:h-9 lg:h-8 md:w-7 md:h-7 sm:w-6 sm:h-6 w-5 h-5 flex items-center justify-center cursor-pointer rounded-full hover:bg-cyan-400 ${isReactionActive('😂') ? 'bg-cyan-400' : ''} `}
                        onClick={() => handleAddReaction('😂')}>
                        <h2 className={'m-0 xl:text-xl lg:text-lg md:text-md sm:text-[12px] text-[8.5px]'}>😂</h2>
                    </section>
                    <section
                        className={`m-0 xl:w-9 lg:w-8 xl:h-9 lg:h-8 md:w-7 md:h-7 sm:w-6 sm:h-6 w-5 h-5 flex items-center justify-center cursor-pointer rounded-full hover:bg-cyan-400 ${isReactionActive('😮') ? 'bg-cyan-400' : ''} `}
                        onClick={() => handleAddReaction('😮')}>
                        <h2 className={'xl:text-xl lg:text-lg md:text-md sm:text-[12px] text-[8.5px]'}>😮</h2>
                    </section>
                    <section
                        className={`m-0 xl:w-9 lg:w-8 xl:h-9 lg:h-8 md:w-7 md:h-7 sm:w-6 sm:h-6 w-5 h-5 flex items-center justify-center cursor-pointer rounded-full hover:bg-cyan-400 ${isReactionActive('😢') ? 'bg-cyan-400' : ''} `}
                        onClick={() => handleAddReaction('😢')}>
                        <h2 className={'xl:text-xl lg:text-lg md:text-md sm:text-[12px] text-[8.5px]'}>😢</h2>
                    </section>
                    <section
                        className={`m-0 xl:w-9 lg:w-8 xl:h-9 lg:h-8 md:w-7 md:h-7 sm:w-6 sm:h-6 w-5 h-5 flex items-center justify-center cursor-pointer rounded-full hover:bg-cyan-400${isReactionActive('🙏') ? 'bg-cyan-400' : ''} `}
                        onClick={() => handleAddReaction('🙏')}>
                        <h2 className={'xl:text-xl lg:text-lg md:text-md sm:text-[12px] text-[8.5px]'}>🙏</h2>
                    </section>


                </div>
            </div>
        </div>
    );
}

export default Dropdown;