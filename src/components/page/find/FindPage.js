/**
 * ./src/components/page/find/FindPage.js
 * 목격 게시판
 */

// import components
import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../../firebase";
import Carousel from "../miss/carousel";
import { PieChart } from "../miss/PieChart";
import { BarChart } from "../miss/BarChart";

// import style
import "../../../style/FindPage.scss";

export const FindPage = () => {
    const navigate = useNavigate();

    const toUpload = () => {
        if(auth.currentUser == null){
            alert("로그인이 필요한 서비스입니다.");
            navigate(`/login`);
        }
        else{ navigate(`/find/upload`); } // 업로드 페이지로 이동
    }

    const toMoreInfo = () => {
        navigate(`/find/moreInfo`); // 최신 순 더보기로 이동
    }

    return (
        <>
            <div className="find-page">
                <div className="find">
                    <h2>목격 게시판</h2>
                    <button className="find-page-upload-btn" type="button" onClick={toUpload}>목격 등록하기</button>
                </div>

                <br/>
                
                <div className="findpage-moreInfo">
                    <h3>최근 목격 순</h3> 
                    <button className="findpage-moreInfo-btn" type="button" onClick={toMoreInfo}>더보기</button>
                </div>
                
                <Carousel category={"Finding"} cg={"Finding"}/>
                
                <div className="findpage-chart">
                    <div className="find-pie">
                        <span className="find-pie-p1">《 가족의 품으로 돌아간 반려견의 비율이 얼마나 될까요? 》</span>
                        <PieChart className="find-pie-chart" cg="Finding" />
                    </div>
                    <div className="find-bar">
                        <p className="find-bar-p1">《 각 자치구 마다 목격된 반려견이 얼마나 있을까요? 》</p>
                        <BarChart className="find-bar-chart" cg="Finding" />
                    </div>
                </div>
                
            </div>
        </>
    );
};