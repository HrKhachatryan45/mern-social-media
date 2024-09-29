import React, {useEffect, useRef, useState} from 'react';
import useGetMessages from "../../hooks/useGetMessages";
import Message from "./Message";
import useListenChatMessages from "../../hooks/useListenChatMessages";
import Carousel from "nuka-carousel";
import {FaAngleLeft, FaAngleRight, FaArrowLeftLong} from "react-icons/fa6";
import {
    BigPlayButton,
    ControlBar,
    CurrentTimeDisplay, DurationDisplay, FullscreenToggle,
    Player,
    PlayToggle,
    TimeDivider,
    VolumeMenuButton
} from "video-react";
import { easeCircle } from "d3-ease";
import {saveAs} from  'file-saver'
import {FaRegSmile} from "react-icons/fa";
import {FiDownload} from "react-icons/fi";
import {BiZoomIn, BiZoomOut} from "react-icons/bi";
import Draggable from "react-draggable";
import useAddReaction from "../../hooks/useAddReaction";
import {useAuthContext} from "../../context/useAuthContext";
import useDeleteReaction from "../../hooks/useDeleteReaction";
function Messages({isTyping,currentIndex2,openMedia2,selectedMessages,setOpenSelectBar,openSelectBar,setSelectedMessages,setSelectedMessagesShare,selectedMessagesShare}) {
    useListenChatMessages()
    const [openMedia,setOpenMedia] = useState(false)
    const currentImage = useRef(null)
    const {messages,loading} = useGetMessages()
    const [hoveredIndex,setHoveredIndex] = useState(null)
    const [replaceLeft,setReplaceLeft] = useState(0)
    const lastMessageRef = useRef();
    useEffect(() => {
        setTimeout(()=>{
            if (lastMessageRef.current){
                lastMessageRef.current?.scrollIntoView({behavior:'smooth',block:'end'})
            }
        },100)
    }, [messages,isTyping]);

    useEffect(() => {
        setCurrentIndex(currentIndex2)
        setOpenMedia(openMedia2)
    }, [currentIndex2,openMedia2]);

    const [currentIndex,setCurrentIndex] = useState(0);



    const handleMedia = (index) => {
        setOpenMedia(true)
        setCurrentIndex(index)
        console.log('index from Message',index)
    }
    const videoRefs = useRef([]);
    const mediaArray = messages.filter((item) => (item.hasOwnProperty('photos') && item.photos.length > 0) || (item.hasOwnProperty('videos') && item.videos.length > 0) && item._id );
    const [media,setMedia] = useState(mediaArray.map((item)=>{
        let final = []
        if (item.photos && item.photos.length > 0 && item._id ) {
            item.photos.map((photo,index)=>{
                final.push({url:photo.url,zoom:1,index,messageId:item._id,reactions:item.photos[index].reactions})
            })
        }
        if (item.videos && item.videos.length > 0 && item._id ) {
            item.videos.map((video,index)=>{
                final.push({url:video.url,index,messageId:item._id,reactions:item.videos[index].reactions})
            })
        }
        return  final
    }).flat())

    useEffect(() => {
        console.log(media,'media')
    }, [media]);

    const [durationObject,setDurationObject] = useState({})


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

    }, [mediaArray,durationObject]);


    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    useEffect(() => {
        console.log(currentIndex,'currentIndex')
    }, [currentIndex]);

    const handleSlide = (slideIndex) => {
        if (slideIndex !== currentIndex) {
            setCurrentIndex(slideIndex);
        }
    };

    const handleZoomIn = () => {
        setMedia((prevMedia) =>
            prevMedia.map((item, index) => {
                if (index === currentIndex && item.zoom < 3) {
                    return {
                        ...item,
                        zoom: parseFloat((item.zoom + 0.1).toFixed(1))
                    };
                } else {
                    return item;
                }
            })
        );
    };


    const handleZoomOut = () => {
        setMedia((prevMedia) =>
            prevMedia.map((item, index) => {
                if (index === currentIndex && item.zoom > 0.8) {
                    return {
                        ...item,
                        zoom: parseFloat((item.zoom - 0.1).toFixed(1))
                    };
                } else {
                    return item;
                }
            })
        );
    };

    const handleMouseEnter =(index) => {
        setHoveredIndex(index)
    }
    const handleMouseLeave = () => {
        // Update hoveredIndex only if currentIndex is not null
        if (currentIndex !== null) {
            setHoveredIndex(null);
        }
    };
    useEffect(() => {
        // Pause all video elements
        const videos = document.querySelectorAll('video');
        videos.forEach((video) => {
            if (video) {
                video.pause();
            }
        });
    }, [currentIndex]);


    const handleDownload = () => {
        const mediaToDownload = media[currentIndex]?.url
        const fileName = mediaToDownload.substring(mediaToDownload.lastIndexOf('/') + 1);
        saveAs(mediaToDownload,fileName)
    }

    const fileExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.webp', '.svg', '.ico', '.heic'];


    useEffect(() => {
        const updateSizes = () => {
            const rect = currentImage.current.getBoundingClientRect();
            setMedia((prevMedia) =>
                prevMedia.map((item, index) =>
                    index === currentIndex
                        ? { ...item, sizes: { width: rect.width, height: rect.height } }
                        : item
                )
            );
        };

        if (currentImage.current) {
            updateSizes();
        }
    }, [openMedia, currentIndex, currentImage]);



    useEffect(() => {


        const handleKeyPress = (event) => {
            const key =event.keyCode
            console.log(key,'key')
            if (key === 37 && currentIndex > 0 ) {
                setCurrentIndex((prevIndex) => prevIndex - 1)
                setReplaceLeft((prevLeft) => prevLeft + 50)
            }  if (key === 39  && currentIndex < media.length -1 ){
                setCurrentIndex((prevIndex) => prevIndex + 1)
                setReplaceLeft((prevLeft) => prevLeft - 50)
            }  if (key === 27) {
                setOpenMedia(false)
            }
        }


        window.addEventListener('keydown',handleKeyPress)

        return () => {
            window.removeEventListener('keydown',handleKeyPress)
        }
    }, [currentIndex,media.length]);

    const {addReaction} = useAddReaction()

    const handleAddReaction =async (reaction) => {
        const message = media[currentIndex]

        const isPhotos =  fileExtensions.some(extens => message.url.endsWith(extens))

        const type =isPhotos?'photos':'videos'
        await addReaction(reaction,message.messageId,type,message.index)
        setShowEmojiBar(false)
    }

    const {deleteReaction} = useDeleteReaction()


    const handleDeleteReaction = async (reactionType) => {
        const message = media[currentIndex]
        const isPhotos =  fileExtensions.some(extens => message.url.endsWith(extens))

        const reactionIndex = message.reactions.findIndex(
            reaction => reaction.senderId._id === authUser._id && reaction.reaction === reactionType
        );

        const type =isPhotos?'photos':'videos'

        await deleteReaction(message.messageId,type,message.index,reactionIndex)
    }


    const {authUser} =useAuthContext()

    const isReactionActive = (reactionType) => {
        const message = media[currentIndex]
        const reactions =  message.reactions
        return reactions.some(reaction => reaction.senderId._id === authUser._id && reaction.reaction === reactionType)
    }

    const [showEmojiBar,setShowEmojiBar] =useState(false)

    useEffect(() => {
        setShowEmojiBar(false)
    }, [currentIndex,openMedia]);

    // Add this useEffect hook to update media state when messages change
    useEffect(() => {
        const updatedMedia = mediaArray.map((item) => {
            let final = []
            if (item.photos && item.photos.length > 0 && item._id) {
                item.photos.forEach((photo, index) => {
                    final.push({ url: photo.url, zoom: 1, index, messageId: item._id, reactions: item.photos[index].reactions })
                })
            }
            if (item.videos && item.videos.length > 0 && item._id) {
                item.videos.forEach((video, index) => {
                    final.push({ url: video.url, index, messageId: item._id, reactions: item.videos[index].reactions })
                })
            }
            return final
        }).flat();
        setMedia(updatedMedia);
    }, [messages]); //



    return (
        <div className={`w-full h-full flex flex-col pt-3 ${loading?'items-center justify-center':''}`}>
            {loading?<span className={'loading loading-dots loading-lg text-customGreen'}></span> :   messages && messages.length > 0 && messages.map((message,index)=>{
                return (
                    <div ref={messages.length -1 === index ?lastMessageRef:null} key={message._id}>
                        <Message
                            onMedia={handleMedia}
                            media={media}
                            messages={messages}
                            message={message}
                            selectedMessagesShare={selectedMessagesShare}
                            setSelectedMessagesShare={setSelectedMessagesShare}
                            setSelectedMessages={setSelectedMessages}
                            openSelectBar={openSelectBar}
                            selectedMessages={selectedMessages}
                            setOpenSelectBar={setOpenSelectBar}
                            isTyping={index === messages.length - 1 ? isTyping :null }
                        />
                    </div>
            )})}
            {openMedia ? <div className={'w-full  h-screen fixed  top-0 left-0 z-50 bg-[#323A38] flex flex-col items-center justify-end pb-20 '}>
                <div className={'w-full z-50 h-[8%] px-2  absolute top-0 left-0 flex items-center justify-between'}>
                        <button onClick={() => {
                            setOpenMedia(false)
                            setReplaceLeft(0)
                        }} className={'nextButton !static  m-0'}>
                            <FaArrowLeftLong />
                        </button>
                    <section className={'w-fit   flex items-center justify-center'}>
                        {fileExtensions.some(extens => media[currentIndex]?.url.endsWith(extens))   && <div className={' border-r-[#5D5D5D] h-[20px] mr-1 pr-1  border-r-2 w-fit  flex items-center justify-center'}>
                            <button onClick={handleZoomIn}  className={`nextButton !static !m-0 ${media[currentIndex]?.zoom === 3 ?'isDisabled':''}`}>
                                <BiZoomIn />
                            </button>
                            <button onClick={handleZoomOut}     className={`nextButton !static !m-0 ${media[currentIndex]?.zoom === 0.8?'isDisabled':''}`}>
                                <BiZoomOut />
                            </button>
                        </div>
                        }
                        <div className={'relative w-fit h-fit '}>
                            <button onClick={() => setShowEmojiBar(!showEmojiBar)} className={'nextButton !static  !m-0  '}>
                                <FaRegSmile/>
                            </button>
                            {showEmojiBar &&  <div
                                className={'w-fit h-fit xl:py-2 lg:py-2 md:py-1 sm:py-1 py-[6px] xl:px-3 lg:px-2 md:px-2 sm:px-1 px-[6px] absolute top-8 right-2 bg-[#303030] rounded-3xl  flex items-center justify-center'}>
                                <section
                                    className={`xl:w-9 xl:h-9 lg:w-8 l:h-8 md:h-6 md:w-6 sm:w-5 sm:h-5 h-4 w-4  flex items-center justify-center cursor-pointer rounded-full hover:bg-cyan-400 ${isReactionActive('👍') ? 'bg-cyan-400' : ''} `}
                                    onClick={() => isReactionActive('👍')?handleDeleteReaction('👍'):handleAddReaction('👍')}>
                                    <h2 className={'m-0 xl:text-xl lg:text-lg md:text-md sm:text-sm text-[10px]'}>👍</h2>
                                </section>
                                <section
                                    className={`xl:w-9 xl:h-9 lg:w-8 l:h-8 md:h-6 md:w-6 sm:w-5 sm:h-5 h-4 w-4  flex items-center justify-center cursor-pointer rounded-full hover:bg-cyan-400 ${isReactionActive('❤️') ? 'bg-cyan-400' : ''} `}
                                    onClick={() => isReactionActive('❤️')?handleDeleteReaction('❤️'):handleAddReaction('❤️')}>
                                    <h2 className={'m-0 xl:text-xl lg:text-lg md:text-md sm:text-sm text-[10px]'}> ❤️</h2>
                                </section>
                                <section
                                    className={`xl:w-9 xl:h-9 lg:w-8 l:h-8 md:h-6 md:w-6 sm:w-5 sm:h-5 h-4 w-4  flex items-center justify-center cursor-pointer rounded-full hover:bg-cyan-400 ${isReactionActive('😂') ? 'bg-cyan-400' : ''} `}
                                    onClick={() => isReactionActive('😂')?handleDeleteReaction('😂'):handleAddReaction('😂')}>
                                    <h2 className={'m-0 xl:text-xl lg:text-lg md:text-md sm:text-sm text-[10px]'}>😂</h2>
                                </section>
                                <section
                                    className={`m-0 xl:w-9 xl:h-9 lg:w-8 l:h-8 md:h-6 md:w-6 sm:w-5 sm:h-5 h-4 w-4  flex items-center justify-center cursor-pointer rounded-full hover:bg-cyan-400 ${isReactionActive('😮') ? 'bg-cyan-400' : ''} `}
                                    onClick={() => isReactionActive('😮')?handleDeleteReaction('😮'):handleAddReaction('😮')}>
                                <h2 className={'xl:text-xl lg:text-lg md:text-md sm:text-sm text-[10px]'}>😮</h2>
                                </section>
                                <section
                                    className={`m-0 xl:w-9 xl:h-9 lg:w-8 l:h-8 md:h-6 md:w-6 sm:w-5 sm:h-5 h-4 w-4  flex items-center justify-center cursor-pointer rounded-full hover:bg-cyan-400 ${isReactionActive('😢') ? 'bg-cyan-400' : ''} `}
                                    onClick={() => isReactionActive('😢')?handleDeleteReaction('😢'):handleAddReaction('😢')}>
                                <h2 className={'xl:text-xl lg:text-lg md:text-md sm:text-sm text-[10px]'}>😢</h2>
                                </section>
                                <section
                                    className={`m-0 xl:w-9 xl:h-9 lg:w-8 l:h-8 md:h-6 md:w-6 sm:w-5 sm:h-5 h-4 w-4  flex items-center justify-center cursor-pointer rounded-full hover:bg-cyan-400 ${isReactionActive('🙏') ? 'bg-cyan-400' : ''} `}
                                    onClick={() => isReactionActive('🙏')?handleDeleteReaction('🙏'):handleAddReaction('🙏')}>

                                    <h2 className={'xl:text-xl lg:text-lg md:text-md sm:text-sm text-[10px]'}>🙏</h2>
                                </section>
                            </div>}
                        </div>
                        <button className={'nextButton !static !m-0 '}>
                            <FiDownload onClick={handleDownload}/>
                        </button>
                    </section>
                </div>
                <div className={'w-full h-[90%] !static  flex flex-col items-center justify-center '}>
                    <Carousel
                        animation={'fade'}
                        easing={easeCircle}
                        defaultControlsConfig={{
                            nextButtonText: <FaAngleRight/>,
                            prevButtonText: <FaAngleLeft/>,
                            nextButtonClassName: 'nextButton',
                            prevButtonClassName: 'prevButton',
                            pagingDotsStyle: {display: 'none'},
                            nextButtonStyle: currentIndex === mediaArray.length - 1 ? {display: 'none'} : null,
                            prevButtonStyle: currentIndex === 0 ? {display: 'none'} : null
                        }}
                        dragging={false}
                        slideIndex={currentIndex}
                        slidesToShow={1}
                        style={{height: '500px'}}
                        className={' items-center'}
                        wrapAround={false}
                        afterSlide={handleSlide}
                        renderCenterLeftControls={({previousSlide}) => (
                            currentIndex === 0 ? null :
                                <button onClick={() => {
                                    previousSlide()
                                    setReplaceLeft((prev) => prev + 50)
                                }} className={'prevButton'}>
                                    <FaAngleLeft/>
                                </button>
                        )}
                        renderCenterRightControls={({nextSlide}) => (
                            currentIndex === media.length - 1 ? null :
                                <button onClick={() => {
                                    nextSlide()
                                    setReplaceLeft((prev) => prev - 50)
                                }} className={'nextButton'}>
                                    <FaAngleRight/>
                                </button>
                        )}
                    >
                        {media.map((item, index) => (
                            fileExtensions.some(extens => item.url.endsWith(extens)) ?
                                item.zoom > 2 ? <Draggable>
                                    <div className={`handle cursor-grab`}>
                                        <img
                                            style={currentImage.current ? {transform: `scale(${item.zoom})`} : null}
                                            className={` xl:max-w-[85%] xl:max-h-[100%]  lg:max-w-[85%] lg:max-h-[100%] md:max-w-[85%] md:max-h-[85%]`}
                                            key={index}
                                            ref={currentIndex === index ? currentImage : null}
                                            src={item.url}
                                            alt="Media"

                                        />
                                    </div>
                                </Draggable> : <img
                                    style={currentImage.current ? {transform: `scale(${item.zoom})`} : null}
                                    className={` xl:max-w-[85%] xl:max-h-[100%]  lg:max-w-[85%] lg:max-h-[100%] md:max-w-[85%] md:max-h-[85%] sm:max-w-[85%] sm:max-h-[85%] max-w-[85%] max-h-[85%]  cursor-pointer`}
                                    key={index}
                                    ref={currentIndex === index ? currentImage : null}
                                    src={item.url}
                                    alt="Media"

                                />
                                :
                                <div key={index}
                                     className={'  xl:w-[66%] xl:h-[80%]  lg:w-[66%] lg:h-[80%]  md:w-[66%] md:h-[80%] sm:w-[66%] sm:h-[80%] w-[66%] h-[80%] rounded-lg flex items-center justify-center'}><Player
                                    playsInline
                                    src={item.url}
                                    style={{height: '100%'}}
                                >
                                    <BigPlayButton position="center"/>
                                    <ControlBar autoHide={false}>
                                        <PlayToggle/>
                                        <VolumeMenuButton horizontal/>
                                        <CurrentTimeDisplay/>
                                        <TimeDivider/>
                                        <DurationDisplay/>
                                        <FullscreenToggle/>
                                    </ControlBar>
                                </Player>
                                </div>
                        ))}
                    </Carousel>
                </div>
                <div style={{marginLeft: `${replaceLeft}px`}}
                     className={`w-fit absolute bottom-2    h-fit flex items-center justify-center overflow-x-auto py-1 px-1`}>
                    {media.map((item, index) => (
                        fileExtensions.some(extens => item.url.endsWith(extens)) ?
                            <section
                                onMouseEnter={() => handleMouseEnter(index)}
                                    onMouseLeave={handleMouseLeave}
                                    onClick={() => {
                                        const diff = index - currentIndex;
                                        setCurrentIndex(index)
                                        setReplaceLeft((prev) => prev - (diff * 50));
                                    }}
                                    className={`cursor-pointer hover:outline-customGreenBorder  transition-all  duration-300 xl:w-[50px] xl:h-[50px] lg:w-[45px] lg:h-[45px] md:w-[40px] md:h-[40px] sm:h-[35px] sm:w-[35px] w-[32px] h-[32px]   rounded-md mr-2 relative outline-2 outline ${currentIndex === index || hoveredIndex === index ? ' outline-customGreenBorder' : 'video-container  outline-transparent'}`}>
                                    <img key={index} src={item.url}
                                         className={`w-full h-full  rounded-md `}
                                         alt="Media"/>
                                </section>
                            :
                            <div onClick={() => {
                                const diff = index - currentIndex;
                                setCurrentIndex(index)
                                setReplaceLeft((prev) => prev - (diff * 50));
                            }} key={index}
                                 onMouseEnter={() => handleMouseEnter(index)}
                                 onMouseLeave={handleMouseLeave}
                                 className={`cursor-pointer hover:outline-customGreenBorder  transition-all  duration-300 outline-2 outline  ${currentIndex === index || hoveredIndex === index ? ' outline-customGreenBorder' : 'video-container outline-transparent'} xl:w-[50px] xl:h-[50px] lg:w-[45px] lg:h-[45px] md:w-[40px] md:h-[40px] sm:h-[35px] sm:w-[35px]  w-[32px] h-[32px]   mr-2 rounded-md flex item-end justify-center relative `}>
                                <video ref={el => videoRefs.current[index] = el}
                                       className={'w-full h-full object-cover rounded-md'}>
                                    <source src={item.url}/>
                                </video>
                                <section
                                    className={'w-fit h-fit px-1 rounded-md  absolute bottom-1 bg-[rgba(0,0,0,0.5)] flex items-center justify-center'}>
                                    <p className={'text-white xl:text-[10px] lg:text-[9px] md:text-[9px] sm:text-[8px] text-[7px]'}>{durationObject && formatTime(durationObject[index])}</p>
                                </section>
                            </div>
                    ))}
                </div>
            </div> : null}
        </div>
    );
}


export default Messages;