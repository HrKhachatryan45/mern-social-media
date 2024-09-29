import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import {useAuthContext} from "../../context/useAuthContext";
import useGetFollower from "../../hooks/useGetFollower";
import {IoClose} from "react-icons/io5";
import useRemoveFollower from "../../hooks/useRemoveFollower";
import useAddFollower from "../../hooks/useAddFollower";
import {usePostContext} from "../../context/usePostContext";
import useGetFamiliarPeople from "../../hooks/useGetFamiliarPeople";
import useListenProfile from "../../hooks/useListenProfile";

function ProfileAppearance({isInSettings}) {
    const { allPosts } = usePostContext();
    // Consume posts from context
    useListenProfile()
    const {authUser} = useAuthContext()
    let myPostsLength
    if (allPosts.length > 0) {
        myPostsLength = allPosts.filter(post => post.userId._id.toString() === authUser._id.toString()).length
    }else{
        myPostsLength = 0
    }
    const {getFollower,loading2} = useGetFollower()
    const [followersData,setFollowersData]=useState([])
    const [followingsData,setFollowingsData]=useState([])
    useEffect(() => {
        const getFollowerArray =async  () =>{
            const followerDataPromises  =  authUser.arrays.followers.map(async (item)=>{
                const eachFollower= await getFollower(item)
                return eachFollower
            })
            const allFollowers = await Promise.all(followerDataPromises)
            setFollowersData(allFollowers)
        }
        getFollowerArray()
    }, [authUser.arrays.followers]);
    useEffect(() => {
        const getFollowingsArray =async  () =>{
            const followingDataPromises  =  authUser.arrays.followings.map(async (item)=>{
                const eachFollower= await getFollower(item)
                return eachFollower
            })
            const allFollowings = await Promise.all(followingDataPromises)
            setFollowingsData(allFollowings)
        }
        getFollowingsArray()
    }, [authUser.arrays.followings]);
    const [visible,setVisible]=useState(false)
    const [visible2,setVisible2]=useState(false)
    const {removeFollower} = useRemoveFollower()
    const {addFollower} = useAddFollower()

    const handleFollow = async  (followerId) =>{
        await addFollower(followerId)
        await getFamiliarPeople()
    }
    const handleUnFollow = async  (followerId) =>{
        await removeFollower(followerId)
        await getFamiliarPeople()
    }
    const {getFamiliarPeople} = useGetFamiliarPeople()

    return (
        <div className={`flex flex-col w-full mt-3  ${isInSettings?'xl:h-[70%] xl:mb-6 lg:h-[70%] lg:mb-5 md:h-[65%] md:mb-4 sm:h-[50%] sm:mb-3 h-[35%] mb-2':'xl:h-[55%] lg:h-[52%] md:h-[50%] sm:h-[50%] h-[40%]'}  bg-[#FAFAFA] rounded-3xl `}>
            <div className={` ${authUser.images.backgroundImage === ' https://img.freepik.com/free-vector/blue-wave-background-banner-modern-design_677411-1279.jpg?t=st=1715420712~exp=1715424312~hmac=6549150db281add14a76f2cca0f3e4852b603dc6cc7bbaa32e37c4905f963194&w=826'?'zero':'hundred'} w-full ${isInSettings?'xl:h-[85%] lg:h-[85%] md:h-[85%] sm:h-[75%] h-[60%]':'h-[30%]'} rounded-t-3xl flex items-end justify-center`}
                 style={{ background: `url(${authUser.images.backgroundImage})`}}>
                <img className={`${isInSettings?'xl:w-28 xl:h-28 lg:w-24 lg:h-24 md:w-20 md:h-20 sm:w-20 sm:h-20 w-16 h-16 mb-[-40px]':'xl:w-20 xl:h-20 lg:w-16 lg:h-16 md:w-12 md:h-12 sm:w-14 sm:h-14 w-14 h-14 mb-[-30px]'} rounded-full xl:border-2 lg:border-2 md:border-[1px] sm:border-[1px] border-[1px] border-customGreenBorder `}
                     src={authUser.images.profileImage}/>
            </div>
            <div className={`w-full xl:h-[60%] lg:h-[60%] md:h-[60%] sm:h-[60%] h-[65%] px-5  ${isInSettings?'pt-14':'pt-10'}  flex flex-col items-center justify-start`}>
                <h2 className={`text-black font-bold xl:text-md lg:text-md md:text-sm sm:text-sm  text-[10px]`}>{authUser.fullName}</h2>
                {authUser.info && authUser.info.profession ? (
                    <h3 className={'text-black xl:text-md lg:text-md md:text-sm sm:text-sm text-[8px]'}>{authUser.info.profession}</h3>
                ) : null}

                {!isInSettings ? <section
                    className={'mt-3  pt-2 pb-2 xl:border-b-2 lg:border-b-2 md:border-b-[1px] sm:border-b-[1px] border-b-[1px] xl:border-t-2 lg:border-t-2 md:border-t-[1px] sm:border-t-[1px] border-t-[1px] border-[#CBD2D5] w-full h-fit flex items-center justify-between'}>
                    <div
                        className={'w-1/2 mr-1 h-[95%] xl:border-r-2 lg:border-r-2 md:border-r-[1px] sm:border-r-[1px] border-r-[1px] border-[#CBD2D5]  flex flex-col items-center justify-center'}>
                        <h2 className={'text-black font-bold xl:text-md lg:text-md md:text-sm sm:text-sm  text-[8px] '}>{authUser.arrays.followers.length}</h2>
                        <h3 className={'text-gray-400 xl:text-md lg:text-md md:text-sm sm:text-sm text-[8px]   cursor-pointer hover:text-customGreen'}
                            onClick={() => setVisible(true)}>Followers</h3>
                    </div>
                    <div
                        className={'w-1/2 ml-1 h-[95%] flex flex-col items-center justify-center'}>
                        <h2 className={'text-black font-bold xl:text-md lg:text-md md:text-sm sm:text-sm text-[8px] '}>{authUser.arrays.followings.length}</h2>
                        <h3 className={'text-gray-400  xl:text-md lg:text-md md:text-sm sm:text-sm text-[8px] cursor-pointer hover:text-customGreen'}
                            onClick={() => setVisible2(true)}>Following</h3>
                    </div>
                </section>:
                    <section
                        className={'mt-3  xl:border-t-2 lg:border-t-2 md:border-t-[1px] sm:border-t-[1px] border-t-[1px]  pt-2 pb-2 xl:border-b-2 lg:border-b-2 md:border-b-[1px] sm:border-b-[1px] border-b-[1px]  border-[#CBD2D5] w-full h-fit flex items-center justify-between'}>
                        <div
                            className={'w-1/3 mr-1 h-[95%]   flex flex-col items-center justify-center'}>
                            <h2 className={'text-black font-bold xl:text-md lg:text-md md:text-sm sm:text-sm text-[8px]'}>{authUser.arrays.followers.length}</h2>
                            <h3 className={'text-gray-400 xl:text-md lg:text-md md:text-sm sm:text-sm text-[8px] cursor-pointer hover:text-customGreen'}
                                onClick={() => setVisible(true)}>Followers</h3>
                        </div>
                        <div
                            className={'w-1/3 ml-1 mr-1 h-[95%] xl:border-r-2 lg:border-r-2 md:border-r-[1px] sm:border-r-[1px] border-r-[1px]  border-[#CBD2D5]  xl:border-l-2 lg:border-l-2 md:border-l-[1px] sm:border-l-[1px] border-l-[1px]  flex flex-col items-center justify-center'}>
                            <h2 className={'text-black font-bold xl:text-md lg:text-md md:text-sm sm:text-sm text-[8px]'}>{authUser.arrays.followings.length}</h2>
                            <h3 className={'text-gray-400 xl:text-md lg:text-md md:text-sm sm:text-sm text-[8px] cursor-pointer hover:text-customGreen'}
                                onClick={() => setVisible2(true)}>Following</h3>
                        </div>
                        <div
                            className={'w-1/3 ml-1 h-[95%] flex flex-col items-center justify-center'}>
                            <h2 className={'text-black font-bold xl:text-md lg:text-md md:text-sm sm:text-sm text-[8px]'}>{myPostsLength}</h2>
                            <h3 className={'text-gray-400 xl:text-md lg:text-md md:text-sm sm:text-sm text-[8px] cursor-pointer hover:text-customGreen'}
                                >Posts</h3>
                        </div>
                    </section>
                }
                {!isInSettings ?
                    <Link to={'/profile'} className={'text-customGreen xl:text-md lg:text-md md:text-sm sm:text-sm text-[10px] font-bold xl:mt-4 lg:mt-3 md:mt-2 sm:mt-2 mt-1'}>My Profile</Link> : null}
            </div>
            {visible ?
                <div
                    className={'w-screen overflow-auto h-screen fixed flex items-start pt-20 pb-20  justify-center bg-white/20 backdrop-blur-sm top-0 left-0 z-50'}>
                    <section className={'xl:w-[50%] lg:w-[60%] md:w-[65%] sm:w-[70%] w-[80%] rounded-md h-fit px-6 py-2 pt-7 bg-white shadow-xl relative'}>
                        <IoClose className={'absolute top-3 right-3 text-gray-400 cursor-pointer text-lg'}
                                 onClick={() => setVisible(false)}/>

                        {followersData.length > 0 ?
                            <h2 className={'text-black mb-4 font-bold xl:text-[16px] lg:text-[14px] md:text-[12px] sm:text-[10px] text-[10px]'}>Who is following you</h2> :
                            <h2 className={'text-black mb-4 font-bold xl:text-[16px] lg:text-[14px] md:text-[12px] sm:text-[10px] text-[10px]'}>No followers yet</h2>
                        }
                        <div className={'w-full h-full flex flex-col items-center justify-start'}>
                            {loading2 ? <span className={'loading text-primary loading-spinner'}></span> :
                                followersData.map((item) => (
                                    <section className={'w-full h-fit mb-3  flex items-center justify-between'}
                                             key={item.user._id}>
                                        <section className={'w-[65%]  flex items-center justify-start'}>
                                            <Link to={item.user._id === authUser._id ?'/profile':`/profile/${item.user._id}`}>
                                            <img className={'xl:w-12 xl:h-12 lg:w-10 lg:h-10 md:w-9 md:h-9 sm:w-8 sm:h-8 w-8 h-8 rounded-full'} src={item.user.images.profileImage}/>
                                            </Link>
                                            <Link to={item.user._id === authUser._id ?'/profile':`/profile/${item.user._id}`}>

                                            <div className={'w-[70%]  ml-2  overflow-hidden'}>
                                                <h2 className={'text-black mb-2  font-bold xl:text-[16px] lg:text-[14px] md:text-[12px] sm:text-[10px] text-[10px] whitespace-nowrap'}>
                                                    {item.user.fullName.length > 20 ? item.user.fullName.slice(0, 18) + '...' : item.user.fullName}
                                                </h2>
                                                <h4 className={'xl:text-[14px] lg:text-[12px] md:text-[10px] sm:text-[9px] text-[8px]'}>@{item.user.username}</h4>
                                            </div>
                                            </Link>
                                        </section>
                                        <div className={'w-[35%] '}>
                                            <button
                                                onClick={() => authUser.arrays.followings.includes(item.user._id) ? handleUnFollow(item.user._id) : handleFollow(item.user._id)}
                                                className={`btn btn-sm xl:h-10 lg:h-9 md:h-8 sm:h-7  h-6   w-full rounded-lg xl:text-[15px] lg:text-[13px] md:text-[12px] sm:text-[10px] text-[10px]
                                                ${authUser.arrays.followings.includes(item.user._id) ? 'bg-transparent hover:text-white hover:border-none hover:bg-gradient-to-r from-[rgba(0,234,151,1)] to-[rgba(0,167,243,1)] text-customGreen border-2 border-customGreen' : 'text-white border-none bg-gradient-to-r from-[rgba(0,234,151,1)] to-[rgba(0,167,243,1)]'}
                                                `}>
                                                {authUser.arrays.followings.includes(item.user._id) ? "Unfollow" : "Follow"}
                                            </button>
                                        </div>
                                    </section>
                                ))
                            }
                        </div>
                    </section>
                </div> : null}
            {visible2?
                <div className={'w-screen overflow-auto h-screen fixed flex items-start pt-20 pb-20  justify-center bg-white/20 backdrop-blur-sm top-0 left-0 z-50'}>
                    <section className={'xl:w-[50%] lg:w-[60%] md:w-[65%] sm:w-[70%] w-[80%] rounded-md h-fit px-6 py-2 pt-7 bg-white shadow-xl relative'}>
                        <IoClose className={'absolute top-3 right-3 text-gray-400 cursor-pointer text-lg'} onClick={()=>setVisible2(false)} />
                        {followingsData.length > 0 ?
                            <h2 className={'text-black mb-4 font-bold xl:text-[16px] lg:text-[14px] md:text-[12px] sm:text-[10px] text-[10px]'}>Who are you following</h2>:
                            <h2 className={'text-black mb-4 font-bold xl:text-[16px] lg:text-[14px] md:text-[12px] sm:text-[10px] text-[10px]'}>No following yet</h2>
                        }
                        <div className={'w-full h-full flex flex-col items-center justify-start'}>
                            {loading2 ? <span className={'loading text-primary loading-spinner'}></span> :
                                followingsData.map((item) => (
                                    <section className={'w-full h-fit mb-3  flex items-center justify-between'}
                                             key={item.user._id}>
                                        <section className={'w-[65%]  flex items-center justify-start'}>
                                            <Link to={item.user._id === authUser._id ?'/profile':`/profile/${item.user._id}`}>
                                            <img className={'xl:w-12 xl:h-12 lg:w-10 lg:h-10 md:w-9 md:h-9 sm:w-8 sm:h-8 w-8 h-8 rounded-full'} src={item.user.images.profileImage}/>
                                            </Link>
                                            <Link to={item.user._id === authUser._id ?'/profile':`/profile/${item.user._id}`}>
                                            <div className={'w-[70%]  ml-2  overflow-hidden'}>
                                                <h2 className={'text-black mb-2  font-bold xl:text-[16px] lg:text-[14px] md:text-[12px] sm:text-[10px] text-[10px] whitespace-nowrap'}>
                                                    {item.user.fullName.length > 20 ? item.user.fullName.slice(0, 18) + '...' : item.user.fullName}
                                                </h2>
                                                <h4 className={'xl:text-[14px] lg:text-[12px] md:text-[10px] sm:text-[9px] text-[8px]'}>@{item.user.username}</h4>
                                            </div>
                                            </Link>
                                        </section>
                                        <div className={'w-[35%] '}>
                                            <button
                                                onClick={() => authUser.arrays.followings.includes(item.user._id) ? handleUnFollow(item.user._id) : handleFollow(item.user._id)}
                                                className={`btn btn-sm xl:h-10 lg:h-9 md:h-8 sm:h-7  h-6   w-full rounded-lg   xl:text-[15px] lg:text-[13px] md:text-[12px] sm:text-[10px] text-[10px]
                                                ${authUser.arrays.followings.includes(item.user._id) ? 'bg-transparent hover:text-white hover:border-none hover:bg-gradient-to-r from-[rgba(0,234,151,1)] to-[rgba(0,167,243,1)] text-customGreen border-2 border-customGreen' : 'text-white border-none bg-gradient-to-r from-[rgba(0,234,151,1)] to-[rgba(0,167,243,1)]'}
                                                `}>
                                                {authUser.arrays.followings.includes(item.user._id) ? "Unfollow" : "Follow"}
                                            </button>
                                        </div>
                                    </section>
                                ))
                            }
                        </div>
                    </section>
                </div> : null}

        </div>
    );
}

export default ProfileAppearance;