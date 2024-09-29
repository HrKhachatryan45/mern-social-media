import React, {useEffect, useRef, useState} from 'react';
import useGetMessages from "../../hooks/useGetMessages";
import {useConversationContext} from "../../context/useConversationContext";
import {FaInfoCircle, FaPhoneAlt, FaVideo} from "react-icons/fa";
import {useAuthContext} from "../../context/useAuthContext";
import {useSocketContext} from "../../context/useSocketContext";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import {Link} from "react-router-dom";
import {AiOutlineInfoCircle} from "react-icons/ai";
import {VscFileMedia} from "react-icons/vsc";
import {IoLink, IoVideocamOutline} from "react-icons/io5";
import {FiPhone} from "react-icons/fi";
import {FaRegShareFromSquare} from "react-icons/fa6";
import {RiDeleteBin6Line} from "react-icons/ri";
import useDeleteMessages from "../../hooks/useDeleteMessages";
import {PiSelectionAllBold} from "react-icons/pi";
import {LiaUndoSolid} from "react-icons/lia";
import ShareBarComponent from "../../utils/ShareBarComponent";

function MessagesCenter(props) {
    const {selectedConversation} = useConversationContext()
    const {messages} = useGetMessages()
    const {onlineUsers} = useSocketContext()
    const isOnline =selectedConversation && onlineUsers.includes(selectedConversation._id)
    const [isTyping,setIsTyping] = useState(false)
    const [menu,setMenu] = useState(false)
    const [active,setActive] = useState('overview')
    const handleChange = (value) => {
        setIsTyping(value)
    }

    const handleSelectActive = (activeClass) => {
        setActive(activeClass)
    }
    const [media,setMedia] = useState([])
    let mediaArray = [];
    useEffect(() => {

         mediaArray = messages.filter((item) => (item.hasOwnProperty('photos') && item.photos.length > 0) || (item.hasOwnProperty('videos') && item.videos.length > 0) && item._id && item.senderId);
    setMedia(mediaArray.map((item)=>{
    let final = []
    if (item.photos && item.photos.length > 0) {
        item.photos.map((photo,index)=>{
            final.push({url:photo.url,zoom:1,_id:item._id,index,senderId:item.senderId})
        })
    }
    if (item.videos && item.videos.length > 0) {
        item.videos.map((video,index)=>{
            final.push({url:video.url,_id:item._id,index,senderId:item.senderId})
        })
    }
    return  final
}).flat())

    }, [messages]);

    const fileExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.webp', '.svg', '.ico', '.heic'];


    const [durationObject,setDurationObject] = useState({})
    const videoRefs = useRef([]);

    useEffect(() => {
        // Adding event listeners to video elements to get durations
        videoRefs.current.forEach((videoRef, index) => {
            if (videoRef) {
                videoRef.addEventListener('loadedmetadata', () => {
                    console.log(`Video ${index} duration: ${videoRef.duration} seconds`);
                    setDurationObject((prevDurations) => ({
                        ...prevDurations,
                        [index]: videoRef.duration
                    }));
                });
            }
        });

    }, [mediaArray,durationObject,messages]);



    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };
    const [openMedia,setOpenMedia] = useState(false);
    const [currentIndex,setCurrentIndex] = useState(0);

    useEffect(() => {
        setMenu(false)
    }, [selectedConversation]);


    const handleMedia = (index) => {
        setOpenMedia(true)
        setMenu(false)
        setCurrentIndex(index)
    }
    const [openSelectBar,setOpenSelectBar] = useState(false)
    const [selectedMessages,setSelectedMessages] = useState([]);
    const [selectedMessagesShare,setSelectedMessagesShare] = useState([]);
    const [now,setNow] = useState(false)
    const {deleteMessages} = useDeleteMessages()
    const [openSelectBarMenu,setOpenSelectBarMenu] = useState(false)
    const [selectedMessagesMenu,setSelectedMessagesMenu] = useState([]);
    const [now2,setNow2] = useState(false)


    useEffect(() => {
        if (now2){
            setOpenSelectBarMenu(false)
            setSelectedMessagesMenu([])
            setShowAll(true)
            setNow2(false);
        }
    }, [now2]);

    const handleDeleteMedia = async () => {
        setNow2(true)
        await deleteMessages(selectedMessagesMenu)
    }


    useEffect(() => {
        if (now){
            setOpenSelectBar(false)
            setSelectedMessages([])
            setNow(false);
        }
    }, [now]);

    const handleDelete = async () => {
        setNow(true)
        await deleteMessages(selectedMessages)

    }


    const {authUser} = useAuthContext()


    useEffect(() => {
        if (selectedMessagesMenu.length ===0){
            setOpenSelectBarMenu(false)
        }else{
            setOpenSelectBarMenu(true)
        }
    }, [selectedMessagesMenu]);

    const [isHovered, setIsHovered] = useState(null);


    useEffect(() => {
        console.log(selectedMessages,'the media')
        console.log(selectedMessagesMenu,'the media menu')
    }, [selectedMessages,selectedMessagesMenu]);

    useEffect(() => {
        if (!menu){
            setSelectedMessagesMenu([])
            setOpenSelectBarMenu(false)
        }
    }, [menu]);

    const [showAll,setShowAll] = useState(true)


    const extractLinks = (text) => {
        if (!text) return [];
        // Regular expression to match URLs
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const links = text.match(urlRegex);
        return links || [];
    };

    const [openShare,setOpenShare] = useState(false)
    const [messagesm,setMessagesm] = useState([])
    const handleShareMessage = async () => {
        const messages = selectedMessagesShare.map(item => {
            const { index, messageId, ...rest } = item; // Destructure index and messageId, and capture the rest of the properties
            return rest; // Return object without index and messageId
        });
        setMessagesm(messages)
        console.log(messages,'mess for share')
    setOpenShare(true)
    }


    const handleClose = () => {
        setOpenSelectBar(false)
        setSelectedMessages([])
        setSelectedMessagesShare([])
    }

    const [selectedMessagesMenuShare,setSelectedMessagesMenuShare] = useState([])


    useEffect(() => {
        console.log(selectedMessagesMenu,'menu message')
        console.log(selectedMessagesMenuShare,'menu share message')
    }, [selectedMessagesMenu,selectedMessagesMenuShare]);


    const handlePhotoCheckboxChange = (photo, message, index) => {
        if (selectedMessagesMenu.some(selMessage => selMessage.type === 'photos' && selMessage.messageId === message._id && selMessage.index === index) &&
            selectedMessagesMenuShare.some(selMessage => selMessage.photo === photo.url && selMessage.messageId === message._id && selMessage.index === index)) {
            // Remove from both arrays
            const updatedMessages = selectedMessagesMenu.filter(selMessage =>
                selMessage.type !== 'photos' || selMessage.messageId !== message._id || selMessage.index !== index
            );
            setSelectedMessages(updatedMessages);

            const updatedShareMessages = selectedMessagesMenuShare.filter(selMessage =>
                !(selMessage.photo === photo.url && selMessage.messageId === message._id && selMessage.index === index)
            );
            setSelectedMessagesMenuShare(updatedShareMessages);
        } else {
            // Add to both arrays
            const updatedMessages = [...selectedMessagesMenu, {
                type: 'photos',
                messageId: message._id,
                index: index
            }];
            setSelectedMessagesMenu(updatedMessages);

            const updatedShareMessages = [...selectedMessagesMenuShare, {
                photo: photo.url,
                messageId: message._id,
                index: index
            }];
            setSelectedMessagesMenuShare(updatedShareMessages);
        }
    };

    const handleVideoCheckboxChange = (video, message, index) => {
        if (selectedMessagesMenu.some(selMessage => selMessage.type === 'videos' && selMessage.messageId === message._id && selMessage.index === index) &&
            selectedMessagesMenuShare.some(selMessage => selMessage.video === video.url && selMessage.messageId === message._id && selMessage.index === index)) {
            // Remove from both arrays
            const updatedMessages = selectedMessagesMenu.filter(selMessage =>
                selMessage.type !== 'videos' || selMessage.messageId !== message._id || selMessage.index !== index
            );
            setSelectedMessagesMenu(updatedMessages);

            const updatedShareMessages = selectedMessagesMenuShare.filter(selMessage =>
                !(selMessage.video === video.url && selMessage.messageId === message._id && selMessage.index === index)
            );
            setSelectedMessagesMenuShare(updatedShareMessages);
        } else {
            // Add to both arrays
            const updatedMessages = [...selectedMessagesMenu, {
                type: 'videos',
                messageId: message._id,
                index: index
            }];
            setSelectedMessagesMenu(updatedMessages);

            const updatedShareMessages = [...selectedMessagesMenuShare, {
                video: video.url,
                messageId: message._id,
                index: index
            }];
            setSelectedMessagesMenuShare(updatedShareMessages);
        }
    };
    



    const handleShareMedia = async () => {
        const messages = selectedMessagesMenuShare.map(item => {
            const { index, messageId, ...rest } = item; // Destructure index and messageId, and capture the rest of the properties
            return rest; // Return object without index and messageId
        });
        setMessagesm(messages)
        console.log(messages,'mess for share')
        setOpenShare(true)
        setMenu(false)
        setNow2(true)

    }

    const {socket} = useSocketContext()






    return (
        <div    className={'w-[62%] xl:w-[50%] lg:w-[50%] md:w-[62%] sm:w-[62%] border-b-1  h-[95%]   xl:h-full lg:h-full md:h-full sm:h-full    flex flex-col items-center justify-center relative' } style={{zIndex:99}}>
         <div className={''} style={{zIndex:9999}}>   {openShare? <ShareBarComponent message={null} onClick={handleClose} messages={messagesm} post={null} setOpenShareBar={setOpenShare} /> : null}</div>
            {selectedConversation ? <div className={'pt-3 w-full h-full'}>
                {openSelectBar ?
                    <div className={' w-full h-fit border-b-2 pb-2 px-3 flex items-center justify-between '}>
                        <section className={'w-fit h-fit flex items-center justify-center'}>
                            <h3 className={`text-[10px] xl:text-md lg:text-md md:text-sm sm:text-sm ${selectedMessages.length > 0 ?'text-black':'text-[rgba(105,102,102,0.2)]'} font-sans`}>{selectedMessages.length} selected</h3>
                        </section>
                        <section className={'w-fit h-fit flex items-center justify-center'}>
                            <button onClick={handleShareMessage} className={`bg-transparent nextButton !m-0 !static  xl:p-2 lg:p-2 md:p-[7px] sm:p-[5px] p-[4px] rounded-md`}>
                                <FaRegShareFromSquare className={`${selectedMessages.length > 0 ?'text-black':'text-[rgba(105,102,102,0.2)]'} xl:text-xl lg:text-lg  md:text-md  sm:text-sm text-[10px]`}/>
                            </button>
                            <button onClick={handleDelete} className={`ml-3 bg-transparent nextButton !m-0 !static  xl:p-2 lg:p-2 md:p-[7px] sm:p-[5px] p-[4px] rounded-md`}>
                                <RiDeleteBin6Line className={`${selectedMessages.length > 0 ?'text-black':'text-[rgba(105,102,102,0.2)]'} xl:text-xl lg:text-lg  md:text-md sm:text-sm text-[10px] `}/>
                            </button>
                            <section onClick={() => {
                                setOpenSelectBar(false)
                                setSelectedMessages([])
                                setSelectedMessagesShare([])
                            }} className={'cursor-pointer w-fit h-fit ml-3 px-2 py-1 bg-[rgba(105,102,102,0.2)] text-black xl:text-md lg:text-sm md:text-sm sm:text-sm text-[10px]  rounded-md'}>
                                Cancel
                            </section>
                        </section>
                    </div> :
                    <div className={' w-full h-fit border-b-2 pb-2 px-3 flex items-center justify-between '}>
                        <section className={'w-fit h-fit flex'}>
                            <div className={'relative'}>
                                <Link to={`/profile/${selectedConversation._id}`}>
                                    <img className={'w-8 h-8 xl:w-12 xl:h-12 lg:w-10 lg:h-10 md:w-10 md:h-10 sm:w-8 sm:h-8 rounded-full'}
                                         src={selectedConversation.images.profileImage}/>
                                </Link>
                                {isOnline ? <span
                                    className="absolute xl:-bottom-1 xl:-right-1 lg:-bottom-1 lg:-right-1 md:-bottom-1 md:-right-1 sm:bottom-[3px] sm:right-[3px] bottom-[3px] right-[3px] transform -translate-y-1/2 xl:w-3.5 xl:h-3.5 lg:w-3 lg:h-3 md:w-2.5 md:h-2.5 sm:w-2 sm:h-2 bg-customGreen dark:border-gray-800 rounded-full"></span> : null}
                            </div>
                            <div className={'w-fit h-fit flex flex-col justify-start items-start ml-3'}>
                                <Link to={`/profile/${selectedConversation._id}`}>
                                    <h2 className={'font-bold xl:text-lg lg:text-md md:text-sm sm:text-sm text-[10px] text-black m-0'}>{selectedConversation.fullName}</h2>
                                </Link>
                                <h4 className={' text-black xl:text-md lg:text-sm md:text-sm sm:text-sm text-[10px] m-0'}>{isOnline ? 'online' : 'offline'}</h4>
                            </div>
                        </section>
                        <section className={'w-fit h-hit flex justify-center items-center '}>
                            <FaPhoneAlt
                                className={'text-gray-400 text-md xl:text-2xl lg:text-xl md:text-lg sm:text-md mr-5 cursor-pointer hover:text-customGreen transition transform-cpu'}/>
                            <FaVideo
                                className={'text-gray-400 text-md xl:text-3xl lg:text-2xl md:text-lg sm:text-md mr-5 cursor-pointer hover:text-customGreen transition transform-cpu'}/>
                            <FaInfoCircle
                                onClick={() => setMenu(!menu)}
                                className={` text-md xl:text-2xl lg:text-xl md:text-lg sm:text-md cursor-pointer hover:text-customGreen transition transform-cpu ${menu ? 'text-customGreen' : 'text-gray-400'}`}/>
                        </section>

                    </div>}
                <div id={'messageContainer'} className={'w-full h-[80%] overflow-auto '}>
                    {messages.length > 0 ?
                        <Messages selectedMessagesShare={selectedMessagesShare} setSelectedMessagesShare={setSelectedMessagesShare} setSelectedMessages={setSelectedMessages}  openSelectBar={openSelectBar} setOpenSelectBar={setOpenSelectBar} selectedMessages={selectedMessages}
                                  currentIndex2={currentIndex} openMedia2={openMedia} isTyping={isTyping}/> :
                        <div className={'w-full  h-full flex flex-col items-center justify-center '}>
                            <img className={'xl:w-20  xl:h-20 lg:w-16 lg:h-16 md:w-12 md:h-12 sm:w-10 sm:h-10 w-10 h-10'}
                                  src={'https://cdn.icon-icons.com/icons2/806/PNG/512/chat-50_icon-icons.com_65975.png'}/>
                            <h2 className={'xl:text-2xl lg:text-xl md:text-md sm:text-sm text-10 text-black font-bold mt-4'}>No messages yet !</h2>
                        </div>}
                </div>
                {menu && <div
                    className={'z-[999] w-[100%] xl:h-[79%] lg:h-[77%] md:h-[78%] sm:h-[80%] h-[81%]     flex items-center justify-center absolute xl:top-[70px] lg:top-[65px] md:top-[62px] sm:top-[62px] top-[54px] right-0 '}>
                    <section
                        className={'w-[35%] bg-[#E5E6E8] h-full flex flex-col items-center justify-start px-1 pt-3'}>
                        <div onClick={() => handleSelectActive('overview')}
                             className={`relative w-full h-fit px-1 py-1 pl-3  cursor-pointer hover:bg-[rgba(219,220,220,1)] flex items-center justify-start  rounded-lg mb-2 ${active === 'overview' ? 'bg-[rgba(219,220,220,1)] ' : ''}`}>
                            {active === 'overview' ? <section
                                className={'w-[3px] h-[60%] rounded-md absolute left-0 bg-customGreen'}></section> : null}
                            <AiOutlineInfoCircle className={'mr-2 text-black text-[9px] xl:text-md lg:text-md md:text-sm sm:text-sm'}/>
                            <h3 className={'text-[9px] xl:text-md lg:text-md md:text-sm sm:text-sm text-black'}>Overview</h3>
                        </div>
                        <div onClick={() => handleSelectActive('media')}
                             className={`relative w-full h-fit px-1 py-1 pl-3  cursor-pointer hover:bg-[rgba(219,220,220,1)] flex items-center justify-start  rounded-lg mb-2 ${active === 'media' ? 'bg-[rgba(219,220,220,1)]' : ''}`}>
                            {active === 'media' ? <section
                                className={'w-[3px] h-[60%] rounded-md absolute left-0 bg-customGreen'}></section> : null}
                            <VscFileMedia className={'mr-2 text-[9px]  text-black xl:text-md lg:text-md md:text-sm sm:text-sm'}/>
                            <h3 className={' text-[9px] xl:text-md lg:text-md md:text-sm sm:text-sm text-black'}>Media</h3>
                        </div>
                        <div onClick={() => handleSelectActive('links')}
                             className={`relative w-full h-fit px-1 py-1 pl-3  cursor-pointer hover:bg-[rgba(219,220,220,1)] flex items-center justify-start  rounded-lg mb-2 ${active === 'links' ? 'bg-[rgba(219,220,220,1)]' : ''}`}>
                            {active === 'links' ? <section
                                className={'w-[3px] h-[60%] rounded-md absolute left-0 bg-customGreen'}></section> : null}
                            <IoLink className={'mr-2 text-[9px]  text-black xl:text-md lg:text-md md:text-sm sm:text-sm'}/>
                            <h3 className={' text-[9px] xl:text-md lg:text-md md:text-sm sm:text-sm text-black'}>Links</h3>
                        </div>

                    </section>
                    <section className={' bg-[#DBDCDC] w-[65%] h-full '}>
                        {active === 'overview' && <div
                            className={'w-full h-full pt-5 px-4 flex flex-col items-center justify-start  overflow-auto'}>
                            <img src={selectedConversation.images.profileImage} className={'w-20 h-20 xl:w-32 xl:h-32 lg:w-28 lg:h-28 md:h-20 sm:h-20 rounded-full '}/>
                            <h2 className={'mt-2 text-sm xl:text-xl lg:text-lg md:text-md sm:text-sm text-black font-[700]'}>{selectedConversation.fullName}</h2>
                            <h4 className={'text-sm xl:text-lg lg:text-md md:text-sm sm:text-sm font-customOne mt-1'}>@{selectedConversation.username}</h4>
                            <section className={'w-full h-fit flex items-center justify-between mt-2'}>
                                <div className={'w-[48%] flex flex-col items-center justify-center h-fit py-2 bg-[rgba(229,230,232,1)]  rounded-lg cursor-pointer hover:bg-[rgba(156,163,175,0.3)] transition-all duration-300'}>
                                    <IoVideocamOutline className={'text-black text-lg'}/>
                                    <h4 className={'text-black text-[10px] xl:text-lg lg:text-md md:text-sm sm:text-sm'}>Video</h4>
                                </div>
                                <div className={'w-[48%] flex flex-col items-center justify-center h-fit py-2 bg-[rgba(229,230,232,1)]  rounded-lg cursor-pointer hover:bg-[rgba(156,163,175,0.3)] transition-all duration-300'}>
                                    <FiPhone  className={'text-black text-lg'}/>
                                    <h4 className={'text-black text-[10px] xl:text-lg lg:text-md md:text-sm sm:text-sm'}>Voice</h4>
                                </div>
                            </section>
                            {selectedConversation.info.bio &&
                                <section className={'w-full h-fit flex flex-col items-start justify-center mt-2'}>
                                    <h4 className={'xl:text-md lg:text-md md:text-sm sm:text-sm text-black '}>About:</h4>
                                    <p className={'xl:text-sm lg:text-sm md:text-sm sm:text-sm text-gray-400'}>{selectedConversation.info.bio}</p>
                                </section>}

                        </div>}
                        {active === 'media' && <div className={'w-full h-full pt-2 px-4 relative'}>
                            <h2 className={'text-black text-sm xl:text-lg lg:text-md md:text-md sm:text-sm mb-2'}>Media</h2>

                            {media.length > 0 ?
                                <div className={'grid gap-1 grid-cols-3 xl:gap-2 lg:gap-2 md:gap-2 sm:gap-1 w-full max-h-[90%] overflow-auto'}>
                                    {media.map((item, index) => (
                                        fileExtensions.some(extens => item.url.endsWith(extens)) ?
                                            <div  key={index} className={'w-fit h-fit flex items-center justify-center relative'}
                                                  onMouseEnter={() => setIsHovered(index)}
                                                  onMouseLeave={() => setIsHovered(null)}
                                            >
                                                <img className={'w-full xl:h-[85px] h-[40px] lg:h-[60px] md:h-[50px] sm:h-[40px] rounded-md'} src={item.url}
                                                     onClick={() => handleMedia(index)}/>
                                                {(openSelectBarMenu || isHovered === index) && authUser._id === item.senderId &&
                                                    <section
                                                        className={`w-fit h-fit  flex items-center justify-center absolute right-1 top-1`}>
                                                        <input type="checkbox"  className={`checkbox [--chkbg:#00CAC2] [--chkfg:white] border-[1] border-customGreen`}
                                                               checked={selectedMessagesMenu.some(selMessage => selMessage.type === 'photos' && selMessage.messageId === item._id && selMessage.index === index) && selectedMessagesMenuShare.some(selMessage => selMessage.photo === item.url && selMessage.messageId === item._id && selMessage.index === index)}
                                                               onChange={() => handlePhotoCheckboxChange(item, item, index)}
                                                        />
                                                    </section>
                                                }
                                            </div> :
                                            <div key={index}
                                                 onMouseEnter={() => setIsHovered(index)}
                                                 onMouseLeave={() => setIsHovered(null)}
                                                 className={`   transition-all  duration-300 w-full   xl:h-[85px] h-[40px] lg:h-[60px] md:h-[50px] sm:h-[40px]   rounded-md flex item-end justify-center relative `}
                                            >

                                                {(openSelectBarMenu || isHovered === index)  && authUser._id === item.senderId &&
                                                    <section
                                                        className={`w-fit h-fit  flex items-center justify-center absolute right-1 top-1 z-50`}>
                                                        <input type="checkbox"  className={`checkbox [--chkbg:#00CAC2] [--chkfg:white] border-[1] border-customGreen`}
                                                               checked={selectedMessagesMenu.some(selMessage => selMessage.type === 'videos' && selMessage.messageId === item._id && selMessage.index === index) && selectedMessagesMenuShare.some(selMessage => selMessage.video === item.url && selMessage.messageId === item._id && selMessage.index === index)}
                                                               onChange={() => handleVideoCheckboxChange(item, item, index)}
                                                        />
                                                    </section>
                                                }

                                                <video
                                                    onClick={() => handleMedia(index)}
                                                    ref={el => videoRefs.current[index] = el}
                                                    className={'w-full h-full object-cover rounded-md'}>
                                                    <source src={item.url}/>
                                                </video>

                                                <section
                                                    className={'w-fit h-fit px-1 rounded-md  absolute bottom-1 bg-[rgba(0,0,0,0.5)] flex items-center justify-center'}>
                                                    <FaVideo
                                                        className={'text-white xl:text-[14px] lg:text-[12px] text-[8px] md:text-[10px] sm:text-[9px] mr-2 cursor-pointer transition transform-cpu'}/>
                                                    <p className={'text-white xl:text-[15px] lg:text-[13px] text-[10px] md:text-[12px] sm:text-[11px]'}>{durationObject && formatTime(durationObject[index])}</p>
                                                </section>
                                            </div>
                                    ))}
                                </div>
                                : <div className={'w-full h-full absolute top-0  left-0 flex items-center justify-center'}>
                                    <h2 className={'text-black text-sm  xl:text-md lg:text-md md:text-md sm:text-sm'}>No Media To Display</h2>
                                </div>}
                            {openSelectBarMenu && selectedMessagesMenu.length > 0 && selectedMessagesMenuShare.length > 0 &&
                                <section className={'w-full h-fit bg-[rgba(168,169,169,1)] absolute bottom-0 left-0 flex items-center justify-between'}>
                                    <div className={'w-fit h-fit flex items-center justify-center'}>
                                        <button
                                            onClick={handleDeleteMedia}
                                            className={` bg-transparent nextButton rounded-none  nj !static  xl:p-2 lg:p-1 md:p-[4px] sm:p-[3px]  ml-2`}>
                                            <RiDeleteBin6Line
                                                className={`text-black xl:text-xl lg:text-lg md:text-md sm:text-sm `}/>
                                        </button>
                                        <button
                                            onClick={handleShareMedia}
                                            className={`bg-transparent nextButton rounded-none  nj !static  xl:p-2 lg:p-1 md:p-[4px] sm:p-[3px]  ml-2`}>
                                            <FaRegShareFromSquare
                                                className={`text-black xl:text-xl lg:text-lg md:text-md sm:text-sm`}/>
                                        </button>
                                    </div>

                                    {showAll?<button
                                            onClick={() => {
                                                const filteredMedia = media.map((mediaItem,index) => {
                                                    if (mediaItem.senderId === authUser._id){
                                                        const isPhotos = fileExtensions.some((extens) => mediaItem.url.endsWith(extens));

                                                        return {
                                                            type:isPhotos?'photos':'videos',
                                                            messageId:mediaItem._id,
                                                            // index:mediaItem.index
                                                            index
                                                        }
                                                    }
                                                    return null
                                                }).filter((item) => item !== null && item !== undefined);
                                                setSelectedMessagesMenu(filteredMedia)
                                                setShowAll(false)


                                                const filteredMediaShare = media.map((mediaItem,index) => {
                                                    if (mediaItem.senderId === authUser._id){
                                                        const isPhotos = fileExtensions.some((extens) => mediaItem.url.endsWith(extens));

                                                       if(isPhotos){
                                                           return {
                                                               photo:mediaItem.url,
                                                               messageId:mediaItem._id,
                                                               // index:mediaItem.index
                                                               index
                                                           }
                                                       }else {
                                                           return {
                                                               video:mediaItem.url,
                                                               messageId:mediaItem._id,
                                                               // index:mediaItem.index
                                                               index
                                                           }
                                                       }
                                                    }
                                                    return null
                                                }).filter((item) => item !== null && item !== undefined);
                                                setSelectedMessagesMenuShare(filteredMediaShare)
                                            }}
                                            className={`bg-transparent nextButton rounded-none  nj !static  xl:p-2 lg:p-1 md:p-[4px] sm:p-[3px]  `}>
                                            <PiSelectionAllBold
                                                className={`text-black xl:text-xl lg:text-lg md:text-md sm:text-sm`}/>
                                        </button>
                                        :<button
                                            onClick={() => {
                                                setSelectedMessagesMenuShare([])
                                                setSelectedMessagesMenu([])
                                                setShowAll(true)
                                            }}
                                            className={`bg-transparent nextButton rounded-none  nj !static xl:p-2 lg:p-1 md:p-[4px] sm:p-[3px]  `}>
                                            <LiaUndoSolid
                                                className={`text-black xl:text-xl lg:text-lg md:text-md sm:text-sm `}/>
                                        </button>
                                    }

                                </section>}
                        </div>}
                        {active === 'links' && <div className={'w-full h-full pt-2 px-4 relative'}>
                            <h2 className={'text-black xl:text-lg lg:text-md text-sm md:text-md sm:text-sm mb-2'}>Links</h2>
                            <section className={'w-full h-[90%] overflow-auto '}>
                                {messages.map((message) => (
                                    (extractLinks(message.message.content).map((link) => (
                                        <div className={'w-full xl:h-[100px] lg:h-[70px] md:h-[50px] h-[40px] sm:h-[40px] mb-3 flex flex-col  '}>
                                           <a>{link}</a>
                                        </div>
                                    )))
                                ))}
                            </section>
                        </div>}
                    </section>
                </div>}
            </div> : <NoChatSelected/>}
            {selectedConversation ? <div className={'w-full h-fit absolute bottom-0 left-0'}>
                <MessageInput onChange={handleChange}/>
            </div> : null}



        </div>
    );
}

const NoChatSelected = () => {
    const {authUser} = useAuthContext()
    return (
        <div
            style={{
                backgroundSize: '100% 100%',
                backgroundImage: `url(https://img.freepik.com/premium-vector/speech-bubble-message-live-notification-icon-sign-symbol-concept-social-media-messages-3d-vector-illustration_38364-208.jpg)`
            }}
            className={'w-full h-[25%] xl:h-[60%] lg:h-[60%] md:h-[40%] sm:h-[40%] flex flex-col items-center justify-start '}>
            <h1 className={' text-sm xl:text-2xl lg:text-xl md:text-xl sm:text-lg text-black'}>Welcome 👋 {authUser.fullName}</h1>
            <h2 className={'text-sm xl:text-xl lg:text-lg md:text-lg sm:text-md mt-2 text-black'}>Start chatting now !</h2>
        </div>
    )
}


export default MessagesCenter;