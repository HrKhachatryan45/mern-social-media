import React from 'react';
import useGetTrendings from "../../hooks/useGetTrendings";

function TrendCard({isPhoneSize}) {
    const {allTrendings,loading} = useGetTrendings()
    return (
        <div className={` ${isPhoneSize ?'w-[54.5%] md:w-[31.5%] sm:w-[31.5%] h-[70%] md:h-[70%] sm:h-[70%]  absolute right-2 top-2  md:absolute sm:absolute md:right-12 sm:right-12':''} xl:w-full lg:w-full   xl:h-fit lg:h-fit md:h-fit sm:h-fit  bg-[#FAFAFA] rounded-xl ${allTrendings.length > 0 ?'px-6 pt-6 pb-3':'px-6 pt-3 pb-3'}  flex mt-6  flex-col items-start justify-start   xl:static lg:static  z-[9999]`}>
            {allTrendings.length > 0 ? (
                    <div className={'w-full h-fit flex flex-col items-start justify-center'}>
                        <h2 className={'text-sm xl:text-xl lg:text-lg md:text-lg sm:text-md mb-5 text-black  font-customOne'}>Trends for you</h2>
                        {
                            loading? <span className={'loading loading-spinner'}></span> :
                                allTrendings.map((item, index) => (
                                    <div className={'w-full h-fit mb-2'} key={index}>
                                        <h2 className={'text-[10px] xl:text-lg lg:text-md md:text-md sm:text-sm text-black font-[500]'}>{item._id}</h2>
                                        <h3 className={' text-[10px] text-gray-500 xl:text-sm lg:text-sm md:text-sm sm:text-sm'}>{item.count}  Shares</h3>
                                    </div>
                                ))
                        }
                    </div>
                )
                :<div className={'w-full h-fit flex flex-col items-start justify-center'}>
                    <h2 className={' xl:text-xl lg:text-lg md:text-lg sm:text-md text-black font-customOne'}>No trends for you</h2>
                </div>
            }

        </div>
    );
}

export default TrendCard;