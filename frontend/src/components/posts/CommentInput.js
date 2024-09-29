import React, {useState} from 'react';
import {IoSend} from "react-icons/io5";
import {RiEmojiStickerLine} from "react-icons/ri";
import useAddComment from "../../hooks/useAddComment";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

function CommentInput({postId,handleUpdate}) {
    const [showEmojiPicker, setShowEmojiPicker] =useState(false);
    const [message,setMessage]=useState('')
    const handleEmojiClick = (emoji) =>{
        setMessage((prev)=>prev + emoji.native)
    }
    const {loading,addComment} = useAddComment()

    const handleSubmit = async (ev) =>{
        ev.preventDefault()
        handleUpdate()
        await addComment(message,postId)
        setMessage('')
    }
    return (
        <form onSubmit={handleSubmit} className={'n3 w-full xl:h-[8%] lg:h-[8%] md:h-[12%] sm:h-[10%] h-[10%] flex justify-between items-center  '}>
            {showEmojiPicker ?
                <Picker   theme={'light'} data={data} onEmojiSelect={handleEmojiClick}/>:null}
            <RiEmojiStickerLine type={'button'} onClick={()=>setShowEmojiPicker(!showEmojiPicker)} className={'absolute xl:text-2xl lg:text-xl md:text-lg sm:text-md text-sm  text-yellow-500 left-8 cursor-pointer z-20 '}/>
            <input
                type={'text'}
                value={message}
                onChange={(ev)=>setMessage(ev.target.value)}
                placeholder={'Comment on this'}
                className={'focus:outline-none focus:border-1 focus:border-customGreen relative pl-10 input bg-customGray xl:w-[88%] lg:w-[88%] md:w-[88%] sm:w-[88%] w-[80%] h-full '}
            />
            <button type={'submit'} className={'xl:w-[10%] lg:w-[10%] md:w-[10%] sm:w-[10%] w-[18%] h-full flex items-center justify-center rounded-md bg-gradient-to-r from-[rgba(0,234,151,1)] to-[rgba(0,167,243,1)] border-none text-white  rounded-lg xl:text-[17px] lg:text-[14px] md:text-[12px] sm:text-[10px] '}>
                {loading?<span className={'loading loading-spinner'}></span>:<IoSend/> }
            </button>
        </form>
    );
}

export default CommentInput;