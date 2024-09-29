import React, {useState} from 'react';
import {FiSearch} from "react-icons/fi";

function SearchInput({userValue,onInputChange,isBorder}) {

    return (
        <form onSubmit={(ev)=>ev.preventDefault()} className={'w-full relative h-fit flex items-center justify-center mb-3'}>
            <input
                className={`  w-full input h-8 xl:h-12 lg:h-10 md:h-10 sm:h-8 text-[10px] xl:text-lg lg:text-md md:text-sm sm:text-sm rounded-md xl:rounded-xl lg:rounded-xl md:rounded-xl sm:rounded-xl bg-white ${isBorder ?'focus:outline-none focus:border-customGreen':'focus:outline-none focus:border-1 focus:border-customGreen'} ${isBorder ? 'border-[1px] border-customGreen' : ''}`}
                type={'text'}
                placeholder={'Search...'}
                value={userValue}
                onChange={(ev)=>onInputChange(ev.target.value)}
            />
            <FiSearch type={'submit'} className={'text-customGreen xl:text-2xl lg:text-xl md:text-lg sm:text-md tex cursor-pointer absolute right-2'} />
        </form>
    );
}

export default SearchInput;