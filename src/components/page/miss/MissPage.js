/**
 * ./src/components/page/miss/MissPage.js
 * 실종 게시판
 */

// import components
import React from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import Carousel  from "./carousel";
import { PieChart } from "./PieChart";
import { BarChart } from "./BarChart";

// import style
import "../../../style/MissPage.scss";

export const MissPage = () => {
    const navigate = useNavigate();
    const auth = getAuth();
    
    const toUpload = () => {
        if(auth.currentUser == null){
            alert("로그인이 필요한 서비스입니다.");
            navigate(`/login`);
        }
        else{ navigate(`/miss/upload`); } // 업로드 페이지로 이동
    }

    const toMoreInfo = () => {
        navigate(`/miss/moreInfo`); // 최신 순 더보기로 이동
    }

    return (
        <>
            <div className="miss-page">
                <div className="miss-page-upload-btn">
                    <h2>실종 게시판</h2>
                    <button className="miss-page-upload-btn2" type="button" onClick={toUpload}>실종 등록하기</button>
                </div>

                <br/>
                
                <div className="misspage-moreInfo-btn">
                    <h3>최근 실종 순</h3> 
                    <button className="misspage-moreInfo-btn2" type="button" onClick={toMoreInfo}>더보기 &gt;</button>
                </div>
                
                <Carousel category={"Missing"} cg={"Missing"}/>
                
                <div className="misspage-chart">
                    <div className="miss-pie">
                        <p className="miss-pie-p1">《 실종된 반려견들이 가족의 품으로 돌아간 비율이 얼마나 될까요? 》</p>
                        <PieChart className="miss-pie-chart" cg="Missing" />
                    </div>
                    <div className="miss-bar">
                        <p className="miss-bar-p1">《 각 자치구 마다 실종된 반려견이 얼마나 있을까요? 》</p>
                        <BarChart className="miss-bar-chart" cg="Missing" />
                    </div>
                </div>
                
            </div>
        </>
    );
};