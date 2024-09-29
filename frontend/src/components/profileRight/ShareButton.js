import React, {useState} from 'react';
import {IoClose} from "react-icons/io5";
import PostShare from "../posts/PostShare";

function ShareButton(props) {
    const [openShare,setOpenShare] = useState(false);

    return (
        <div className={'w-full h-fit flex items-center justify-center mt-10 absolute bottom-4 left-0'}>
            <button
                onClick={()=>setOpenShare(true)}
                className={'btn bg-gradient-to-r from-[rgba(0,234,151,1)] to-[rgba(0,167,243,1)] border-none text-white xl:w-[80%] rounded-lg xl:text-[15px] lg:text-[14px] lg:w-[80%]'}>
                Share
            </button>
            {openShare?
                <div className={'w-screen  h-screen fixed flex items-start pt-20 pb-20  justify-center bg-white/20 backdrop-blur-sm top-0 left-0 z-50'}>
                    <section className={'w-[50%] rounded-md h-fit px-6 py-2 pt-7 bg-white shadow-xl relative'}>
                        <IoClose className={'absolute top-3 right-3 text-gray-400 cursor-pointer text-lg'} onClick={()=>setOpenShare(false)} />
                        <PostShare className1={'inp3'} className2={'inp4'}/>
                    </section>
                </div> : null}
        </div>
    );
}

export default ShareButton;