import React, {useState} from 'react';
import {useAuthContext} from "../context/useAuthContext";
import useDeleteReaction from "../hooks/useDeleteReaction";

function ReactionsMenu({isFromMe,sizeType,indexOfMessage,reactions,index,messageId}) {
    const {authUser} = useAuthContext()
    const [toggle,setToggle]= useState('all')


    const getFilteredReactions = () => {
        if (toggle === 'all'){
            return reactions
        }else if (toggle === 'reaction1'){
            return reactions.filter(reaction => reaction.reaction === reactions[0].reaction)
        }else if (toggle === 'reactionIn1'){
            return [reactions[0]]
        }else if (toggle === 'reactionIn2'){
            return [reactions[1]]
        }
        return reactions
    }
    const filteredReactions = getFilteredReactions()

    const {deleteReaction} = useDeleteReaction()

    const handleAddReaction = async (reactionIndex) => {
        await deleteReaction(messageId,sizeType,index,reactionIndex)
    }


    return (
        <div onClick={(ev)=> ev.stopPropagation()} className={`xl:w-60 xl:h-[250px] lg:w-60  lg:h-[250px] md:w-48 md:h-[220px] sm:w-44 sm:h-[200px] w-40 h-[180px] flex flex-col cursor-default items-center justify-start bg-[rgba(219,220,220,1)] py-2 rounded-lg ${isFromMe?'chatmateDropdown':'myDropdown'} ${(sizeType === 'photos' || sizeType === 'videos')?indexOfMessage <1 ? 'top':'bottom':indexOfMessage < 2 ? 'top':'bottom'} `}>
            <div className={'w-full h-[15%]   px-2  flex items-center justify-start'}>
                <section
                    onClick={() => setToggle('all')}
                    className={`w-fit h-full  mr-2 ${toggle === 'all'? 'border-b-2 border-b-customGreenBorder':''} flex items-center justify-center`}>
                    <h4 className={'text-black xl:text-lg lg:text-lg md:text-md sm:text-md text-sm'}>All</h4>
                    <span className={'text-black xl:text-sm lg:text-sm md:text-sm sm:text-sm ml-2 text-[10px]'}>{reactions.length}</span>
                </section>
                {reactions.length === 2 && reactions[0].reaction === reactions[1].reaction  ? <section
                    onClick={() => setToggle('reactionBoth')}
                    className={`w-fit h-full  mr-2 ${toggle === 'reactionBoth'? 'border-b-2 border-b-customGreenBorder':''} flex items-center justify-center`}>
                    <h4 className={' xl:text-lg lg:text-lg md:text-md sm:text-md text-sm'}>{reactions[0].reaction}</h4>
                    <span className={'text-black xl:text-sm lg:text-sm md:text-sm sm:text-sm text-[10px] ml-2'}>2</span>
                </section> : (<div className={'w-fit h-full flex items-center justify-center'}>
                    { reactions.length === 1 && reactions[0].reaction && <section
                        onClick={() => setToggle('reaction1')}
                        className={`w-fit h-full mr-2 ${toggle === 'reaction1'? 'border-b-2 border-b-customGreenBorder':''} flex items-center justify-center`}>
                        <h4 className={'xl:text-lg lg:text-lg md:text-md sm:text-md text-sm'}>{reactions[0].reaction}</h4>
                        <span className={'text-black xl:text-sm lg:text-sm md:text-sm sm:text-sm text-[10px] ml-2'}>1</span>
                    </section>}
                    { reactions.length === 2 && reactions[0].reaction !== reactions[1].reaction && reactions[1].reaction &&
                        <div className={'w-fit h-full flex items-center justify-center'}>
                            <section
                                onClick={() => setToggle('reactionIn1')}
                                className={`w-fit h-full mr-2 ${toggle === 'reactionIn1'? 'border-b-2 border-b-customGreenBorder':''} flex items-center justify-center`}>
                                <h4 className={'xl:text-lg lg:text-lg md:text-md sm:text-md text-sm'}>{reactions[0].reaction}</h4>
                                <span className={'text-black  xl:text-sm lg:text-sm md:text-sm sm:text-sm text-[10px] ml-2'}>1</span>
                            </section>
                            <section
                                onClick={() => setToggle('reactionIn2')}
                                className={`w-fit h-full ${toggle === 'reactionIn2'? 'border-b-2 border-b-customGreenBorder':''} flex items-center justify-center`}>
                                <h4 className={'xl:text-lg lg:text-lg md:text-md sm:text-md text-sm'}>{reactions[1].reaction}</h4>
                                <span className={'text-black  xl:text-sm lg:text-sm md:text-sm sm:text-sm text-[10px]  ml-2'}>1</span>
                            </section>
                        </div>
                    }
                    </div>
                )}
            </div>
            <div className={'w-full h-[85%]  flex flex-col items-center justify-start pt-3'}>
                {filteredReactions.map((reaction, index) => (
                    <section key={index} className={`w-full px-2 py-2 h-fit  flex items-center justify-between ${reaction.senderId._id === authUser._id? 'cursor-pointer hover:bg-cyan-400' : ''} `}>
                        <div className={'w-fit h-full flex items-center justify-center'}>
                            <img src={reaction.senderId.images.profileImage} className={'xl:w-10 xl:h-10 lg:w-10 lg:h-10 md:h-8 md:w-8 sm:w-8 sm:h-8 w-8 h-8 rounded-full mr-2'}/>
                            <div onClick={authUser._id === reaction.senderId._id?() => handleAddReaction(index):null} className={'w-fit h-fit flex flex-col items-start justify-center'}>
                                <h3 className={'text-black xl:text-sm lg:text-sm md:text-sm sm:text-sm text-[10px]  font-sans font-[500] m-0'}>{reaction.senderId.fullName === authUser.fullName ?'You':reaction.senderId.fullName  }</h3>
                                {authUser._id === reaction.senderId._id && <p className={'text-black font-sans font-[500] xl:text-sm lg:text-sm md:text-sm sm:text-sm text-[10px] m-0'}>Select to remove</p>}
                            </div>
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
}

export default ReactionsMenu;