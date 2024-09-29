import React, {useEffect, useRef, useState} from 'react';
import {RiEmojiStickerLine} from "react-icons/ri";
import {HiOutlinePhotograph} from "react-icons/hi";
import {FiPlayCircle} from "react-icons/fi";
import {CiLocationOn} from "react-icons/ci";
import {LuCalendarDays} from "react-icons/lu";
import {FaCheck} from "react-icons/fa";
import usePost from "../../hooks/usePost";
import {useAuthContext} from "../../context/useAuthContext";
import {IoClose} from "react-icons/io5";
import useListenMessages from "../../hooks/useListenMessages";
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import useListenPostUpdates from "../../hooks/useListenPostUpdates";
import {
    BigPlayButton,
    ControlBar,
    CurrentTimeDisplay,
    DurationDisplay, FullscreenToggle,
    Player,
    PlayToggle,
    TimeDivider,
    VolumeMenuButton
} from "video-react";
function PostShare({className1,className2}) {
    useListenPostUpdates()
    useListenMessages()
    const [showEmojiPicker,setShowEmojiPicker] = useState(false)
    const [content,setContent]=useState('')
    const [location,setLocation]=useState('')
    const [schedule,setSchedule]=useState('')
    const [blob,setBlob]=useState(null)
    const [blobVideo,setBlobVideo]=useState(null)
    const [photo,setPhoto]=useState('')
    const [video,setVideo]=useState('')
    const [openTab1,setOpenTab1]=useState(false)
    const [openTab2,setOpenTab2]=useState(false)
    const [sizesOfPhoto,setSizesOfPhoto] = useState({
        width:'',
        height:''
    })
    const [sizesOfVideo,setSizesOfVideo] = useState({
        width:'',
        height:''
    })
    const {authUser} = useAuthContext()
    const handleFileChange = (ev) => {
        const selectedFile = ev.target.files[0];
        if (selectedFile) {
            console.log("Selected file:", selectedFile.name);
            setPhoto(selectedFile);
            setBlob(URL.createObjectURL(selectedFile))
        }
    };
    const handleFileChange2 = (ev) => {
        const selectedFile = ev.target.files[0];
        if (selectedFile) {
            console.log("Selected file:", selectedFile.name);
            setVideo(selectedFile);
            setBlobVideo(URL.createObjectURL(selectedFile))
        }
    };
    const {post,loading} = usePost()

    const handleSubmit = async (ev)=>{
        ev.preventDefault()
        const formData = new FormData();
        formData.append('content',content)
        formData.append('location',location)
        formData.append('schedule',schedule)
        const sizes ={}
        if (photo) {
            sizes.photoSizes = sizesOfPhoto
            formData.append('photo', photo);
        }

        // Check if video file exists before appending
        if (video) {
            sizes.videoSizes = sizesOfVideo
            formData.append('video', video);
        }
        if (Object.keys(sizes).length > 0) {
            formData.append('sizes', JSON.stringify(sizes));
        }
        for (const pair of formData.entries()) {
            console.log(pair[0], pair[1]);
        }

        await  post(formData)
        setContent('')
        setSchedule('')
        setLocation('')
        setVideo('')
        setBlob('')
        setPhoto('')
        setBlobVideo('')
        setSizesOfVideo({
            width: '',
            height: ''
        })
        setSizesOfPhoto({
            width: '',
            height: ''
        })
    }


    const photoRef = useRef(null)
    const videoRef = useRef(null)

    useEffect(() => {
        const handleResize = () => {
            if (photoRef.current) {
                const widthOfPhoto = photoRef.current.offsetWidth
                const heightOfPhoto = photoRef.current.offsetHeight

                setSizesOfPhoto({
                    width:widthOfPhoto,
                    height:heightOfPhoto
                })
            }
            if (videoRef.current){
                const widthOfVideo = videoRef.current.offsetWidth
                const heightOfVideo = videoRef.current.offsetHeight

                setSizesOfVideo({
                    width: widthOfVideo,
                    height: heightOfVideo
                })
            }
        };

        const resizeObserver = new ResizeObserver(() => {
            handleResize();
        });

        if (photoRef.current) {
            resizeObserver.observe(photoRef.current);
        }

        if (videoRef.current) {
            resizeObserver.observe(videoRef.current);
        }

        handleResize();

        return () => {
            if (photoRef.current) {
                resizeObserver.unobserve(photoRef.current);
            }
            if (videoRef.current) {
                resizeObserver.unobserve(videoRef.current);
            }

        };
    }, [blob,blobVideo]);

    useEffect(() => {
        console.log('sizes of photo',sizesOfPhoto)
        console.log('sizes of video',sizesOfVideo)
    }, [sizesOfPhoto,sizesOfVideo]);


    const handleEmojiClick = (emoji) =>{
        setContent((prev)=>prev + emoji.native)
    }
    return (
        <div className={'w-full h-fit bg-[#FAFAFA] rounded-xl xl:p-3 lg:p-3 md:p-2 sm:p-2 p-1 flex  flex-col mb-5  '}>
            <div className={'w-full h-fit flex items-start justify-between'}>
                <section className={'xl:w-1/12 lg:w-1/12 md:w-1/12 sm:w-1/12 w-2/12  h-full flex items-start justify-start'}>
                    <img className={'xl:w-12 xl:h-12 lg:w-10 lg:h-10 md:w-10 md:h-10 sm:w-8 sm:h-8 w-7 h-7 rounded-full'} src={authUser.images.profileImage}/>
                </section>
                <form onSubmit={handleSubmit} className={'xl:w-11/12 lg:w-11/12 md:w-11/12 sm:w-11/12 w-10/12  h-full flex flex-col xl:pl-4 lg:pl-4 md:pl-4 sm:pl-3 pl-0 relative'}>
                    <div className={'n1 w-full h-fit flex items-center justify-between xl:mb-4 lg:mb-4 md:mb-3 sm:mb-2 mb-3'}>
                        <input
                            type={'text'}
                            placeholder={'What\'s happening (#add hashtags)'}
                            className={'input bg-customGray xl:w-[88%] lg:w-[88%] md:w-[88%] sm:w-[88%] w-[82%] xl:h-[45px] lg:h-[40px] md:h-[35px] sm:h-[30px] h-[25px] xl:text-[15px] md:text-[13px] sm:text-[11px] text-[8px]  focus:outline-none focus:border-1 focus:border-customGreen'}
                            value={content}
                            onChange={(ev) => setContent(ev.target.value)}
                        />
                        {showEmojiPicker ? <Picker   theme={'light'} data={data} onEmojiSelect={handleEmojiClick}

                        /> : null}
                        <button type={'button'} onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                className={'  hover:bg-yellow-500 xl:w-[10%] lg:w-[10%] md:w-[10%] sm:w-[10%] w-[16%] rounded-md flex items-center justify-center xl:h-[45px] lg:h-[40px] md:h-[35px] sm:h-[30px] h-[25px] bg-yellow-500 border-0 text-white xl:text-lg lg:text-lg md:text-md'}>
                            <RiEmojiStickerLine className={'xl:text-lg lg:text-lg md:text-md sm:text-sm text-[10px]'}/>
                        </button>
                    </div>
                    <div className={'xl:-ml-0 lg:-ml-0 md:-ml-0 sm:-ml-0 -ml-[30px] w-full h-fit flex items-center justify-between'}>
                        <label htmlFor={className1}>
                            <section className={'cursor-pointer flex items-center justify-start xl:mr-0 lg:mr-0 md:mr-0 sm:mr-0 mr-[2px] '}>
                                <HiOutlinePhotograph className={'text-[#659D74] xl:text-2xl lg:text-xl md:text-lg sm:text-sm text-[8px]'}/>
                                <p className={'ml-1 text-[#659D74] xl:text-md lg:text-md md:text-sm sm:text-[10px] text-[8px] font-[500]'}>Photo</p>
                                 <input
                                    key={photo?photo.name:'unique'}
                                    id={className1}
                                    style={{display: 'none'}}
                                    type={'file'}
                                    onChange={handleFileChange}
                                />
                            </section>
                        </label>
                        <label htmlFor={className2}>
                            <section className={'cursor-pointer flex items-center justify-start xl:mr-0 lg:mr-0 md:mr-0 sm:mr-0 mr-[2px]'}>
                                <FiPlayCircle className={'text-[#6C6C95] xl:text-2xl lg:text-xl md:text-lg sm:text-sm text-[8px]'}/>
                                <p className={'ml-1 text-[#6C6C95]  xl:text-md lg:text-md md:text-sm sm:text-[10px] text-[8px] font-[500]'}>Video</p>
                                <input
                                    key={video?video.name:'unique'}
                                    id={className2}
                                    style={{display: 'none'}}
                                    type={'file'}
                                    onChange={handleFileChange2}
                                />
                            </section>
                        </label>
                        <section onClick={() => {
                            setOpenTab1(!openTab1)
                            setOpenTab2(false)
                        }} className={'cursor-pointer flex items-center justify-start xl:mr-0 lg:mr-0 md:mr-0 sm:mr-0 mr-[2px]'}>
                            <CiLocationOn className={'xl:text-2xl lg:text-xl md:text-lg sm:text-sm text-[8px] text-[#C27977]'}/>
                            <p className={'ml-1 xl:text-md lg:text-md md:text-sm sm:text-[10px] text-[8px] font-[500] text-[#C27977]'}>Location</p>
                        </section>
                        <section onClick={() => {
                            setOpenTab2(!openTab2)
                            setOpenTab1(false)
                        }} className={'cursor-pointer flex items-center justify-start xl:mr-0 lg:mr-0 md:mr-0 sm:mr-0 mr-[2px]'}>
                            <LuCalendarDays className={'xl:text-2xl lg:text-xl md:text-lg  sm:text-sm text-[8px] text-[#CBB177]'}/>
                            <p className={'ml-1 xl:text-md lg:text-md md:text-sm  sm:text-[10px] text-[8px] font-[500] text-[#CBB177]'}>Schedule</p>
                        </section>
                        <button
                            className={'flex items-center justify-center rounded-md bg-gradient-to-r from-[rgba(0,234,151,1)]  to-[rgba(0,167,243,1)] border-none text-white xl:w-28 lg:w-24  md:w-24 sm:w-20 w-[70px]  h-[13px] xl:h-[40px] lg:h-[35px] md:h-[30px] sm:h-[27px]  xl:text-[15px] lg:text-[13px] md:text-[11px] sm:text-[10px] text-[7px] xl:px-0 lg:px-0 md:px-0 sm:px-0 px-1'}>
                            {loading ? <span className={'loading loading-spinner xl:loading-md lg:loading-md md:loading-md sm:loading-sm loading-xs text-primary'}></span> : 'Share'}
                        </button>
                    </div>
                </form>
            </div>
            {openTab1 ? <form onSubmit={(ev) => {
                ev.preventDefault()
                setOpenTab1(false)
            }} className={'mt-5 w-full flex items-center justify-between'}>
                <input
                    type={'text'}
                    className={' focus:outline-none focus:border-1 focus:border-customGreen input input-bordered w-[88%] xl:h-10 lg:h-9 md:h-8 sm:h-7 h-6 bg-[#EBEDEC] xl:text-[15px] lg:text-[13px] md:text-[11px] sm:text-[9px] text-[8px]'}
                    placeholder={'Where are you?'}
                    value={location}
                    onChange={(ev) => setLocation(ev.target.value)}
                />
                <button
                    className={'xl:btn lg:btn md:btn sm:btn flex items-center justify-center bg-gradient-to-r from-[rgba(0,234,151,1)] to-[rgba(0,167,243,1)] border-none text-white xl:btn-sm lg:btn-sm md:btn-sm sm:btn-sm xl:h-10 lg:h-9 md:h-8 sm:h-7 h-6 w-[10%] rounded-lg xl:text-[15px] lg:text-[13px] md:text-[11px] sm:text-[9px]  text-[8px]'}>
                    <FaCheck/>
                </button>
            </form> : null}
            {openTab2 ? <form className={'mt-5 w-full flex items-center justify-between'} onSubmit={(ev) => {
                ev.preventDefault()
                setOpenTab2(false)
            }}>
                <input
                    type={'date'}
                    className={' focus:outline-none focus:border-1 focus:border-customGreen input input-bordered w-[88%] xl:h-10 lg:h-9 md:h-8 sm:h-7 h-6 bg-[#EBEDEC] xl:text-[15px] lg:text-[13px] md:text-[11px] sm:text-[9px] text-[8px]'}
                    placeholder={'When is this?'}
                    value={schedule}
                    onChange={(ev) => setSchedule(ev.target.value)}
                />
                <button
                    className={'flex items-center justify-center xl:btn lg:btn md:btn sm:btn xl:btn-sm lg:btn-sm md:btn-sm sm:btn-sm bg-gradient-to-r from-[rgba(0,234,151,1)] to-[rgba(0,167,243,1)] border-none text-white  xl:h-10 lg:h-9 md:h-8 sm:h-7 h-6 w-[10%] rounded-lg xl:text-[15px] lg:text-[13px] md:text-[11px] sm:text-[9px] text-[8px]'}>
                    <FaCheck/></button>
            </form> : null}
            <div className={'w-full flex flex-col overflow-hidden '}>
                {blob && !blobVideo ? <div ref={photoRef}
                                           className={'relative w-full xl:h-80 lg:h-80 md:h-80 sm:h-80 h-52  rounded-lg mt-3 flex items-center justify-center max-w-full min-w-52 min-h-52  '}
                                           style={{resize: 'both', overflow: 'auto'}}>
                    <img src={blob} className={'w-full h-full'}/>
                    <IoClose className={'absolute top-3 right-3 text-gray-400 cursor-pointer text-lg'} onClick={()=>{
                        setPhoto('')
                        setBlob(null)
                    }} />

                </div> : null}
                {blobVideo && !blob ?
                    <div className={'relative w-full h-fit max-w-full xl:h-52 lg:h-52 md:h-48 sm:h-48  max-h-96 min-w-60 min-h-10 mt-3'} ref={videoRef}
                         style={{resize: 'horizontal', overflow: 'auto'}}>
                            <Player
                                autoPlay={true}
                                src={blobVideo}
                            >
                                <BigPlayButton position="center" />
                                <ControlBar autoHide={false}>
                                    <PlayToggle/>
                                    <VolumeMenuButton vertical/>
                                    <CurrentTimeDisplay/>
                                    <TimeDivider/>
                                    <DurationDisplay/>
                                    <FullscreenToggle/>
                                </ControlBar>
                            </Player>
                        <IoClose className={'absolute top-3 right-3 text-gray-400 cursor-pointer text-lg z-[999]'}
                                 onClick={() => {
                                     setVideo('')
                                     setBlobVideo(null)
                                 }}/>
                    </div> : null}
                {blobVideo && blob ? <div className={'w-full mt-3 h-fit flex items-start  justify-between'}>
                    <div ref={photoRef}
                         className={'relative w-[49%] xl:h-52 lg:h-52 md:h-48 sm:h-48 rounded-lg  flex items-center justify-center max-w-[49%] min-w-52 min-h-52  '}
                         style={{resize: 'both', overflow: 'auto'}}>
                        <img src={blob} className={'w-full h-full'}/>
                        <IoClose className={'absolute top-3 right-3 text-gray-400 cursor-pointer text-lg'}
                                 onClick={() => {
                                     setPhoto('')
                                     setBlob(null)
                        }} />
                    </div>
                    <div className={'relative   w-[49%] min-h-52 max-w-[49%] min-w-[49%]   '} ref={videoRef}
                         style={{resize: 'vertical', overflow: 'auto'}}>
                        {/*<video autoPlay={true} className={'w-full h-full rounded-lg'} controls>*/}
                        {/*    <source src={blobVideo}/>*/}
                        {/*</video>*/}
                        <Player
                            className={'w-full !h-full rounded-lg'}
                            autoPlay={true}
                            src={blobVideo}
                        >
                            <BigPlayButton position="center" />
                            <ControlBar autoHide={false}>
                                <PlayToggle/>
                                <VolumeMenuButton vertical/>
                                <CurrentTimeDisplay/>
                                <TimeDivider/>
                                <DurationDisplay/>
                                <FullscreenToggle/>
                            </ControlBar>
                        </Player>
                        <IoClose className={'absolute top-3 right-3 text-gray-400 cursor-pointer text-lg'} onClick={()=>{
                            setVideo('')
                            setBlobVideo(null)
                        }} />
                    </div>
                </div> : null}
                {content !== '' ? <h1 className={'text-black mt-2 font-lg xl:text-md lg:text-md md:text-sm sm:text-sm text-[10px]'}>{content}</h1> : null}
                {location !== '' ? <h1 className={' mt-2 font-lg flex text-[#C27977] xl:text-md lg:text-md md:text-sm sm:text-sm text-[10px]'}><CiLocationOn
                    className={'xl:text-2xl lg:text-xl md:text-lg sm:text-md text-sm text-[#C27977] mr-2'}/>{location}</h1> : null}
                {schedule !== '' ? <h1 className={' mt-2 font-lg flex text-[#CBB177] xl:text-md lg:text-md md:text-sm sm:text-sm text-[10px]'}><LuCalendarDays
                    className={'xl:text-2xl lg:text-xl md:text-lg sm:text-md text-sm text-[#CBB177] mr-2'}/>{schedule}</h1> : null}
            </div>
        </div>
    );
}

export default PostShare;