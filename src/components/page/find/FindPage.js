/**
 * ./src/components/page/find/FindPage.js
 * 목격 게시판
 */

// import components
import React from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import Carousel from "../miss/carousel";
import { PieChart } from "../miss/PieChart";
import { BarChart } from "../miss/BarChart";

// import style
import "../../../style/FindPage.scss";

export const FindPage = () => {
    const navigate = useNavigate();
    const auth = getAuth();

    const toUpload = () => {
        navigate(`/find/upload`);  // 업로드 페이지로 이동
    }

    const toMoreInfo = () => {
        navigate(`/find/moreInfo`); // 최신 순 더보기로 이동
    }

    return (
        <>
            <div className="find-page">
                <div className="find-page-upload-btn">
                    <h2>목격 게시판</h2>
                    <button className="find-page-upload-btn2" type="button" onClick={toUpload}>목격 등록하기</button>
                </div>

                <br/>
                
                <div className="find-page-moreInfo-btn">
                    <h3>최근 목격 순</h3> 
                    <button className="find-page-moreInfo-btn2" type="button" onClick={toMoreInfo}>더보기</button>
                </div>
                
                <Carousel category={"Finding"} cg={"Finding"}/>
                
                <div className="findpage-chart">
                    <div className="find-pie">
                        <p className="find-pie-p1">《 목격된 반려견들이 가족의 품으로 돌아간 비율이 얼마나 될까요? 》</p>
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