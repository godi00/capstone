/**
 * ./src/components/page/main/MainPage.js
 * 메인 홈
 */
import BannerCarousel  from "./banner";
import Explain from "./explain";
import React from "react";
import ReactPlayer from 'react-player'

export const MainPage = () => {
    return (
        <>
            <div className="main-page">
            <BannerCarousel/>
                <br/><br/>
                <div className="Bind">
                <div className="Video">
                <ReactPlayer className="video1" 
                url="https://www.youtube.com/watch?v=XMsDXtFWJ2U" 
                width="400px"
                height="225px"
                playing={true}
                muted={true}
                controls={true}
                />
                <br/><br/>
                <ReactPlayer className="video2" 
                url="https://www.youtube.com/watch?v=tIJjeCMB4Jo" 
                width="400px"
                height="225px"
                playing={true}
                muted={true}
                controls={true}
                />
                </div>
                <Explain/>
                </div>
            </div>
        </>
    );
};