import React, {useEffect, useState} from 'react';
import {IoClose} from "react-icons/io5";
import useGetUsersForSidebar from "../hooks/useGetUsersForSidebar";
import SearchInput from "../components/conversations/SearchInput";
import {useSocketContext} from "../context/useSocketContext";
import useSendSharedMessage from "../hooks/useSendSharedMessage";


function ShareBarComponent({message,setOpenShareBar,messages,onClick,post}) {
    const  {users,loading} = useGetUsersForSidebar()
    const [userValue,setUserValue] = useState('');
    const handleChange = (value) => {
        setUserValue(value)
    }
    const [filteredUsers,setFilteredUsers] = useState([])


    useEffect(() => {
        if (userValue !== ''){
            setFilteredUsers(
                users.filter((user)=>
                    user.fullName.toLowerCase().includes(userValue)
                )
            )
        }else{
            setFilteredUsers(users)
        }
    }, [userValue,users]);

    const {onlineUsers} = useSocketContext()

    const [selectedPeople,setSelectedPeople] =  useState([])


    const handleClick = (userId) => {
        if (selectedPeople.includes(userId)) {
            const updatedPeople =  selectedPeople.filter((selPeople) => selPeople.toString() !== userId.toString())
            setSelectedPeople(updatedPeople)
        } else {
            const updatedPeople = [...selectedPeople,userId]
            setSelectedPeople(updatedPeople);
        }
    }

    const {sendSharedMessage} = useSendSharedMessage()

    useEffect(() => {
        console.log(message,'message jg')
    }, [message]);


    const handleForward =async () => {
        let messageText = undefined;
        let messagePhoto = undefined;
        let messageVideo = undefined;
        let messageAudio = undefined;
        let pic = undefined
        let username = undefined
        let postId = undefined
        console.log(post,'now ppost')
        // Check if message exists and has the required properties
        if (message && message.text) {
            messageText = message.text;
        }
        if (message && message.photo) {
            messagePhoto = message.photo.url;
        }
        if (message && message.video) {
            messageVideo = message.video.url;
        }
        if (message && message.audio){
            messageAudio = message.audio.url;
        }
        if (post && post.content){
            messageText = post.content;
        }
        if (post && post.photo) {
            messagePhoto = post.photo;
        }
        if (post && post.video) {
            messageVideo = post.video;
        }
        if (post && post.userId){
            pic = post.userId.images.profileImage
        }
        if (post && post.userId){
            username = post.userId.username
        }
        if (post && post._id){
            postId = post._id
        }
       setTimeout(() => {
           setOpenShareBar(false)
           setSelectedPeople([])
       },1000)
        await sendSharedMessage(messageText,messagePhoto,  messageVideo,  messageAudio, selectedPeople,messages,pic,username,postId);

        onClick()

    }


    return (
              <div className={'w-screen  h-screen fixed flex items-center justify-center bg-white/20 backdrop-blur-sm top-0 left-0 '} style={{zIndex:9999}}>
                      <section className={'xl:w-[40%] rounded-md xl:h-[68%] lg:w-[40%] lg:h-[60%] md:w-[48%] md:h-[50%] sm:w-[55%] sm:h-[46%] w-[60%] h-[39%]  px-6 py-2 pt-4 bg-white shadow-xl relative flex flex-col items-center justify-start'}>
                          <IoClose className={'absolute top-3 right-3 text-gray-400 cursor-pointer text-lg'} onClick={()=>setOpenShareBar(false)} />
                            <h2 className={'text-black xl:text-lg lg:text-lg md:text-md sm:text-sm text-sm mb-3 font-sans font-[500]'}>Share Message</h2>
                          <SearchInput isBorder={true} userValue={userValue} onInputChange={handleChange} />

                          <section className={'w-full xl:h-[75%] lg:h-[75%] md:h-[65%] sm:h-[60%] h-[52%] border-1  flex flex-col items-center justify-start overflow-auto '}>
                              {loading ?<span className={'loading loading-spinner mt-2'}></span>:filteredUsers.map((user) => {
                                  const isOnline = onlineUsers.includes(user._id)
                                  return (
                                      <div
                                          onClick={() => handleClick(user._id)}
                                           className={`cursor-pointer px-3 py-3 hover:bg-customGreen   rounded-lg mb-3 w-full h-fit flex flex-col items-start justify-center `}
                                           key={user._id}>
                                          <section className={'w-full h-full flex items-center justify-between'}>
                                              <div className={'w-fit h-full  max-w-[85%] flex items-center justify-start'}>
                                                  <div className="w-fit h-fit relative">
                                                      <img className={'xl:w-12 xl:h-12 lg:w-11 lg:h-11 md:w-10 md:h-10 sm:h-8 sm:w-8 w-8 h-8 rounded-full'}
                                                           src={user.images.profileImage}/>
                                                      <span
                                                          className={`ml-2 xl:w-3.5 xl:h-3.5 lg:w-3 lg:h-3 md:w-2.5 md:h-2.5 sm:w-2 sm:h-2 h-2 w-2 absolute top-0 right-0 ${isOnline ? 'bg-customGreen' : 'bg-gray-400'}  rounded-full`}></span>
                                                  </div>
                                                  <section className={'w-fit flex flex-col items-start justify-center pl-2'}>
                                                      <h2 className={` ml-2 xl:text-lg lg:text-md md:text-sm sm:text-sm text-[10px] font-sans font-[500] text-black`}>{user.fullName}</h2>
                                                      <h3 className={` ml-2 xl:text-lg lg:text-md md:text-sm sm:text-sm text-[10px] font-sans font-[500] text-black`}>@{user.username}</h3>
                                                  </section>

                                              </div>
                                              <section
                                                  className={`w-fit h-fit flex items-center justify-center `}>
                                                  <input type="checkbox"  className={`checkbox [--chkbg:black] [--chkfg:white] border-[1] border-black`}
                                                         checked={selectedPeople.includes(user._id)}
                                                         readOnly
                                                  />
                                              </section>
                                          </section>


                                      </div>
                                  )
                              })
                              }
                          </section>
                          <button onClick={handleForward} className={'w-full border-none rounded-lg mt-3 text-white bg-customGreen xl:h-[50px] lg:h-[50px] md:h-[40px] sm:h-[32px] h-[30px]'}>Send</button>
                      </section>
              </div>
);
}

export default ShareBarComponent;