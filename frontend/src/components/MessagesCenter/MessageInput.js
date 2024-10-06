import React, { useEffect, useRef, useState } from 'react';
import { IoIosSend } from 'react-icons/io';
import { FaRegFaceSmileBeam } from 'react-icons/fa6';
import {FaMicrophone, FaMicrophoneSlash, FaPause, FaPlay, FaWindowClose} from 'react-icons/fa';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { useAudioRecorder } from 'react-audio-voice-recorder';
import {IoClose} from "react-icons/io5";
import useSendMessage from "../../hooks/useSendMessage";
import {useAuthContext} from "../../context/useAuthContext";
import {useSocketContext} from "../../context/useSocketContext";
import {useConversationContext} from "../../context/useConversationContext";
import {toast} from "react-toastify";
import {CgAttachment} from "react-icons/cg";

function MessageInput({onChange}) {
    const [show,setShow] = useState(true)
    const [message, setMessage] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [photos, setPhotos] = useState([]);
    const [photosBlob, setPhotosBlob] = useState([]);
    const [videos, setVideos] = useState([]);
    const audioRef = useRef(null);
    const [audioFile, setAudioFile] = useState(null);
    const [videosBlob, setVideosBlob] = useState([]);
    const [isPlaying,setIsPlaying] = useState(false)
    const {
        startRecording,
        stopRecording,
        togglePauseResume,
        recordingBlob,
        isRecording,
        isPaused,
        recordingTime,
    } = useAudioRecorder();
    const [audioDuration, setAudioDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    const {authUser} = useAuthContext()
    const timeOutRef= useRef(null)

    const handleProgressClick = (e) => {
       if (audioDuration === Infinity){
           return
       }else {
           const progressBar = e.currentTarget;
           const rect = progressBar.getBoundingClientRect();
           const offsetX = e.clientX - rect.left;
           const newTime = (offsetX / progressBar.offsetWidth) * audioDuration;
           audioRef.current.currentTime = newTime;
           setCurrentTime(newTime);
       }
    };


    const {selectedConversation} = useConversationContext()
    const [showMic,setShowMic] = useState(true)
    const handleEmojiClick = emoji => {
       handleTyping()
        setMessage(prev => prev + emoji.native);
    };

    const handlePhotoChange = (ev) => {
       handleTyping()
        const files = ev.target.files;
        const totalPhotos = photosBlob.length + Array.from(files).filter(file => file.type.split('/')[0] === 'image').length;
        const totalVideos = videosBlob.length + Array.from(files).filter(file => file.type.split('/')[0] === 'video').length;

        setShowMic(false)

        if (totalPhotos > 3) {
            toast.warn('Photos can\'t be more than 3')
        }else  if (totalVideos > 3){
            toast.warn('Videos can\'t be more than 3')
        }

        else {

           Array.from(files).map((file) => {
               const fileType = file.type.split('/')[0]; // Get the file type (e.g., 'image', 'video')
               if (fileType === 'image') {
                   setPhotos((prevPhotos) => [...prevPhotos, file])
                   setPhotosBlob((prevBlobs) => [...prevBlobs, URL.createObjectURL(file)])
               } else if (fileType === 'video') {
                   setVideos((prevVideos) => [...prevVideos, file])
                   setVideosBlob((prevBlobs) => [...prevBlobs, URL.createObjectURL(file)])
               } else {
                   // Handle unsupported file types
                   console.error('Unsupported file type');
               }
           })
       }

    };



    const [audioUrl, setAudioUrl] = useState(null);

    useEffect(() => {
        if (recordingBlob) {
            setAudioUrl(URL.createObjectURL(recordingBlob));
        }
    }, [recordingBlob]);

    useEffect(() => {
        const audioElement = document.getElementById('audio');
        if (audioElement) {
            audioElement.volume = 1;
        }
    }, [audioUrl]);

    const {sendMessage,loading} = useSendMessage()


    const handleAudioLoaded = () => {
        const audioElement = audioRef.current;
        if (audioElement) {
            const audioSrc = audioElement.currentSrc; // Get audio source URL
            fetch(audioSrc)
                .then((res) => res.blob())
                .then((blob) => setAudioFile(blob)); // Set audio file in state
        }
    };


    useEffect(() => {
        console.log(photos,'photos')
        console.log(videos,'videos')
    }, [photos,videos]);


    const handleSubmit = async (ev) => {
        ev.preventDefault()
        const formData = new FormData()

        if (message){
            formData.append('message',message)
        }
        if (audioFile){
            formData.append('audio',audioFile)
        }

        // if (photos){
        //     formData.append('photos',photos)
        // }
        // if (videos){
        //     formData.append('videos',videos)
        // }
        photos.forEach((photo) => {
            formData.append('photos', photo);
        });
        videos.forEach((video) => {
            formData.append('videos', video);
        });

        onChange(false)
        await sendMessage(formData)

        setVideos([])
        setVideosBlob([])
        setPhotos([])
        setPhotosBlob([])
        setMessage('')
        setAudioFile(null)
        setAudioUrl(null)
        setShow(true)
        setShowMic(true)
    }

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
    }, [audioUrl]);


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


    const {socket} = useSocketContext()
    // const [isTyping,setIsTyping] = useState(false);
    const handleTyping = () => {
        // Emit startTyping event
        const senderId = authUser._id;
        const receiverId = selectedConversation._id;
        socket.emit('typing', { senderId, receiverId });

        // Clear previous typing timeout
        clearTimeout(timeOutRef.current);

        // Set new typing timeout
        timeOutRef.current = setTimeout(() => {
            socket.emit('untyping', { receiverId });
        }, 2500); // Adjust the timeout duration as needed

    };

    useEffect(() => {
            if (!socket) return;
            socket.on('userTyping',(senderId)=>{
                if (selectedConversation._id === senderId){
                    onChange(true)
                }else{
                    onChange(false)
                }
            })
        socket.on('userUnTyping',()=>{
            onChange(false)
        })
        return () => {
                socket.off('userTyping');
                socket.off('userUnTyping');
                clearTimeout(timeOutRef.current);
        }
    }, [socket]);





    return (
        <form onSubmit={handleSubmit} className={'w-full bg-gray-400 xl:h-16 lg:h-16 md:h-16 sm:h-16 h-12 flex items-center relative justify-between xl:px-3 lg:px-3 md:px-3 sm:px-3 px-1'}>
            {photosBlob.length > 0  && !audioUrl && videosBlob.length === 0 &&
                <div className={'w-full h-fit flex items-center justify-start py-2 bg-[rgba(0,0,0,0.2)] absolute -top-[86px] left-0'}>
                    { photosBlob.map((photoBlob)=> (
                        <section className={'w-fit h-fit relative ml-2'}>
                            <img className={'w-[70px] h-[70px] rounded-lg'} src={photoBlob}/>
                            <IoClose
                                className={'absolute top-1 right-1 text-red-500 cursor-pointer text-lg'}
                                onClick={() => {
                                    setPhotosBlob((prevBlob)=> prevBlob.filter(eachBlob=> eachBlob !== photoBlob))
                                    if (photosBlob.length === 1) {
                                        setShowMic(true)
                                    }
                                }}/>
                        </section>
            ))}
                    <FaWindowClose className={'text-xl absolute right-2 top-1 text-black cursor-pointer'} onClick={()=>{
                        setVideos([])
                        setVideosBlob([])
                        setPhotosBlob([])
                        setPhotos([])
                        setAudioUrl(null)
                        setAudioFile(null)
                        setShowMic(true)
                    }} />
                </div>
                }
            {audioUrl && photosBlob.length === 0 && videosBlob.length === 0 && (
                <div className={'w-full h-fit py-3 bg-[rgba(0,0,0,0.2)] absolute -top-[64px] left-0'}>
                    <div className={'w-4/5 pl-3    h-fit flex items-center '}>
                        <IoClose
                            className={'absolute top-0 left-0 text-red-500 cursor-pointer text-lg'}
                            onClick={() => {
                                setAudioUrl(null)
                                setAudioFile(null)
                                setAudioDuration(0)
                                setShowMic(true)
                                setShow(true)
                                setCurrentTime(0)
                            }}/>
                        <img src={authUser.images.profileImage} alt="User" className="w-10 h-10 rounded-full mr-2"/>
                        <button type="button" onClick={handleAudioPlayPause} className="mr-2">
                            {isPlaying ? <FaPause className="text-xl text-customGreen"/> :
                                <FaPlay className="text-xl text-customGreen"/>}
                        </button>
                        <audio
                            ref={audioRef}
                            src={audioUrl}
                            onLoadedData={handleAudioLoaded}
                            preload={'metadata'}
                            onDurationChange={(ev) => setAudioDuration(ev.currentTarget.duration)}
                            hidden
                        />
                        <div onClick={handleProgressClick} className="flex-1 h-2 bg-white rounded-full overflow-hidden relative">
                            <div className="absolute top-0 left-0 h-2 bg-customGreen"
                                 style={{width: `${(currentTime / audioDuration) * 100}%`}}>
                            </div>
                        </div>
                        <span
                            className="ml-2 text-white">{formatTime(currentTime)} {audioDuration !== Infinity && '/' + formatTime(audioDuration)}</span>
                    </div>
                    <FaWindowClose className={'text-xl absolute right-2 top-1 text-black cursor-pointer'} onClick={()=>{
                        setVideos([])
                        setVideosBlob([])
                        setPhotosBlob([])
                        setPhotos([])
                        setAudioUrl(null)
                        setAudioFile(null)
                        setShow(true)
                        setShowMic(true)
                    }} />
                </div>
            )}
            {videosBlob.length > 0 && !audioUrl && photosBlob.length === 0 &&
                <div
                    className={'w-full h-fit flex items-center justify-start py-2 bg-[rgba(0,0,0,0.2)] absolute -top-[86px] left-0'}>
                    {videosBlob.map((videoBlob) => (
                        <section className={'w-fit h-fit relative ml-2'}>
                            <video    className={'w-[120px] h-[70px] rounded-lg'}>
                                <source src={videoBlob}/>
                            </video>
                            <IoClose
                                className={'absolute top-1 right-1 text-red-500 cursor-pointer text-lg'}
                                onClick={() => {
                                    if (videosBlob.length === 1) {
                                        setShowMic(true)
                                    }
                                    setVideosBlob((prevBlob) => prevBlob.filter(eachBlob => eachBlob !== videoBlob))
                                }}/>
                        </section>
                    ))}
                    <FaWindowClose className={'text-xl absolute right-2 top-1 text-black cursor-pointer'} onClick={()=>{
                        setVideos([])
                        setVideosBlob([])
                        setPhotosBlob([])
                        setPhotos([])
                        setAudioUrl(null)
                        setAudioFile(null)
                        setShowMic(true)
                    }} />
                </div>
            }
            {photosBlob.length > 0 && videosBlob.length > 0  && !audioUrl &&
                <div className={'w-full flex items-center justify-start  h-fit py-1 bg-[rgba(0,0,0,0.2)] absolute -top-[78px] left-0'}>
                    { photosBlob.map((photoBlob)=> (
                        <section className={'w-fit h-fit relative ml-2'}>
                            <img className={'w-[70px] h-[70px] rounded-lg'} src={photoBlob}/>
                            <IoClose
                                className={'absolute top-1 right-1 text-red-500 cursor-pointer text-lg'}
                                onClick={() => {
                                    setPhotosBlob((prevBlob)=> prevBlob.filter(eachBlob=> eachBlob !== photoBlob))
                                    if (photosBlob.length === 1 && videosBlob.length === 0) {
                                        setShowMic(true)
                                    }
                                }}/>
                        </section>
                    ))}
                    {videosBlob.map((videoBlob) => (
                        <section className={'w-fit h-fit relative ml-2'}>
                            <video    className={'w-[120px] h-[70px] rounded-lg'}>
                                <source src={videoBlob}/>
                            </video>
                            <IoClose
                                className={'absolute top-1 right-1 text-red-500 cursor-pointer text-lg'}
                                onClick={() => {
                                    if (videos.length === 1 && photosBlob.length === 0) {
                                        setShowMic(true)
                                    }
                                    setVideosBlob((prevBlob) => prevBlob.filter(eachBlob => eachBlob !== videoBlob))
                                }}/>
                        </section>
                    ))}
                    <FaWindowClose className={'text-xl absolute right-2 top-1 text-black cursor-pointer'} onClick={()=>{
                        setVideos([])
                        setVideosBlob([])
                        setPhotosBlob([])
                        setPhotos([])
                        setAudioUrl(null)
                        setAudioFile(null)
                        setShowMic(true)
                    }} />
                </div>
            }

            <section className={'xl:w-[90%] lg:w-[90%] md:w-[90%] sm:w-[90%] w-[83%] h-[70%] border-red-500 relative'}>
                <input
                    type={'text'}
                    value={message}
                    onChange={ev => {
                        setMessage(ev.target.value)
                        handleTyping()
                    }}
                    placeholder={'Write your message...'}
                    className={'w-full h-full bg-white input rounded-none xl:pr-32 lg:pr-32 md:pr-32 sm:pr-32 pr-14 xl:text-md lg:text-sm md:text-sm sm:text-sm text-[10px]'}
                />
                <div className={'w-fit h-full n2 flex items-center justify-center absolute right-0 top-0 '}>
                    {showEmojiPicker ? <Picker theme={'light'} data={data} onEmojiSelect={handleEmojiClick}/> : null}
                    {show ? <label htmlFor={'input02'}>
                            <CgAttachment  className={'xl:mr-4 lg:mr-4 md:mr-4 sm:mr-4 mr-2  text-customGreen text-[11px] xl:text-xl lg:text-lg md:text-md sm:text-sm cursor-pointer'}/>
                        </label>:null}
                    <FaRegFaceSmileBeam onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                        className={'xl:mr-4 lg:mr-4 md:mr-4 sm:mr-4 mr-2  text-customGreen text-[11px] xl:text-xl lg:text-lg md:text-md sm:text-sm cursor-pointer'}/>
                    {isRecording ?
                        (
                            <div className={'flex items-center justify-center mr-2'}>
                                {!isPaused && isRecording && (
                                    <span className={'loading loading-bars loading-xs text-red-500 mr-3'}></span>
                                )}
                                <sub className={'xl:text-sm lg:text-sm md:text-sm sm:text-sm text-[10px] xl:mr-0 lg:mr-0 md:mr-0 sm:mr-0 mr-[2px]'}>{formatTime(recordingTime)}</sub>
                                <FaMicrophoneSlash onClick={() => {
                                    stopRecording()
                                    setIsPlaying(false)
                                    handleTyping()
                                }} className={'xl:mr-3 lg:mr-3 md:mr-3 sm:mr-3 mr-1  text-red-500 text-[11px] xl:text-xl lg:text-lg md:text-md sm:text-sm cursor-pointer'}/>
                                {isPaused ? <FaPlay className={'text-[11px] xl:text-md lg:text-md md:text-md sm:text-sm cursor-pointer text-grey-400'}
                                                    onClick={() => {
                                                        handleTyping()
                                                        togglePauseResume()
                                                    }}/> :
                                    <FaPause className={'text-[11px] xl:text-md lg:text-md md:text-md sm:text-sm cursor-pointer text-grey-400'} onClick={() => {
                                        handleTyping()
                                        togglePauseResume()
                                    }}/>}
                            </div>
                        )
                        : (showMic?
                            <FaMicrophone onClick={() => {
                            startRecording()
                            setAudioUrl(null)
                            setAudioFile(null)
                            setAudioDuration(0)
                            setCurrentTime(0)
                            handleTyping()
                            setShow(false)
                        }} className={'xl:mr-4 lg:mr-4 md:mr-4 sm:mr-4 mr-1 text-customGreen text-[11px] xl:text-xl lg:text-lg md:text-md sm:text-sm cursor-pointer'} />
                            :null)}
                    <input type={'file'} id={'input02'} onChange={handlePhotoChange} multiple style={{ display: 'none' }} />
                </div>
            </section>
            <button className={' bg-gradient-to-r flex justify-center items-center from-[rgba(0,234,151,1)] to-[rgba(0,167,243,1)] border-none sm:ml-1 text-white xl:w-12 xl:h-12 lg:h-10 lg:w-10 md:w-10 md:h-10 sm:w-10 sm:h-10 w-8 h-8 rounded-full '}>
                {loading ?  <span className={'loading loading-spinner'}></span>:<IoIosSend className={'xl:text-2xl lg:text-xl md:text-lg sm:text-md text-md text-white'} />}
            </button>

        </form>
    );
}

export default MessageInput;
