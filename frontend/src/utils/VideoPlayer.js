// VideoPlayer.js
import React, { useState, useEffect, useRef } from 'react';
import {
    Player,
    ControlBar,
    PlayToggle,
    CurrentTimeDisplay,
    TimeDivider,
    DurationDisplay,
    VolumeMenuButton,
    FullscreenToggle,
    BigPlayButton,
} from 'video-react';
import 'video-react/dist/video-react.css';

function VideoPlayer({ item }) {




    return (
           <div className={'hio max-w-full m-0'}    style={{
               width: `${item.sizes && item.sizes.videoSizes.width}px`,
           }}>
               <Player
                   playsInline
                   style={{height:'100%'}}
                   src={item.video}
               >
                   <BigPlayButton position="center" />

                   <ControlBar autoHide={false}>
                       <PlayToggle />
                       <VolumeMenuButton horizontal />
                       <CurrentTimeDisplay />
                       <TimeDivider />
                       <DurationDisplay />
                       <FullscreenToggle />
                   </ControlBar>
               </Player>
           </div>
    );
}

export default VideoPlayer;
