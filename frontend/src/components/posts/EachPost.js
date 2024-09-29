import React, {useEffect, useRef, useState} from 'react';
import {CiLocationOn} from "react-icons/ci";
import {PiHeart, PiHeartFill} from "react-icons/pi";
import {AiOutlineComment} from "react-icons/ai";
import {BsSend} from "react-icons/bs";
import useLikePost from "../../hooks/useLikePost";
import useUnLikePost from "../../hooks/useUnLikePost";
import {useAuthContext} from "../../context/useAuthContext";
import {IoClose} from "react-icons/io5";
import EachComment from "./eachComment";
import CommentInput from "./CommentInput";
import {usePostContext} from "../../context/usePostContext";
import {RiDeleteBin5Line} from "react-icons/ri";
import useRemovePost from "../../hooks/useRemovePost";
import useListenPostUpdates from "../../hooks/useListenPostUpdates";
import useRemoveFollower from "../../hooks/useRemoveFollower";
import useAddFollower from "../../hooks/useAddFollower";
import {Link} from "react-router-dom";
import VideoPlayer from "../../utils/VideoPlayer";
import ShareBarComponent from "../../utils/ShareBarComponent";

function EachPost({item,formattedDate}) {
    useListenPostUpdates()

    const [open,setOpen]=useState(false)
    const [openShareBar,setOpenShareBar]=useState(false)
    const messageRef = useRef()
    const {allPosts} = usePostContext()
    useEffect(() => {
        setTimeout(()=>{
            messageRef.current?.scrollIntoView({ behavior: "smooth" })
        },50)
    }, [allPosts]);
    const handleUpdate = () =>{
        setTimeout(()=>{
            messageRef.current?.scrollIntoView({ behavior: "smooth" })
        },50)
    }

    const {authUser} = useAuthContext()
    const {likePost} = useLikePost()
    const handleLikePost = async (postId) =>{
        await likePost(postId)
    }
    const {unLikePost} = useUnLikePost()
    const handleUnLikePost = async (postId) =>{
        await unLikePost(postId)
    }
    const {removePost} = useRemovePost()
    const handleRemovePost = async (postId) => {
        await removePost(postId)
    }
    const {removeFollower} = useRemoveFollower()
    const {addFollower} = useAddFollower()
    const handleFollow = async  (followerId) =>{
        await addFollower(followerId)

    }
    const handleUnFollow = async  (followerId) =>{
        await removeFollower(followerId)
    }
    const handleShare = () =>{
        setOpenShareBar(true)
    }
    const handleClose = () => {
        setOpenShareBar(false)
    }

    useEffect(() => {
        console.log(openShareBar,'this')
    }, [openShareBar,handleShare]);


    return (
        <div className={'w-full h-fit bg-[#FAFAFA] rounded-xl p-3 flex mb-5  flex-col items-start justify-start'}>
            {openShareBar? <ShareBarComponent message={null} post={item} onClick={handleClose} messages={null}  setOpenShareBar={setOpenShareBar} /> : null}

            <section className={'w-full mb-2 h-fit flex justify-start relative items-center'}>
                <Link to={item.userId._id === authUser._id ?'/profile':`/profile/${item.userId._id}`}>
                    <img className={'xl:w-12 xl:h-12 lg:w-10 lg:h-10 md:w-8 md:h-8 sm:w-7 sm:h-7 w-7 h-7 rounded-full mr-3'} src={item.userId.images.profileImage}/>
                </Link>
                <div className={'w-fit h-fit flex flex-col items-start justify-center'}>
                    <Link to={item.userId._id === authUser._id ?'/profile':`/profile/${item.userId._id}`}>
                <section  className={'w-full flex items-center justify-start'}>
                        <h1 className={'xl:text-lg lg:text-md md:text-md sm:text-sm text-[10px] text-black font-customTwo font-[400] mr-3'}>{item.userId.fullName}</h1>
                        <h2 className={'xl:text-md lg:text-md md:text-sm sm:text-sm hidden xl:block lg:block md:block sm:block  text-customGreen font-customTwo font-[400]'}>@{item.userId.username}</h2>
                    </section>
                    </Link>
                    <section className={'w-full flex items-center justify-start'}>
                        <p className={'text-gray-400 xl:text-md lg:text-md md:text-sm sm:text-[10px] text-[10px] font-[400] font-serif'}>{item.schedule ? formattedDate: 'Unknown' }</p>
                        {item.userId._id === authUser._id ? null : <div className={'ml-3 '}>
                            <button
                                onClick={() => authUser.arrays.followings.includes(item.userId._id) ? handleUnFollow(item.userId._id) : handleFollow(item.userId._id)}
                                className={` flex items-center justify-center   xl:h-8  xl:w-24 lg:h-8 lg:w-24 md:w-20 md:h-7 sm:w-14 sm:h-6 w-14 h-5 rounded-lg xl:text-[15px] lg:text-[13px] md:text-[11px] sm:text-[9px] text-[8px]
                                                ${authUser.arrays.followings.includes(item.userId._id) ? 'bg-transparent hover:text-white hover:border-none hover:bg-gradient-to-r from-[rgba(0,234,151,1)] to-[rgba(0,167,243,1)] text-customGreen border-2 border-customGreen' : 'text-white border-none bg-gradient-to-r from-[rgba(0,234,151,1)] to-[rgba(0,167,243,1)]'}
                                                `}>
                                {authUser.arrays.followings.includes(item.userId._id) ? "Unfollow" : "Follow"}
                            </button>
                        </div>}
                    </section>
                </div>
                <div className={'absolute top-0 xl:right-0 lg:right-0 md:right-0 sm:right-0 -right-1 flex items-center justify-center'}>
                    {item.location ? <div className={'flex items-center justify-center '}>
                        <h1 className={' font-lg flex text-[#C27977] xl:text-md lg:text-md md:text-sm sm:text-[10px] text-[9px] '}><CiLocationOn
                            className={'xl:text-2xl lg:text-xl md:text-lg sm:text-[10px] text-[10px] text-[#C27977] m-0 xl:mr-2 lg:mr-2 md:mr-1 sm:mr-1 mr-1 '}/>{item.location}</h1>
                    </div> : <div className={'flex items-center justify-center '}>
                        <h1 className={' font-lg flex text-[#C27977] xl:text-md lg:text-md md:text-sm sm:text-[10px] text-[9px] '}><CiLocationOn
                            className={'xl:text-2xl lg:text-xl md:text-lg sm:text-[10px] text-[10px] text-[#C27977] m-0 xl:mr-2 lg:mr-2 md:mr-1 sm:mr-1 mr-1 '}/>Unknown</h1>
                    </div>}
                    <RiDeleteBin5Line className={'m-0 text-customGreen xl:text-2xl lg:text-xl md:text-lg sm:text-md text-sm cursor-pointer xl:ml-5 lg:ml-5 md:ml-4 sm:ml-3 ml-2'}
                                      onClick={() => handleRemovePost(item._id)}/>

                </div>
            </section>
            {item.photo && !item.video ? <img className={'rounded-lg max-w-full'} style={{
                width: `${item.sizes.photoSizes.width}px`,
                height: `${item.sizes.photoSizes.height}px`
            }} src={item.photo}/> : null}
            {item.video && !item.photo ? <VideoPlayer  item={item}/> : null}
            {item.video && item.photo ? <div className={'flex items-start  justify-between'}>
                <img style={{
                    width: `${item.sizes.photoSizes.width}px`,
                    height: `${item.sizes.photoSizes.height}px`
                }} className={'mr-2 rounded-lg max-w-full'} src={item.photo}/>
                <VideoPlayer  item={item}/>
            </div> : null}
            <section className={'w-full flex items-center justify-start mt-5'}>
                {item.likes.includes(authUser._id) ?
                    <PiHeartFill className={'xl:text-[35px] lg:text-[30px] md:text-[25px] sm:text-[20px] text-[15px] cursor-pointer text-customGreen'}
                                 onClick={() => handleUnLikePost(item._id)}/> :
                    <PiHeart onClick={() => handleLikePost(item._id)}
                             className={'xl:text-[35px] lg:text-[30px] md:text-[25px] sm:text-[20px] text-[15px] cursor-pointer text-black'}/>}

                <div className="indicator ">
                    {item.comments.length > 0 ?
                        <span className=" xl:p-2 lg:p-2 md:p-2 sm:p-2 xl:w-fit lg:w-fit md:w-fit sm:w-fit xl:h-fit lg:h-fit md:h-fit sm:h-fit w-2 h-3 indicator-item badge border-none bg-[#00B7DE]  absolute xl:top-1 lg:top-1 md:top-1 sm:top-0 top-0 right-2 text-white flex items-center justify-center xl:text-md lg:text-md md:text-sm sm:text-[10px] text-[8px]">{item.comments.length}</span>:null}
                    <AiOutlineComment onClick={() => setOpen(true)}
                                      className={'xl:text-[35px] lg:text-[30px] md:text-[25px] sm:text-[20px] text-[15px] cursor-pointer text-black ml-3 relative'}/>
                </div>
                <BsSend onClick={handleShare} className={'xl:text-[30px] lg:text-[25px] md:text-[20px] sm:text-[15px] text-[12px] cursor-pointer text-black ml-3'}/>
            </section>
            <section className={'w-full flex mt-3 items-center justify-start'}>
                <p className={'text-gray-400 xl:text-md lg:text-md md:text-sm sm:text-sm text-[10px] '}>{item.likes.length} likes</p>
            </section>
            <p className={'text-black xl:text-[18px] lg:text-[15px] md:text-[13px] sm:text-[10px] text-[10px] mt-2'}>{item.content}</p>
            {open ?
                <div
                    className={'w-screen overflow-auto h-screen fixed flex items-center   justify-center bg-white/20 backdrop-blur-sm top-0 left-0 z-50'}>
                    <section className={'xl:w-[50%] rounded-md xl:h-[90%] lg:w-[60%] lg:h-[80%] md:w-[70%] md:h-[65%] sm:w-[70%] sm:h-[65%] w-[80%] h-[65%] px-6 py-4 pt-7 bg-white shadow-xl relative flex flex-col justify-between '}>
                        <IoClose className={'absolute top-3 right-3 text-gray-400 cursor-pointer xl:text-lg lg:text-lg md:text-md sm:text-sm text-sm'}
                                 onClick={() => setOpen(false)}/>
                        <div  className={'w-full h-[90%] flex flex-col items-center justify-start  overflow-auto'}>
                            {item.comments.length > 0 ?item.comments.map((item2,index) => (
                                <div className={'w-full h-fit'} ref={index===item.comments.length-1?messageRef:null} key={index}>
                                    <EachComment  message={item2} />
                                </div>
                            )):<p className={'text-black xl:text-lg lg:text-lg md:text-md sm:text-sm text-[10px] font-[500] '}>No comments yet !</p>}
                        </div>
                        <CommentInput  handleUpdate={handleUpdate} postId={item._id}/>
                    </section>
                </div>
            : null}


        </div>
    );
}

export default EachPost;