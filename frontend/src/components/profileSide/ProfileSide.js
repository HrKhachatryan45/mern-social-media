import React, {useEffect, useState} from 'react';
import SearchInput from "./SearchInput";
import ProfileAppearance from "./ProfileAppearance";
import GetFollowers from "./GetFollowers";
import {useAuthContext} from "../../context/useAuthContext";
import useGetFollower from "../../hooks/useGetFollower";
import useRemoveFollower from "../../hooks/useRemoveFollower";
import useAddFollower from "../../hooks/useAddFollower";
import {IoClose} from "react-icons/io5";
import useListenFollowings from "../../hooks/useListenFollowings";

function ProfileSide(props) {
    const [visible,setVisible]=useState(false);
    const {authUser} =  useAuthContext()
    useListenFollowings()



    const {getFollower,loading2} = useGetFollower()
    const [followersData,setFollowersData]=useState([])
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

    const {removeFollower} = useRemoveFollower()
    const {addFollower} = useAddFollower()
    const handleFollow = async  (followerId) =>{
        await addFollower(followerId)
    }
    const handleUnFollow = async  (followerId) =>{
        await removeFollower(followerId)
    }
    return (
        <div className={'xl:w-[22%] lg:w-[22%] md:w-[30%] sm:w-[34%] w-[40%] h-full   xl:px-3 lg:px-3 md:px-3 sm:px-1 px-[5px] py-2 flex flex-col items-center justify-start overflow-auto'}>
            <SearchInput/>
            <div className={'w-full h-[92%] '}>
                <ProfileAppearance/>
               <div className={'w-full  max-h-[47%] overflow-y-hidden '}>
                   <GetFollowers/>
               </div>
                {authUser.arrays.followers.length !== 0 ?
                    <div className={'w-full mt-5  flex items-center justify-center'}>
                        <h2 className={'text-customGreen mb-5 font-[500] xl:text-md lg:text-md md:text-sm sm:text-sm text-[10px] cursor-pointer'} onClick={()=>setVisible(true)}>Show More</h2>
                    </div>:null
                }



                {visible?
                    <div className={'w-screen overflow-auto h-screen fixed flex items-start pt-20 pb-20  justify-center bg-white/20 backdrop-blur-sm top-0 left-0 z-50'}>
                        <section className={'xl:w-[50%] lg:w-[60%] md:w-[65%] sm:w-[70%] w-[80%] rounded-md h-fit px-6 py-2 pt-7 bg-white shadow-xl relative'}>
                            <IoClose className={'absolute top-3 right-3 text-gray-400 cursor-pointer text-lg'} onClick={()=>setVisible(false)} />
                            <h2 className={'text-black mb-4 font-bold xl:text-[16px] lg:text-[14px] md:text-[12px] sm:text-[10px] text-[10px]'}>Who is following you</h2>
                            <div className={'w-full h-full flex flex-col items-center justify-start'}>
                                {loading2 ? <span className={'loading text-primary loading-spinner'}></span> :
                                    followersData.map((item) => (
                                        <section className={'w-full h-fit mb-3  flex items-center justify-between'}
                                                 key={item.user._id}>
                                            <section className={'w-[65%]  flex items-center justify-start'}>
                                                <img className={'xl:w-12 xl:h-12 lg:w-10 lg:h-10 md:w-9 md:h-9 sm:w-8 sm:h-8 w-8 h-8 rounded-full'} src={item.user.images.profileImage}/>
                                                <div className={'w-[70%]  ml-2  overflow-hidden'}>
                                                    <h2 className={'text-black mb-2  font-bold xl:text-[16px] md:text-[14px] sm:text-[12px] text-[10px]  whitespace-nowrap'}>
                                                        {item.user.fullName.length > 20 ? item.user.fullName.slice(0, 18) + '...' : item.user.fullName}
                                                    </h2>
                                                    <h4 className={'xl:text-[14px] lg:text-[12px] md:text-[10px] sm:text-[9px] text-[8px]'}>@{item.user.username}</h4>
                                                </div>
                                            </section>
                                            <div className={'w-[35%] '}>
                                                <button
                                                    onClick={() => authUser.arrays.followings.includes(item.user._id) ? handleUnFollow(item.user._id) : handleFollow(item.user._id)}
                                                    className={` btn btn-sm xl:h-10 lg:h-9 md:h-8 sm:h-7  h-6   w-full rounded-lg xl:text-[15px] lg:text-[13px] md:text-[12px] sm:text-[10px] text-[10px] 
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
        </div>
    );
}

export default ProfileSide;