import React, {useEffect, useState} from 'react';
import SearchInput from "../profileSide/SearchInput";
import {IoClose} from "react-icons/io5";
import ProfileInfo from "./ProfileInfo";
import {useAuthContext} from "../../context/useAuthContext";
import useListenFollowings from "../../hooks/useListenFollowings";
import useRemoveFollower from "../../hooks/useRemoveFollower";
import useAddFollower from "../../hooks/useAddFollower";
import FamiliarPeople from "./FamiliarPeople";
import useGetFamiliarPeople from "../../hooks/useGetFamiliarPeople";
import {TiDelete} from "react-icons/ti";
import useDeleteUser from "../../hooks/useDeleteUser";
import useListenProfile from "../../hooks/useListenProfile";
import {Link} from "react-router-dom";
function ProfileSideSettings(props) {
    const [open,setOpen] = useState(false)
    const [visible,setVisible]=useState(false);
    const {authUser} =  useAuthContext()
    const [password,setPassword] =useState('')
    useListenFollowings()
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
    const {familiarPeopleData,loading,getFamiliarPeople} = useGetFamiliarPeople()

    const  {deleteUser,loading5} = useDeleteUser()

    const handleSubmit = async (ev) =>{
        ev.preventDefault()

        await deleteUser(password)

    }
    useListenProfile()

    return (
        <div className={'xl:w-[22%] lg:w-[26%] md:w-[30%] sm:w-[34%] w-[40%] h-full    xl:px-3 lg:px-3 md:px-2 sm:px-2 px-1 py-2 flex flex-col items-center justify-start overflow-auto'}>
            <SearchInput/>
            <div className={'w-full h-[92%]  '}>
                <ProfileInfo/>
                <div className={'w-full  max-h-[47%] overflow-y-hidden '}>
                    <FamiliarPeople/>
                </div>
                {familiarPeopleData.length !== 0 ?
                    <div className={'w-full mt-5   flex items-center justify-center'}>
                        <h2 className={'text-customGreen xl:text-md lg:text-md md:text-sm sm:text-sm text-[10px] mb-5 font-[500] cursor-pointer'}
                            onClick={() => setVisible(true)}>Show More</h2>
                    </div> : null
                }
                <div className={'mt-1 w-full h-fit flex items-center cursor-pointer justify-start font-customTwo'}
                     onClick={() => setOpen(true)}>
                    <TiDelete  className={'text-red-500  xl:text-xl lg:text-lg md:text-md sm:text-sm text-sm   mb-5'}/>
                    <h2 className={'text-red-500 xl:text-lg lg:text-md md:text-md sm:text-sm  text-[10px] ml-2 mb-5'}>Delete Account</h2>
                </div>
                {visible ?
                    <div
                        className={'w-screen overflow-auto h-screen fixed flex items-start pt-20 pb-20  justify-center bg-white/20 backdrop-blur-sm top-0 left-0 z-50'}>
                        <section className={'xl:w-[50%] lg:w-[60%] md:w-[65%] sm:w-[70%] w-[80%] rounded-md h-fit px-6 py-2 pt-7 bg-white shadow-xl relative'}>
                            <IoClose className={'absolute top-3 right-3 text-gray-400 cursor-pointer xl:text-lg lg:text-md md:text-md sm:text-sm text-sm'}
                                     onClick={() => setVisible(false)}/>
                            <h2 className={'text-black mb-4 font-bold xl:text-[16px] lg:text-[14px] md:text-[12px] sm:text-[10px] text-[10px]'}>People You May Know</h2>
                            <div className={'w-full h-full flex flex-col items-center justify-start'}>
                                {loading ? <span className={'loading text-primary loading-spinner'}></span> :
                                    familiarPeopleData.map((item) => (
                                        <section className={'w-full h-fit mb-3  flex items-center justify-between'}
                                                 key={item._id}>
                                            <section className={'w-[65%]  flex items-center justify-start'}>
                                                <Link to={item._id === authUser._id ?'/profile':`/profile/${item._id}`}>
                                                <img className={'xl:w-12 xl:h-12 lg:w-10 lg:h-10 md:w-9 md:h-9 sm:w-8 sm:h-8 w-8 h-8 rounded-full'}
                                                     src={item.images.profileImage}/>
                                                </Link>
                                                <Link to={item._id === authUser._id ?'/profile':`/profile/${item._id}`}>
                                                <div className={'w-[70%]  ml-2  overflow-hidden'}>
                                                    <h2 className={'text-black mb-2  font-bold  xl:text-[16px] md:text-[14px] sm:text-[12px] text-[10px] whitespace-nowrap'}>
                                                        {item.fullName.length > 20 ? item.fullName.slice(0, 18) + '...' : item.fullName}
                                                    </h2>
                                                    <h4 className={'xl:text-[14px] lg:text-[12px] md:text-[10px] sm:text-[9px] text-[8px]'}>@{item.username}</h4>
                                                </div>
                                                </Link>
                                            </section>
                                            <div className={'w-[35%] '}>
                                                <button
                                                    onClick={() => authUser.arrays.followings.includes(item._id) ? handleUnFollow(item._id) : handleFollow(item._id)}
                                                    className={` btn btn-sm xl:h-10 lg:h-9 md:h-8 sm:h-7  h-6   w-full rounded-lg xl:text-[15px] lg:text-[13px] md:text-[12px] sm:text-[10px] text-[10px] 
                                                ${authUser.arrays.followings.includes(item._id) ? 'bg-transparent hover:text-white hover:border-none hover:bg-gradient-to-r from-[rgba(0,234,151,1)] to-[rgba(0,167,243,1)] text-customGreen border-2 border-customGreen' : 'text-white border-none bg-gradient-to-r from-[rgba(0,234,151,1)] to-[rgba(0,167,243,1)]'}
                                                `}>
                                                    {authUser.arrays.followings.includes(item._id) ? "Unfollow" : "Follow"}
                                                </button>
                                            </div>
                                        </section>
                                    ))
                                }
                            </div>
                        </section>
                    </div> : null}
                {open ?
                    <div
                        className={'w-screen overflow-auto h-screen fixed flex items-start pt-20 pb-20  justify-center bg-white/20 backdrop-blur-sm top-0 left-0 z-50'}>
                        <section className={'xl:w-[50%] lg:w-[60%] md:w-[65%] sm:w-[70%] w-[80%] rounded-md h-fit px-6 py-2 pt-7 bg-white shadow-xl relative'}>
                            <IoClose className={'absolute top-3 right-3 text-gray-400 cursor-pointer  xl:text-lg lg:text-md md:text-md sm:text-sm text-sm'}
                                     onClick={() => setOpen(false)}/>
                            <div className={'w-full h-full flex flex-col items-center justify-start'}>
                                <h2 className={'xl:text-2xl lg:text-xl md:text-lg sm:text-md text-sm text-red-500 font-customOne m-0 mb-10' }>Delete User</h2>
                                <form onSubmit={handleSubmit} className={'w-full  h-fit '}>
                                    <input
                                        value={password}
                                        onChange={(ev) => setPassword(ev.target.value)}
                                        type={'text'}
                                        placeholder={'Confirm your password'}
                                        className={'input bg-customGray w-full    xl:h-[47px] lg:h-[44px] md:h-[40px] sm:h-[35px] h-[30px] xl:mb-3 lg:mb-3 md:mb-2 sm:mb-2 mb-2  focus:outline-none focus:border-1 focus:border-customGreen  xl:text-md lg:text-md md:text-sm sm:text-sm text-[10px]'}
                                    />
                                    <div className={'w-full h-fit flex items-center justify-end mt-6'}>
                                        <button type={'submit'}
                                                className={'mr-2 flex items-center justify-center bg-gradient-to-r from-[rgba(0,234,151,1)] to-[rgba(0,167,243,1)] border-none text-sm xl:h-10 lg:h-9 md:h-8 sm:h-7 h-7  text-white xl:w-22 lg:w-20 md:w-16 sm:w-16 w-16 rounded-lg xl:text-[15px] lg:text-[13px] md:text-[11px] sm:text-[9px] text-[8px]'}>
                                            {loading5 ? <span className={'loading loading-spinner'}></span> : 'Delete'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </section>
                    </div> : null}

            </div>
        </div>
    );
}

export default ProfileSideSettings;