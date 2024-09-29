import React, {useEffect, useRef, useState} from 'react';
import {useConversationContext} from "../../context/useConversationContext";
import {useAuthContext} from "../../context/useAuthContext";
import {getFullTime} from "../../utils/getFullTime";
import {FaAngleDown, FaPause, FaPlay} from "react-icons/fa";
import {CiPlay1} from "react-icons/ci";
import {FaRegFaceSmile} from "react-icons/fa6";
import Dropdown from "../../utils/Dropdown";
import useListenReactions from "../../hooks/useListenReactions";
import ReactionsMenu from "../../utils/ReactionsMenu";
import '@ashwamegh/react-link-preview/dist/index.css'
import Linkify from 'linkify-react';
import VideoPlayer from "../../utils/VideoPlayer";
import {useNavigate} from "react-router-dom";
function Message({message,isTyping,onMedia,media,messages,selectedMessages,setOpenSelectBar,openSelectBar,setSelectedMessages,setSelectedMessagesShare,selectedMessagesShare}) {
    const {selectedConversation} = useConversationContext()
    const {authUser} = useAuthContext()
    const isFromMe = authUser._id === message.senderId
    const profileImage = isFromMe ? authUser.images.profileImage : selectedConversation.images.profileImage
    const chatClassName = isFromMe?'flex-row-reverse pl-5  ':'flex-row  pr-5'
    const chatClassName2 = isFromMe?'flex-row pr-5  ':'flex-row  pr-5'
    const audioRef = useRef()
    const [audioDuration, setAudioDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [isPlaying,setIsPlaying] = useState(false)
    useListenReactions()

    const handleAudioPlayPause = () => {
        const audioElement = audioRef.current;
        if (audioElement) {
            if (isPlaying) {
                audioElement.pause();
            } else {
                audioElement.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    useEffect(() => {
        const audioElement = audioRef.current;
        if (audioElement) {
            const updateCurrentTime = () => {
                setCurrentTime(audioElement.currentTime);
            };
            audioElement.addEventListener('timeupdate', updateCurrentTime);
            return () => {
                audioElement.removeEventListener('timeupdate', updateCurrentTime);
            };
        }
    }, [message.audio]);

    useEffect(() => {
        if (currentTime === audioDuration){
            setIsPlaying(false)
        }
    }, [currentTime]);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const handleProgressClick = (e) => {
        if (audioDuration === Infinity) {
            return ;
        }
        else{
            const progressBar = e.currentTarget;
            const rect = progressBar.getBoundingClientRect();
            const offsetX = e.clientX - rect.left;
            const newTime = (offsetX / progressBar.offsetWidth) * audioDuration;
            audioRef.current.currentTime = newTime;
            setCurrentTime(newTime);
        }
    };

    const [isOpen,setIsOpen] = useState({});
    const [isOpenReactions,setIsOpenReactions] = useState({});

    useEffect(() => {
        setIsOpen({
            message:false,
            audio:false,
            photos:message.photos.map((item)=>{
                const final = []
                final.push({url:item.url,isOpen:false})
                return final
            }).flat(),
            videos:message.videos.map((item)=>{
                const final = []
                final.push({url:item.url,isOpen:false})
                return final
            }).flat()
        })
        setIsOpenReactions({
            message:false,
            audio:false,
            photos:message.photos.map((item)=>{
                const final = []
                final.push({url:item.url,isOpen:false})
                return final
            }).flat(),
            videos:message.videos.map((item)=>{
                const final = []
                final.push({url:item.url,isOpen:false})
                return final
            }).flat()
        })
    }, [message]);




    useEffect(() => {
        const handleScroll = () => {
            setIsOpen(prevIsOpen => ({
                message: false,
                audio: false,
                photos: prevIsOpen.photos.map(item => ({ ...item, isOpen: false })),
                videos: prevIsOpen.videos.map(item => ({ ...item, isOpen: false }))
            }));
            setIsOpenReactions(prevIsOpen => ({
                message: false,
                audio: false,
                photos: prevIsOpen.photos.map(item => ({ ...item, isOpen: false })),
                videos: prevIsOpen.videos.map(item => ({ ...item, isOpen: false }))
            }));
        };

        // Attach scroll listener to a suitable container (e.g., message container)
        const scrollContainer = document.getElementById('messageContainer'); // Adjust this ID as per your actual container
        // if (scrollContainer) {
            scrollContainer.addEventListener('scroll', handleScroll);
        // }

        return () => {
            // if (scrollContainer) {
                scrollContainer.removeEventListener('scroll', handleScroll);
            // }
        };
    }, []); // En


    const indexOfMessage = messages.indexOf(message);


    useEffect(() => {
        console.log(selectedMessages,'selected messages')
    }, [selectedMessages.length,openSelectBar]);

    const extractLinks = (text) => {
        // Regular expression to match URLs
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const links = text.match(urlRegex);
        return links || [];
    };

    useEffect(() => {
        const anchors = document.querySelectorAll('.pt a');

        // Loop through each anchor tag and set the target attribute
        anchors.forEach(anchor => {
            anchor.setAttribute('target', '_blank');
        });

    }, []);

    useEffect(() => {
        console.log(selectedMessagesShare,'messages Share')
    }, [selectedMessagesShare]);


    const handlePhotoCheckboxChange = (photo, message, index) => {
        if (selectedMessages.some(selMessage => selMessage.type === 'photos' && selMessage.messageId === message._id && selMessage.index === index) &&
            selectedMessagesShare.some(selMessage => selMessage.photo === photo.url && selMessage.messageId === message._id && selMessage.index === index)) {
            // Remove from both arrays
            const updatedMessages = selectedMessages.filter(selMessage =>
                selMessage.type !== 'photos' || selMessage.messageId !== message._id || selMessage.index !== index
            );
            setSelectedMessages(updatedMessages);

            const updatedShareMessages = selectedMessagesShare.filter(selMessage =>
                !(selMessage.photo === photo.url && selMessage.messageId === message._id && selMessage.index === index)
            );
            setSelectedMessagesShare(updatedShareMessages);
        } else {
            // Add to both arrays
            const updatedMessages = [...selectedMessages, {
                type: 'photos',
                messageId: message._id,
                index: index
            }];
            setSelectedMessages(updatedMessages);

            const updatedShareMessages = [...selectedMessagesShare, {
                photo: photo.url,
                messageId: message._id,
                index: index
            }];
            setSelectedMessagesShare(updatedShareMessages);
        }
    };

// Function to handle selection/deselection of videos
    const handleVideoCheckboxChange = (video, message, index) => {
        if (selectedMessages.some(selMessage => selMessage.type === 'videos' && selMessage.messageId === message._id && selMessage.index === index) &&
            selectedMessagesShare.some(selMessage => selMessage.video === video.url && selMessage.messageId === message._id && selMessage.index === index)) {
            // Remove from both arrays
            const updatedMessages = selectedMessages.filter(selMessage =>
                selMessage.type !== 'videos' || selMessage.messageId !== message._id || selMessage.index !== index
            );
            setSelectedMessages(updatedMessages);

            const updatedShareMessages = selectedMessagesShare.filter(selMessage =>
                !(selMessage.video === video.url && selMessage.messageId === message._id && selMessage.index === index)
            );
            setSelectedMessagesShare(updatedShareMessages);
        } else {
            // Add to both arrays
            const updatedMessages = [...selectedMessages, {
                type: 'videos',
                messageId: message._id,
                index: index
            }];
            setSelectedMessages(updatedMessages);

            const updatedShareMessages = [...selectedMessagesShare, {
                video: video.url,
                messageId: message._id,
                index: index
            }];
            setSelectedMessagesShare(updatedShareMessages);
        }
    };

// Function to handle selection/deselection of audio
    const handleAudioCheckboxChange = (audio, message) => {
        if (selectedMessages.some(selMessage => selMessage.type === 'audio' && selMessage.messageId === message._id) &&
            selectedMessagesShare.some(selMessage => selMessage.audio === audio.url && selMessage.messageId === message._id)) {
            // Remove from both arrays
            const updatedMessages = selectedMessages.filter(selMessage =>
                selMessage.type !== 'audio' || selMessage.messageId !== message._id
            );
            setSelectedMessages(updatedMessages);

            const updatedShareMessages = selectedMessagesShare.filter(selMessage =>
                !(selMessage.audio === audio.url && selMessage.messageId === message._id)
            );
            setSelectedMessagesShare(updatedShareMessages);
        } else {
            // Add to both arrays
            const updatedMessages = [...selectedMessages, {
                type: 'audio',
                messageId: message._id
            }];
            setSelectedMessages(updatedMessages);

            const updatedShareMessages = [...selectedMessagesShare, {
                audio: audio.url,
                messageId: message._id
            }];
            setSelectedMessagesShare(updatedShareMessages);
        }
    };

// Function to handle selection/deselection of messages
    const handleMessageCheckboxChange = (message) => {
        if (selectedMessages.some(selMessage => selMessage.type === 'message' && selMessage.messageId === message._id) &&
            selectedMessagesShare.some(selMessage => selMessage.message === message.message.content && selMessage.messageId === message._id)) {
            // Remove from both arrays
            const updatedMessages = selectedMessages.filter(selMessage =>
                selMessage.type !== 'message' || selMessage.messageId !== message._id
            );
            setSelectedMessages(updatedMessages);

            const updatedShareMessages = selectedMessagesShare.filter(selMessage =>
                !(selMessage.message === message.message.content && selMessage.messageId === message._id)
            );
            setSelectedMessagesShare(updatedShareMessages);
        } else {
            // Add to both arrays
            const updatedMessages = [...selectedMessages, {
                type: 'message',
                messageId: message._id
            }];
            setSelectedMessages(updatedMessages);

            const updatedShareMessages = [...selectedMessagesShare, {
                message: message.message.content,
                messageId: message._id
            }];
            setSelectedMessagesShare(updatedShareMessages);
        }
    };


    const isPost = message.postSharedBy



    const myVideo = message.videos && message.videos.length > 0 ?{
        video:message.videos[0].url
    }:null

    const navigate = useNavigate()

    const handleLinkPost = () => {
        navigate(`/post/${message.postId}`)
    }

    return (
        <section className={'flex flex-col'}>
            <div className={`  w-full h-fit mb-4  px-2  flex items-start justify-start ${chatClassName}  `}>
                <div className={`w-8 xl:w-10 lg:w-10 md:w-8 sm:w-8 rounded-full ${isFromMe ? 'ml-4' : 'mr-4'}`}>
                    <img className={'rounded-full'} src={profileImage}/>
                </div>
                <div className={`w-fit min-w-40 flex  justify-start flex-col ${isFromMe ? 'items-end' : 'items-start'}`}>
                    <div className={`flex items-center ${isFromMe ? 'flex-row-reverse' : 'flex-row'} `}>
                        <h2 className={`text-black  text-[10px] xl:text-md lg:text-md md:text-sm sm:text-sm font-bold m-0 ${isFromMe ? 'ml-3 ' : 'mr-3'}`}>{isFromMe ? authUser.fullName : selectedConversation.fullName}</h2>
                        <h4 className={' text-[10px] xl:text-sm lg:text-sm md:text-sm sm:text-sm m-0'}>{getFullTime(message.createdAt)}</h4>
                    </div>
                    {message.photos && !isPost && message.photos.length > 0   &&  message.photos.map((photo, index) => {
                        return (
                            <section className={'relative parent w-fit h-fit flex items-center justify-center'}>
                                {openSelectBar && authUser._id === message.senderId && <section
                                    className={`w-fit h-fit flex items-center justify-center absolute  ${isFromMe ? 'xl:-left-10 lg:-left-10 md:-left-8 sm:-left-6 -left-6' : '-right-6 xl:-right-10 lg:-right-10 md:-right-8 sm:-right-6'}`}>
                                    <input type="checkbox"
                                           className={`checkbox [--chkbg:#00CAC2] [--chkfg:white] border-[1] border-customGreen`}
                                           checked={selectedMessages.some(selMessage => selMessage.type === 'photos' && selMessage.messageId === message._id && selMessage.index === index) && selectedMessagesShare.some(selMessage => selMessage.photo === photo.url && selMessage.messageId === message._id && selMessage.index === index)}
                                           onChange={() => handlePhotoCheckboxChange(photo, message, index)}
                                    />
                                </section>}
                                <div
                                    className={`absolute flex items-center justify-center  ${isFromMe ? 'xl:-left-12 lg:-left-10 md:-left-8 sm:-left-5 -left-8' : '-right-8 xl:-right-12 lg:-right-10 md:-right-8 sm:-right-5'} `}>
                                    {isOpen.photos && isOpen.photos.filter((item) => item.url === photo.url).map((item) => {
                                        if (item.isOpen) {
                                            return (
                                                <Dropdown
                                                    selectedMessagesShare={selectedMessagesShare}
                                                    setSelectedMessagesShare={setSelectedMessagesShare}
                                                    setSelectedMessages={setSelectedMessages}
                                                    senderId={message.senderId} setOpenSelectBar={setOpenSelectBar}
                                                    selectedMessages={selectedMessages} file={photo.url}
                                                    photo={photo} video={null} setIsOpen={setIsOpen} text={null}
                                                    reactions={message.photos[index].reactions}
                                                    messageId={message._id} index={index} sizeType={'photos'}
                                                    indexOfMessage={indexOfMessage} isFromMe={isFromMe}/>
                                            )
                                        }
                                        return null;
                                    })
                                    }
                                    {!openSelectBar && <div onClick={() => setIsOpen((prevIsOpen) => ({
                                        ...prevIsOpen,
                                        message: false,
                                        audio: false,
                                        videos: prevIsOpen.videos.map((item) => {
                                            return {...item, isOpen: false}
                                        }),
                                        photos: prevIsOpen.photos.map((item) => {
                                            if (item.url === photo.url) {
                                                return {...item, isOpen: !item.isOpen}
                                            }
                                            return item;
                                        })
                                    }))}
                                                            className={`w-fit h-fit flex  items-center justify-center bg-[rgba(0,0,0,0.3)] p-1 rounded-xl text-white absolute   cursor-pointer   ${
                                                                isOpen.photos && isOpen.photos.filter((item) => item.url === photo.url).map((item) => item.isOpen ? '' : 'is')}`}>
                                        <FaRegFaceSmile className={'xl:text-[16px] lg:text-[15px] md:text-[13px] sm:text-[11px] text-[10px] mr-1'}/>
                                        <FaAngleDown className={'xl:text-[13px] lg:text-[12px] md:text-[10px] sm:text-[8px] text-[7px]'}/>
                                    </div>}
                                </div>

                                <img key={index} className={'xl:w-56 xl:h-64 lg:w-52 lg:h-60 md:w-44 md:h-48 sm:w-40 sm:h-40 w-36 h-36 mt-3 rounded-lg cursor-pointer'} onClick={() => {
                                    const index = media.findIndex(item => item.url === photo.url);
                                    if (index !== -1) {
                                        onMedia(index);
                                    }
                                }} src={photo.url}/>
                                {message.photos[index] && message.photos[index].reactions.length > 0 && <section
                                    onClick={() => setIsOpenReactions((prevIsOpen) => ({
                                        ...prevIsOpen,
                                        message: false,
                                        audio: false,
                                        videos: prevIsOpen.videos.map((item) => {
                                            return {...item, isOpen: false}
                                        }),
                                        photos: prevIsOpen.photos.map((item) => {
                                            if (item.url === photo.url) {
                                                return {...item, isOpen: !item.isOpen}
                                            }
                                            return item;
                                        })
                                    }))}
                                    className={`cursor-pointer w-fit xl:h-6 lg:h-6 md:h-5 sm:h-4 h-3 xl:px-1 xl:py-3  lg:px-1  lg:py-3 md:px-1  md:py-3 sm:px-1   sm:py-3 px-[3px] py-[10px]  flex items-center justify-center absolute -bottom-3 rounded-xl ${isFromMe?'right-0':'left-0'} bg-cyan-400`}>{
                                    message.photos[index].reactions.length === 2 && message.photos[index].reactions[0].reaction === message.photos[index].reactions[1].reaction ?
                                        <h2 className={'m-0 text-md'}>{message.photos[index].reactions[0].reaction}
                                            <span className={'text-white xl:text-sm lg:text-sm md:text-sm sm:text-sm text-[10px] mr-1 ml-1'}>2</span>
                                        </h2> : message.photos[index].reactions.map((reaction, index) => (
                                            <h2 className={`m-0 text-[10px] ${message.photos[index] && index === message.photos[index].reactions.length - 1 ? '' : 'mr-1'}  xl:text-md lg:text-md md:text-sm sm:text-sm`}>{reaction.reaction}</h2>
                                        ))
                                }
                                    {isOpenReactions.photos && isOpenReactions.photos.filter((item) => item.url === photo.url).map((item) => {
                                        if (item.isOpen) {
                                            return (
                                                <ReactionsMenu messageId={message._id} index={index}
                                                               reactions={message.photos[index].reactions}
                                                               isFromMe={isFromMe} indexOfMessage={indexOfMessage}
                                                               sizeType={'photos'}/>
                                            )
                                        }
                                        return null;
                                    })
                                    }
                                </section>}
                            </section>
                        );
                    })}
                    {message.videos && !isPost && message.videos.length > 0 && message.videos.map((video, index) => (
                        <div key={index}
                             className={'relative xl:w-80 xl:h-52 lg:w-72 lg:h-48  md:w-60 md:h-40 sm:w-52 sm:h-36 w-48 h-32  rounded-lg flex items-center justify-center parent'}>

                            {openSelectBar && authUser._id === message.senderId  && <section
                                className={`w-fit h-fit flex items-center justify-center absolute  ${isFromMe ? 'xl:-left-10 lg:-left-10 md:-left-8 sm:-left-6 -left-6' : '-right-6 xl:-right-10 lg:-right-10 md:-right-8 sm:-right-6'}`}>
                                <input type="checkbox"  className={`checkbox [--chkbg:#00CAC2] [--chkfg:white] border-[1] border-customGreen`}
                                       checked={selectedMessages.some(selMessage => selMessage.type === 'videos' && selMessage.messageId === message._id && selMessage.index === index)  && selectedMessagesShare.some(selMessage => selMessage.video === video.url && selMessage.messageId === message._id && selMessage.index === index)}
                                       onChange={() => handleVideoCheckboxChange(video,message,index)}
                                />
                            </section>}

                            <div
                                className={`absolute flex items-center justify-center  ${isFromMe ? 'xl:-left-12 lg:-left-10 md:-left-8 sm:-left-5 -left-8' : '-right-8 xl:-right-12 lg:-right-10 md:-right-8 sm:-right-5'} `}>
                                {isOpen.videos && isOpen.videos.filter((item) => item.url === video.url).map((item) => {
                                    if (item.isOpen) {
                                        return (
                                            <Dropdown selectedMessagesShare={selectedMessagesShare} setSelectedMessagesShare={setSelectedMessagesShare}  setSelectedMessages={setSelectedMessages}   senderId={message.senderId}  setOpenSelectBar={setOpenSelectBar}
                                                      selectedMessages={selectedMessages} file={video.url}
                                                      setIsOpen={setIsOpen} photo={null} video={video} text={null}
                                                      reactions={message.videos[index].reactions}
                                                      messageId={message._id} index={index} sizeType={'videos'}
                                                      indexOfMessage={indexOfMessage} isFromMe={isFromMe}/>
                                        )
                                    }
                                    return null;
                                })
                                }
                                {!openSelectBar && <div onClick={() => setIsOpen((prevIsOpen) => ({
                                    ...prevIsOpen,
                                    message: false,
                                    audio: false,
                                    photos: prevIsOpen.photos.map((item) => {
                                        return {...item, isOpen: false}
                                    }),
                                    videos: prevIsOpen.videos.map((item) => {
                                        if (item.url === video.url) {
                                            return {...item, isOpen: !item.isOpen}
                                        }
                                        return item;
                                    })
                                }))}
                                                        className={`w-fit h-fit flex  items-center justify-center bg-[rgba(0,0,0,0.3)] p-1 rounded-xl text-white absolute   cursor-pointer  ${
                                                            isOpen.videos && isOpen.videos.filter((item) => item.url === video.url).map((item) => item.isOpen ? '' : 'is')}  `}>
                                    <FaRegFaceSmile className={'xl:text-[16px] lg:text-[15px] md:text-[13px] sm:text-[11px] text-[10px] mr-1'}/>
                                    <FaAngleDown className={'xl:text-[13px] lg:text-[14px] md:text-[10px] sm:text-[8px] text-[7px]'}/>
                                </div>}
                            </div>
                            <video className={'w-full h-full'}>
                                <source src={video.url}/>
                            </video>
                            <section
                                onClick={() => {
                                    const index = media.findIndex(item => item.url === video.url);
                                    if (index !== -1) {
                                        onMedia(index);
                                    }
                                }}
                                className={'w-fit absolute h-fit flex items-center justify-center p-2 bg-[rgba(0,0,0,0.5)] z-50 rounded-sm cursor-pointer '}>
                                <CiPlay1 className={' text-white text-md'}/>
                            </section>
                            {message.videos[index] && message.videos[index].reactions.length > 0 && <section
                                onClick={() => setIsOpenReactions((prevIsOpen) => ({
                                    ...prevIsOpen,
                                    message: false,
                                    audio: false,
                                    photos: prevIsOpen.photos.map((item) => {
                                        return {...item, isOpen: false}
                                    }),
                                    videos: prevIsOpen.videos.map((item) => {
                                        if (item.url === video.url) {
                                            return {...item, isOpen: !item.isOpen}
                                        }
                                        return item;
                                    })
                                }))}
                                className={`cursor-pointer w-fit xl:h-6 lg:h-6 md:h-5 sm:h-4 h-3 xl:px-1 xl:py-3  lg:px-1  lg:py-3 md:px-1  md:py-3 sm:px-1   sm:py-3 px-[3px] py-[10px]  flex items-center justify-center absolute -bottom-3 rounded-xl ${isFromMe?'right-0':'left-0'} bg-cyan-400`}>{

                                message.videos[index].reactions.length === 2 && message.videos[index].reactions[0].reaction === message.videos[index].reactions[1].reaction ?
                                    <h2 className={'m-0 xl:text-md lg:text-md md:text-md sm:text-sm text-[10px]'}>{message.videos[index].reactions[0].reaction} <span
                                        className={'text-white xl:text-sm lg:text-sm md:text-sm sm:text-sm text-[10px] mr-1'}>2</span>
                                    </h2> : message.videos[index].reactions.map((reaction, index) => (
                                        <h2 className={`m-0 text-[10px] ${message.videos[index] && index === message.videos[index].reactions.length - 1 ? '' : 'mr-1'}  xl:text-md lg:text-md md:text-md sm:text-sm`}>{reaction.reaction}</h2>
                                    ))
                            }
                                {isOpenReactions.videos && isOpenReactions.videos.filter((item) => item.url === video.url).map((item) => {
                                    if (item.isOpen) {
                                        return (
                                            <ReactionsMenu messageId={message._id} index={index} reactions={message.videos[index].reactions} isFromMe={isFromMe} indexOfMessage={indexOfMessage} sizeType={'videos'}/>
                                        )
                                    }
                                    return null;
                                })
                                }

                            </section>}
                        </div>
                    ))}
                    {message.audio.url !== null && !isPost && message.audio.url &&
                        <section className={'mt-2 flex items-center justify-center relative parent '}>
                            {openSelectBar && authUser._id === message.senderId  && <section
                                className={`w-fit h-fit flex items-center justify-center absolute  ${isFromMe ? 'xl:-left-10 lg:-left-10 md:-left-8 sm:-left-6 -left-6' : '-right-6 xl:-right-10 lg:-right-10 md:-right-8 sm:-right-6'}`}>
                                <input type="checkbox"  className={`checkbox [--chkbg:#00CAC2] [--chkfg:white] border-[1] border-customGreen`}
                                       checked={selectedMessages.some(selMessage => selMessage.type === 'audio' && selMessage.messageId === message._id  && selectedMessagesShare.some(selMessage => selMessage.audio === message.audio.url && selMessage.messageId === message._id))}
                                       onChange={() => handleAudioCheckboxChange(message.audio,message)}
                                />
                            </section>}
                            {isOpen.audio ? <Dropdown
                                selectedMessagesShare={selectedMessagesShare}
                                setSelectedMessagesShare={setSelectedMessagesShare}
                                audio={message.audio}
                                setSelectedMessages={setSelectedMessages}
                                senderId={message.senderId}
                                setOpenSelectBar={setOpenSelectBar}
                                selectedMessages={selectedMessages}
                                file={message.audio.url} video={null} setIsOpen={setIsOpen}  photo={null} text={null} reactions={message.audio.reactions} index={undefined} messageId={message._id} sizeType={'audio'}   indexOfMessage={indexOfMessage} isFromMe={isFromMe}/>  : null}
                            {!openSelectBar && <div onClick={() => setIsOpen((prevIsOpen) => ({
                                ...prevIsOpen,
                                message: false,
                                videos: prevIsOpen.videos.map((item) => {
                                    return {...item, isOpen: false}
                                }),
                                photos: prevIsOpen.photos.map((item) => {
                                    return {...item, isOpen: false}
                                }),
                                audio: !prevIsOpen.audio
                            }))}
                                                    className={`w-fit h-fit flex  items-center justify-center bg-[rgba(0,0,0,0.3)] p-1 rounded-xl text-white absolute ${isFromMe ? 'xl:-left-12 lg:-left-10 md:-left-8 sm:-left-10' : 'xl:-right-12 lg:-right-10 md:-right-8 sm:-right-10'} cursor-pointer  ${isOpen.audio ? '' : 'is'}`}>
                                <FaRegFaceSmile className={'xl:text-[16px] lg:text-[15px] md:text-[13px] sm:text-[11px] text-[10px] mr-1'}/>
                                <FaAngleDown className={'xl:text-[13px] lg:text-[14px] md:text-[10px] sm:text-[8px] text-[7px]'}/>
                            </div>}
                            <div
                                className={`xl:w-64 lg:w-64 md:w-60 sm:w-56 w-40  pl-3 flex bg-gray-400 px-4 xl:py-[10px] lg:py-[10px] md:py-[8px] sm:py-[8px] py-[6px] xl:rounded-xl lg:rounded-xl md:rounded-xl sm:rounded-xl rounded-sm   h-fit  items-center relative`}>
                                <button type="button" onClick={handleAudioPlayPause} className="mr-2">
                                    {isPlaying ? <FaPause className="xl:text-lg lg:text-md md:text-md sm:text-md text-sm  text-customGreen"/> :
                                        <FaPlay className="xl:text-lg lg:text-md md:text-md sm:text-md text-sm  text-customGreen"/>}
                                </button>
                                <audio
                                    ref={audioRef}
                                    src={message.audio.url}
                                    preload={'metadata'}
                                    onDurationChange={(ev) => setAudioDuration(ev.currentTarget.duration)}
                                    hidden
                                />
                                <div onClick={handleProgressClick}
                                     className="flex-1 cursor-pointer xl:h-2 md:h-2 lg:h-2 sm:h-2 h-1 bg-white rounded-full overflow-hidden relative">
                                    <div className="absolute top-0 left-0 h-2 bg-customGreen"
                                         style={{width: `${(currentTime / audioDuration) * 100}%`}}>
                                    </div>
                                </div>
                                <span
                                    className="ml-2 xl:text-md lg:text-md md:text-sm text-[8px] text-white">{formatTime(currentTime)} {audioDuration !== Infinity && '/' + formatTime(audioDuration)}</span>
                            </div>
                            {message.audio.reactions.length > 0 && <section
                                onClick={() => setIsOpenReactions((prevIsOpen) => ({
                                    ...prevIsOpen,
                                    message:false,
                                    videos:prevIsOpen.videos.map((item)=>{
                                        return {...item,isOpen:false}
                                    }),
                                    photos:prevIsOpen.photos.map((item)=>{
                                        return {...item,isOpen:false}
                                    }),
                                    audio: !prevIsOpen.audio
                                }))}
                                className={`cursor-pointer w-fit xl:h-6 lg:h-6 md:h-5 sm:h-4 h-3 xl:px-1 xl:py-3  lg:px-1  lg:py-3 md:px-1  md:py-3 sm:px-1   sm:py-3 px-[3px] py-[10px]  flex items-center justify-center absolute -bottom-3 rounded-xl ${isFromMe?'right-0':'left-0'} bg-cyan-400`}>{
                                message.audio.reactions.length === 2 &&   message.audio.reactions[0].reaction === message.audio.reactions[1].reaction ?
                                    <h2 className={'m-0 xl:text-md lg:text-md md:text-md sm:text-sm text-[10px]'}>{message.audio.reactions[0].reaction} <span className={'text-white xl:text-sm lg:text-sm md:text-sm mr-1'}>2</span></h2>: message.audio.reactions.map((reaction, index) => (
                                        <h2 className={`m-0 ${index === message.audio.reactions.length - 1 ? '' : 'mr-1'}  xl:text-md lg:text-md md:text-md sm:text-sm text-[10px]`}>{reaction.reaction}</h2>
                                    ))
                            }
                                {isOpenReactions.audio && <ReactionsMenu messageId={message._id} index={undefined} reactions={message.audio.reactions} isFromMe={isFromMe} indexOfMessage={indexOfMessage} sizeType={'audio'}/> }

                            </section>}

                        </section>
                    }
                    {message.message.content !== null && !isPost && message.message.content && <div className={`w-[90%]   pb-3  h-fit text-md font-customTwo flex mt-3 items-center relative parent `}>
                        {openSelectBar && authUser._id === message.senderId && <section
                            className={`w-fit h-fit flex items-center justify-center absolute  ${isFromMe ? 'xl:-left-10 lg:-left-10 md:-left-8 sm:-left-6 -left-4' : ' -right-4 xl:-right-10 lg:-right-10 md:-right-8 sm:-right-6'}`}>
                            <input type="checkbox"  className={`checkbox [--chkbg:#00CAC2] [--chkfg:white] border-[1] border-customGreen`}
                                   checked={selectedMessages.some(selMessage => selMessage.type === 'message' && selMessage.messageId === message._id) && selectedMessagesShare.some(selMessage => selMessage.message === message.message.content &&  selMessage.messageId === message._id)}
                                   onChange={() => handleMessageCheckboxChange(message)}
                            />
                        </section>}
                        <div
                            className={`absolute flex items-center justify-center  ${isFromMe ? 'xl:-left-12 lg:-left-10 md:-left-8 sm:-left-8 -left-8' : '-right-8 xl:-right-12 lg:-right-10 md:-right-8 sm:-right-8'} `}>
                            {!openSelectBar && <div onClick={() => setIsOpen((prevIsOpen) => ({
                                ...prevIsOpen,
                                videos: prevIsOpen.videos.map((item) => {
                                    return {...item, isOpen: false}
                                }),
                                photos: prevIsOpen.photos.map((item) => {
                                    return {...item, isOpen: false}
                                }),
                                audio: false,
                                message: !prevIsOpen.message
                            }))}
                                                    className={`w-fit h-fit flex  items-center justify-center bg-[rgba(0,0,0,0.3)] xl:p-1 lg:p-1 md:p-1 sm:p-1 p-[3px] rounded-xl text-white  cursor-pointer   ${isOpen.message ? '' : 'is'} `}>
                                <FaRegFaceSmile className={'xl:text-[16px] lg:text-[15px] md:text-[13px] sm:text-[11px] text-[10px] mr-1'}/>
                                <FaAngleDown className={'xl:text-[13px] lg:text-[14px] md:text-[10px] sm:text-[8px] text-[7px]'}/>
                            </div>}
                            {isOpen.message &&
                                <Dropdown selectedMessagesShare={selectedMessagesShare} setSelectedMessagesShare={setSelectedMessagesShare}  setSelectedMessages={setSelectedMessages}   senderId={message.senderId}  setOpenSelectBar={setOpenSelectBar} selectedMessages={selectedMessages}
                                          photo={null} video={null} file={null} setIsOpen={setIsOpen}
                                          text={message.message.content} reactions={message.message.reactions}
                                          index={undefined} messageId={message._id} sizeType={'message'}
                                          indexOfMessage={indexOfMessage} isFromMe={isFromMe}
                                />}
                        </div>
                        {message.message.content.match( /(https?:\/\/[^\s]+)/g)?
                            <div className={'w-fit h-fit '}>
                                <Linkify  > <div  className={'w-fit pt flex items-center break-words  xl:text-lg lg:text-lg md:text-lg md:text-md sm:text-md text-[12px]'}>{message.message.content}</div></Linkify>
                            </div> : <p className={'xl:text-lg lg:text-lg md:text-lg md:text-md sm:text-md text-[12px]'}>{message.message.content}</p>}
                        {message.message.reactions.length > 0 && <section
                            onClick={() => setIsOpenReactions((prevIsOpen) => ({
                                ...prevIsOpen,
                                videos: prevIsOpen.videos.map((item) => {
                                    return {...item, isOpen: false}
                                }),
                                photos: prevIsOpen.photos.map((item) => {
                                    return {...item,isOpen:false}
                                }),
                                audio:false,
                                message: !prevIsOpen.message
                            }))}
                            className={`cursor-pointer w-fit xl:h-6 lg:h-6 md:h-5 sm:h-4 h-3 xl:px-1 xl:py-3  lg:px-1  lg:py-3 md:px-1  md:py-3 sm:px-1   sm:py-3 px-[3px] py-[10px]  flex items-center justify-center absolute -bottom-3 rounded-xl ${isFromMe?'right-0':'left-0'} bg-cyan-400`}>{
                            message.message.reactions.length === 2 && message.message.reactions[0].reaction === message.message.reactions[1].reaction ?
                                <h2 className={'m-0 xl:text-md lg:text-md md:text-md sm:text-sm text-[10px]'}>{message.message.reactions[0].reaction} <span className={'text-white xl:text-sm lg:text-sm md:text-sm  sm:text-sm mr-1'}>2</span></h2>: message.message.reactions.map((reaction, index) => (
                                    <h2 className={`m-0 ${index === message.message.reactions.length - 1 ? '' : 'mr-1'} text-[10px] xl:text-md lg:text-md md:text-sm sm:text-sm`}>{reaction.reaction}</h2>
                                ))
                        }
                            {isOpenReactions.message && <ReactionsMenu messageId={message._id} index={undefined} reactions={message.message.reactions} isFromMe={isFromMe} indexOfMessage={indexOfMessage} sizeType={'message'}/> }
                        </section>}
                    </div>}
                    {message.postSharedBy && (
                        <div className={'xl:w-64 xl:h-72 lg:w-56 lg:h-64 md:w-60 md:h-64 sm:w-52 sm:h-60 w-40 h-52 mt-4 relative parent flex flex-col justify-center '} onClick={handleLinkPost}>
                            {openSelectBar && authUser._id === message.senderId && <section
                                className={`w-fit h-fit flex items-center justify-center absolute  ${isFromMe ? 'xl:-left-10 lg:-left-10 md:-left-8 sm:-left-6 -left-8' : '-right-8 xl:-right-10 lg:-right-10 md:-right-8 sm:-right-6'}`}>
                                <input type="checkbox"  className={`checkbox [--chkbg:#00CAC2] [--chkfg:white] border-[1] border-customGreen`}
                                       checked={selectedMessages.some(selMessage => selMessage.type === 'message' && selMessage.messageId === message._id) && selectedMessagesShare.some(selMessage => selMessage.message === message.message.content &&  selMessage.messageId === message._id)}
                                       onChange={() => handleMessageCheckboxChange(message)}
                                />
                            </section>}

                            <section
                                className={'w-full rounded-t-xl h-[17%] px-3 py-2 bg-[#262626] flex justify-start items-center '}>
                                <img src={message.postSharedBy.pic} className={'xl:w-10 xl:h-10 lg:w-10 lg:h-10 md:w-8 md:h-8 sm:w-8 sm:h-8 w-8 h-8 rounded-full'}/>
                                <h2 className={'text-white xl:text-[17px] lg:text-[15px] md:text-[13px] sm:text-[11px] text-[10px]  ml-3'}>@{message.postSharedBy.username}</h2>
                            </section>
                            {message.photos.length > 0 ?
                                <img className={'w-full xl:h-[63%] lg:h-[63%] md:h-[63%] sm:h-[63%] h-[63%]'} src={message.photos[0].url}/> : null}
                            {message.videos && message.videos.length > 0 ?
                                <div className={'w-full  pp'} style={{pointerEvents: 'none'}}
                                     onClick={(ev) => ev.stopPropagation()}>
                                    <VideoPlayer item={myVideo}/>
                                </div>
                                : null}
                            <section className={'w-full rounded-b-xl h-[20%] bg-[#262626] overflow-hidden  px-3 py-2 '}>
                                <p className={'text-white xl:text-[15px] lg:text-[14px] md:text-[12px] sm:text-[10px] text-[10px] leading-4 text-center'}> {message.message.content.length > 100 ? message.message.content.slice(0, 97) + '...' : message.message.content}</p>
                            </section>
                        </div>
                    )}
                </div>
            </div>
            {isTyping ?
                <div className={`  w-full h-fit   px-2 flex items-center  justify-start ${chatClassName2} mb-4`}>
                    <div className={`xl:w-10 lg:w-10 md:w-10 sm:w-8 w-8 rounded-full ${isFromMe ? 'mr-4' : 'mr-4'}`}>
                        <img className={'rounded-full'} src={selectedConversation.images.profileImage}/>
                    </div>
                    <section
                        className={'w-fit h-fit flex items-center justify-center bg-gray-400 px-4 py-1 text-white rounded-xl'}>
                        <span className="loading loading-dots loading-sm"></span>
                    </section>
                </div> : null}
        </section>
    );
}

export default Message;