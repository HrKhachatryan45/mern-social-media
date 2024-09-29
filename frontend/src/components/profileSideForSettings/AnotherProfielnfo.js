import React, {useState} from 'react';
import useListenProfile from "../../hooks/useListenProfile";

function ProfileInfo({authUser2}) {
    useListenProfile()


    let formattedDate

    if (authUser2.info.birthDay){
        const date = new Date(authUser2.info.birthDay);
        const options = {year: 'numeric', month: 'long', day: 'numeric'};
        formattedDate = date.toLocaleDateString('en-US', options);

    }


    return (
        <div className={'w-full h-fit max-h-fit bg-[#FAFAFA] xl:rounded-3xl lg:rounded-2xl md:rounded-xl sm:rounded-lg rounded-md xl:mt-4 lg:mt-3 md:mt-2 sm:mt-1 mt-1 xl:px-4 lg:px-3 md:px-3 sm:px-2 px-1 xl:pt-5 lg:pt-4 md:pt-3 sm:pt-2 pt-1 pb-1'}>
            <section className={'w-full h-fit flex items-center justify-between mb-5'}>
                <h2 className={'text-black xl:text-lg lg:text-md md:text-sm sm:text-sm text-[10px] font-bold'}>Profile Info</h2>
            </section>
            <div className={'flex items-center justify-start xl:mb-2 lg:mb-2 md:mb-1 sm:mb-1 mb-[2px]'}>
                <h3 className={'text-black  xl:text-md lg:text-sm md:text-sm sm:text-[10px] text-[10px] font-bold'}>Full Name :</h3>
                <h4 className={'text-black  xl:text-md lg:text-sm md:text-sm sm:text-[10px] text-[10px] ml-1'}>{authUser2.fullName}</h4>
            </div>
            <div className={'flex items-center justify-start xl:mb-2 lg:mb-2 md:mb-1 sm:mb-1 mb-[2px]'}>
                <h3 className={'text-black  xl:text-md lg:text-sm md:text-sm sm:text-[10px] text-[10px] font-bold'}>Location :</h3>
                <h4 className={'text-black  xl:text-md lg:text-sm md:text-sm sm:text-[10px] text-[10px] ml-1'}>{authUser2.info.location}</h4>
            </div>
            <div className={'flex items-center justify-start xl:mb-2 lg:mb-2 md:mb-1 sm:mb-1 mb-[2px]'}>
                <h3 className={'text-black  xl:text-md lg:text-sm md:text-sm sm:text-[10px] text-[10px] font-bold'}>Birthday :</h3>
                <h4 className={'text-black  xl:text-md lg:text-sm md:text-sm sm:text-[10px] text-[10px] ml-1'}>{formattedDate}</h4>
            </div>
            <div className={'flex items-center justify-start xl:mb-2 lg:mb-2 md:mb-1 sm:mb-1 mb-[2px]'}>
                <h3 className={'text-black  xl:text-md lg:text-sm md:text-sm sm:text-[10px] text-[10px] font-bold'}>Email :</h3>
                <h4 className={'text-black  xl:text-md lg:text-sm md:text-sm sm:text-[10px] text-[10px] ml-1'}>{authUser2.email}</h4>
            </div>
            <div className={'flex items-center justify-start xl:mb-2 lg:mb-2 md:mb-1 sm:mb-1 mb-[2px] overflow-hidden'}>

                <p className={'text-black  xl:text-md lg:text-sm md:text-sm sm:text-[10px] text-[10px]'}>
                    <span className={'text-black  xl:text-md lg:text-sm md:text-sm sm:text-[10px] text-[10px] font-bold mr-2'}>Biography :</span>{authUser2.info.bio}</p>
            </div>


        </div>
    );
}

export default ProfileInfo;