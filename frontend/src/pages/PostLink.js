import React, { useEffect, useRef, useState } from 'react';
import {Link, useLocation, useParams} from 'react-router-dom';
import useGetPostLink from '../hooks/useGetPostLink';
import { CiLocationOn } from 'react-icons/ci';
import { RiDeleteBin5Line } from 'react-icons/ri';
import VideoPlayer from '../utils/VideoPlayer';
import { PiHeart, PiHeartFill } from 'react-icons/pi';
import { AiOutlineComment } from 'react-icons/ai';
import { BsSend } from 'react-icons/bs';
import useLikePost from '../hooks/useLikePost';
import useUnLikePost from '../hooks/useUnLikePost';
import useRemovePost from '../hooks/useRemovePost';
import useRemoveFollower from '../hooks/useRemoveFollower';
import useAddFollower from '../hooks/useAddFollower';
import ShareBarComponent from '../utils/ShareBarComponent';
import { IoClose } from 'react-icons/io5';
import EachComment from '../components/posts/eachComment';
import CommentInput from '../components/posts/CommentInput';
import { useAuthContext } from '../context/useAuthContext';
import ProfileRight from "../components/profileRight/ProfileRight";
import TrendCard from "../components/profileRight/TrendCard";
import Notifications from "../components/profileRight/Notifications";
import Icons from "../components/profileRight/Icons";
import {toast} from "react-toastify";
import {useConversationContext} from "../context/useConversationContext";

function PostLink() {
    const [open, setOpen] = useState(false);
    const { postId } = useParams();
    const [item, setItem] = useState(null);
    const [openShareBar, setOpenShareBar] = useState(false);
    const messageRef = useRef(null);
    const { getPostLink, loading } = useGetPostLink();
    const { likePost } = useLikePost();
    const { unLikePost } = useUnLikePost();
    const { removePost } = useRemovePost();
    const { removeFollower } = useRemoveFollower();
    const { addFollower } = useAddFollower();
    const { authUser ,setAuthUser} = useAuthContext();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const post = await getPostLink(postId);
                setItem(post);
            } catch (error) {
                console.error('Failed to fetch post:', error);
            }
        };

        fetchPost();
    }, [postId]);

    // const handleLikePost = async (postId) => {
    //     await likePost(postId);
    // };
    const handleLikePost = async (postId) => {
        try {
            await likePost(postId);
            // Update the local state to reflect the like
            setItem(prevItem => ({
                ...prevItem,
                likes: [...(prevItem.likes || []), authUser._id]
            }));
        } catch (error) {
            console.error('Failed to like post:', error);
        }
    };

    const handleUnLikePost = async (postId) => {
    //     await unLikePost(postId);
    try {
        await unLikePost(postId);
        // Update the local state to reflect the like
        setItem(prevItem => ({
            ...prevItem,
            likes:prevItem.likes.filter((item) => item.toString() !== authUser._id.toString())
        }));
    } catch (error) {
        console.error('Failed to unlike post:', error);
    }
    };



    const handleRemovePost = async (postId) => {
        await removePost(postId);
    };

    const handleFollow = async (followerId) => {
        await addFollower(followerId);
    };

    const handleUnFollow = async (followerId) => {
        await removeFollower(followerId);
    };

    const handleShare = () => {
        setOpenShareBar(true);
    };

    const handleClose = () => {
        setOpenShareBar(false);
    };

    // Format date only when item is updated
    const formattedDate = item?.schedule ? new Date(item.schedule).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Unknown';

    useEffect(() => {
        if (item) {
            messageRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [item]);
    const [openTrend, setOpenTrend] = useState(false);
    const [openNotification, setOpenNotification] = useState(false);
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
        loading ?            <div className={'w-full h-screen flex items-start justify-center bg-white'}> <span className={'loading loading-spinner loading-lg text-black'}></span> </div>:
            <div className={'w-full h-screen flex items-start justify-center bg-white'}>
                {openTrend ? <TrendCard isPhoneSize={true}/> : null}
                {openNotification ? <Notifications isPhoneSize={true}/> : null}
                <section
                    className={'xl:w-[70%] lg:w-[70%] md:w-[100%] sm:w-[100%] w-[100%] h-screen flex items-start justify-center pt-5 px-2'}>
                    <div className={'w-fit h-fit flex flex-col items-center justify-center'}>
                        {openShareBar &&
                            <ShareBarComponent message={null} post={item} onClick={handleClose} messages={null}
                                               setOpenShareBar={setOpenShareBar}/>}
                        <section className={'w-full mb-2 h-fit flex justify-start relative items-center'}>
                            <Link
                                to={item?.userId?._id === authUser._id ? '/profile' : `/profile/${item?.userId?._id}`}>
                                <img className={'xl:w-12 xl:h-12 lg:w-12 lg:h-12 md:w-10 md:h-10 sm:w-10 sm:h-10 w-8 h-8 rounded-full mr-3'} src={item?.userId?.images.profileImage}/>
                            </Link>
                            <div className={'w-fit h-fit flex flex-col items-start justify-center'}>
                                <Link
                                    to={item?.userId?._id === authUser._id ? '/profile' : `/profile/${item?.userId?._id}`}>
                                    <section className={'w-full flex items-center justify-start'}>
                                        <h1 className={'text-lg text-black font-customTwo font-[400] mr-3'}>{item?.userId?.fullName}</h1>
                                        <h2 className={'text-md text-customGreen font-customTwo font-[400]'}>@{item?.userId?.username}</h2>
                                    </section>
                                </Link>
                                <section className={'w-full flex items-center justify-start'}>
                                    <p className={'text-gray-400 text-md font-[400] font-serif'}>{formattedDate}</p>
                                    {item?.userId?._id !== authUser._id &&
                                        <div className={'ml-3'}>
                                            <button
                                                onClick={() => authUser.arrays.followings.includes(item?.userId?._id) ? handleUnFollow(item?.userId?._id) : handleFollow(item?.userId?._id)}
                                                className={`btn btn-sm h-8 w-24 rounded-lg text-[15px]
                                    ${authUser.arrays.followings.includes(item?.userId?._id) ? 'bg-transparent hover:text-white hover:border-none hover:bg-gradient-to-r from-[rgba(0,234,151,1)] to-[rgba(0,167,243,1)] text-customGreen border-2 border-customGreen' : 'text-white border-none bg-gradient-to-r from-[rgba(0,234,151,1)] to-[rgba(0,167,243,1)]'}
                                `}>
                                                {authUser.arrays.followings.includes(item?.userId?._id) ? 'Unfollow' : 'Follow'}
                                            </button>
                                        </div>}
                                </section>
                            </div>
                            <div className={'absolute top-0 right-0 flex items-center justify-center'}>
                                {item?.location ? <h1 className={'m-0 font-lg flex text-[#C27977]'}><CiLocationOn
                                        className={'text-2xl text-[#C27977] m-0 mr-1'}/>{item.location}</h1> :
                                    <h1 className={'m-0 font-lg flex text-[#C27977]'}><CiLocationOn
                                        className={'text-2xl text-[#C27977] m-0'}/>Unknown</h1>}
                                {item?.userId?._id === authUser._id &&
                                    <RiDeleteBin5Line className={'m-0 text-customGreen text-2xl cursor-pointer ml-5'}
                                                      onClick={() => handleRemovePost(item._id)}/>}
                            </div>
                        </section>
                        {item?.photo && !item?.video && <img className={'rounded-lg'} style={{
                            width: `${item?.sizes?.photoSizes?.width}px`,
                            height: `${item?.sizes?.photoSizes?.height}px`
                        }} src={item.photo} alt="Post"/>}
                        {item?.video && !item?.photo && <VideoPlayer item={item}/>}
                        {item?.video && item?.photo && <div className={'flex items-start justify-between'}>
                            <img style={{
                                width: `${item?.sizes?.photoSizes?.width}px`,
                                height: `${item?.sizes?.photoSizes?.height}px`
                            }} className={'mr-2 rounded-lg'} src={item.photo} alt="Post"/>
                            <VideoPlayer item={item}/>
                        </div>}
                        <section className={'w-full flex items-center justify-start mt-5'}>
                            {item?.likes?.includes(authUser._id) ?
                                <PiHeartFill className={'xl:text-[35px] lg:w-[35px] md:w-[30px] sm:w-[28px] w-[30px] cursor-pointer text-customGreen'}
                                             onClick={() => handleUnLikePost(item._id)}/> :
                                <PiHeart onClick={() => handleLikePost(item._id)}
                                         className={'xl:text-[35px] lg:w-[35px] md:w-[30px] sm:w-[28px] w-[30px] cursor-pointer text-black'}/>}
                            <div className="indicator">
                                {item?.comments?.length > 0 &&
                                    <span
                                        className="indicator-item badge border-none bg-[#00B7DE] absolute top-1 right-2 text-white flex items-center justify-center text-md">{item.comments.length}</span>}
                                <AiOutlineComment onClick={() => setOpen(true)}
                                                  className={'xl:text-[35px] lg:w-[35px] md:w-[30px] sm:w-[28px] w-[30px] cursor-pointer text-black ml-3 relative'}/>
                            </div>
                            <BsSend onClick={handleShare} className={'xl:text-[30px] lg:w-[30px] md:w-[25px] sm:w-[25px] w-[20px] cursor-pointer text-black ml-3'}/>
                        </section>
                        <section className={'w-full flex mt-3 items-center justify-start'}>
                            <p className={'text-gray-400 text-md '}>{item?.likes?.length} likes</p>
                        </section>
                        <div className={'w-full h-fit flex items-center justify-start'}>
                            <p className={'text-black text-[18px] mt-2'}>{item?.content}</p>
                        </div>
                        {open && <div
                            className={'w-screen overflow-auto h-screen fixed flex items-center justify-center bg-white/20 backdrop-blur-sm top-0 left-0 z-50'}>
                            <section
                                className={'xl:w-[50%] lg:w-[55%] md:w-[65%] sm:w-[75%] w-[85%] rounded-md xl:h-[90%] lg:h-[80%] md:h-[70%] sm:h-[60%] h-[50%] px-6 py-4 pt-7 bg-white shadow-xl relative flex flex-col justify-between'}>
                                <IoClose className={'absolute top-3 right-3 text-gray-400 cursor-pointer text-lg'}
                                         onClick={() => setOpen(false)}/>
                                <div
                                    className={'w-full h-[90%] flex flex-col items-center justify-start overflow-auto'}>
                                    {item?.comments?.length > 0 ? item.comments.map((comment, index) => (
                                        <div className={'w-full h-fit'}
                                             ref={index === item.comments.length - 1 ? messageRef : null} key={index}>
                                            <EachComment message={comment}/>
                                        </div>
                                    )) : <p className={'text-black text-lg font-[500]'}>No comments yet!</p>}
                                </div>
                                <CommentInput
                                    handleUpdate={() => messageRef.current?.scrollIntoView({behavior: 'smooth'})}
                                    postId={item?._id}/>
                            </section>
                        </div>}
                    </div>
                </section>
                <ProfileRight/>
                <div
                    className={'w-[6%] h-screen hidden xl:hidden lg:hidden md:flex sm:flex items-center justify-center'}>
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

export default PostLink;
