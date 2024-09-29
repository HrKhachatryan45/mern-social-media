import React from 'react';
import {Link} from "react-router-dom";
import {FiSearch} from "react-icons/fi";

function SearchInput(props) {
    return (
        <div className={'flex items-center xl:px-0 lg:px-0 md:px-0 sm:px-2 px-1 justify-between'}>
            <section className={'w-[25%]'}>
                <Link to={'/'}>
                    <img className={'xl:w-[56px] xl:h-[56px] lg:w-[50px] lg:h-[50px] md:w-[42px] md:h-[42px] sm:w-[40px] sm:h-[40px] w-[32px] h-[32px]'}
                         src={'https://cdn-icons-png.flaticon.com/512/1177/1177585.png'}/>
                </Link>
            </section>
            <section className={'flex w-[70%] items-center justify-center relative'}>
                <input
                    className={'pl-1 focus:outline-none focus:border-1 focus:border-customGreen input xl:text-[15px] lg:text-[13px] md:text-[12px] sm:text-[10px] text-[10px]  w-full input-bordered bg-[#E4E6E5] xl:h-10 lg:h-9 md:h-8 sm:h-8 h-6 '}
                    type={'text'}
                    placeholder={'#Explore'}
                />
                <button
                    className={'xl:w-10 xl:h-10 lg:w-9 lg:h-9 md:h-8 md:w-8 sm:w-8 sm:h-8 w-6 h-6  flex items-center justify-center rounded-lg  absolute right-0 top-0   bg-gradient-to-r from-[rgba(0,234,151,1)] to-[rgba(0,167,243,1)] border-none text-white'}>
                    <FiSearch className={'xl:text-2xl lg:text-xl'}/>
                </button>
            </section>
        </div>
    );
}

export default SearchInput;