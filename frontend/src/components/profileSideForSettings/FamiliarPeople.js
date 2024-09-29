import React, {useEffect} from 'react';
import useGetFamiliarPeople from "../../hooks/useGetFamiliarPeople";
import useRemoveFollower from "../../hooks/useRemoveFollower";
import useAddFollower from "../../hooks/useAddFollower";
import {useAuthContext} from "../../context/useAuthContext";
import {Link} from "react-router-dom";

function FamiliarPeople({authUser2}) {
    const {authUser} = useAuthContext()

    const {familiarPeopleData,loading,getFamiliarPeople} = useGetFamiliarPeople()
    const {removeFollower} = useRemoveFollower()
    const {addFollower} = useAddFollower()
    const handleFollow = async  (followerId) =>{
        await addFollower(followerId)
        authUser2?await getFamiliarPeople(authUser2._id):await getFamiliarPeople(authUser._id)
    }
    const handleUnFollow = async  (followerId) =>{
        await removeFollower(followerId)
        authUser2?await getFamiliarPeople(authUser2._id):await getFamiliarPeople(authUser._id)
    }
    useEffect(() => {
        const getThem = async () =>{
            authUser2?await getFamiliarPeople(authUser2._id):await getFamiliarPeople(authUser._id)
        }
        getThem()
    }, [authUser.arrays]);
    return (
        <div className={'w-full h-full'}>
            {familiarPeopleData.length !== 0 ?
                <section className={'w-full h-full flex flex-col items-start justify-start'}>
                    <div className={'w-full h-full mt-8 overflow-hidden  '}>
                        <h2 className={'text-black mb-4 font-bold xl:text-[16px] lg:text-[14px] md:text-[12px] sm:text-[10px] text-[9px]'}>People you may know</h2>
                        <div className={'w-full h-full flex flex-col items-center justify-start'}>
                            {loading ? <span className={'loading text-primary loading-spinner'}></span> :
                                familiarPeopleData.map((item) => (
                                    <section className={'w-full h-fit mb-3  flex items-center justify-between'}
                                             key={item._id}>
                                        <section className={'w-[65%]  flex items-center justify-start'}>
                                            <Link to={item._id === authUser._id ?'/profile':`/profile/${item._id}`}>
                                            <img className={'xl:w-12 xl:h-12 lg:w-10 lg:h-10 md:w-8 md:h-8 sm:w-7 sm:h-7 w-7 h-7  rounded-full'} src={item.images.profileImage}/>
                                            </Link>
                                            <Link to={item._id === authUser._id ?'/profile':`/profile/${item._id}`}>

                                            <div className={'w-[70%]  ml-2  overflow-hidden'}>
                                                <h2 className={'text-black mb-2  font-bold xl:text-[16px] lg:text-[14px] md:text-[12px] sm:text-[10px] text-[10px] whitespace-nowrap'}>
                                                    {item.fullName.length > 13 ? item.fullName.slice(0, 11) + '...' : item.fullName}
                                                </h2>
                                                <h4 className={'xl:text-[16px] lg:text-[14px] md:text-[12px] sm:text-[10px] text-[8.5px]'}>@{item.username}</h4>
                                            </div>
                                            </Link>
                                        </section>
                                        <div className={'w-[35%] '}>
                                            {authUser2 ? <button
                                                onClick={() => authUser2.arrays.followings.includes(item._id) ? handleUnFollow(item._id) : handleFollow(item._id)}
                                                className={`  sm:flex sm:items-center sm:justify-center sm:py-3 xl:py-0 lg:py-0 md:py-0 py-3 flex items-center justify-center xl:h-10 lg:h-9 md:h-8 sm:h-7  h-4  w-full rounded-lg xl:text-[15px] lg:text-[12px] md:text-[11px] sm:text-[9px] text-[9px]
                                                ${authUser2.arrays.followings.includes(item._id) ? 'bg-transparent hover:text-white hover:border-none hover:bg-gradient-to-r from-[rgba(0,234,151,1)] to-[rgba(0,167,243,1)] text-customGreen border-2 border-customGreen' : 'text-white border-none bg-gradient-to-r from-[rgba(0,234,151,1)] to-[rgba(0,167,243,1)]'}
                                                `}>
                                                {authUser2.arrays.followings.includes(item._id) ? "Unfollow" : "Follow"}
                                            </button> : <button
                                                onClick={() => authUser.arrays.followings.includes(item._id) ? handleUnFollow(item._id) : handleFollow(item._id)}
                                                className={` sm:flex sm:items-center sm:justify-center sm:py-3 xl:py-0 lg:py-0 md:py-0 py-3 flex items-center justify-center xl:h-10 lg:h-9 md:h-8 sm:h-7  h-4  w-full rounded-lg xl:text-[15px] lg:text-[12px] md:text-[11px] sm:text-[9px] text-[9px]
                                                ${authUser.arrays.followings.includes(item._id) ? 'bg-transparent hover:text-white hover:border-none hover:bg-gradient-to-r from-[rgba(0,234,151,1)] to-[rgba(0,167,243,1)] text-customGreen border-2 border-customGreen' : 'text-white border-none bg-gradient-to-r from-[rgba(0,234,151,1)] to-[rgba(0,167,243,1)]'}
                                                `}>
                                                {authUser.arrays.followings.includes(item._id) ? "Unfollow" : "Follow"}
                                            </button>}

                                        </div>
                                    </section>
                                ))
                            }
                        </div>

                    </div>
                </section> : <section>
                    <h2 className={'text-black mt-4 font-bold xl:text-[16px] lg:text-[14px] md:text-[12px] sm:text-[10px] text-[8.5px] '}>No followers yet</h2>
                </section>}

        </div>
    );
}

export default FamiliarPeople;