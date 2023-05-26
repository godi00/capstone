/**
 * ./src/components/page/find/FindMoreInfo2.js
 * 목격 우리 지역 관련 순 더보기란
 */

import React from "react";
import { useNavigate } from "react-router-dom";

import '../../../style/style.css';

const FindMoreinfoPage = () => {
    const navigate = useNavigate();

    const toUpload = () => {
        navigate(`/find/upload`); // 등록 페이지로 이동
    }

    return (
        <>
            <div className="moreInfo-page">
                <h2>목격 게시판</h2>
                <br/><br/>
                <button type="button" onClick={toUpload}>목격 등록하기</button>
                <br/><br/><br/>
                <h3>우리 지역 관련 순</h3> 
                <br/>
            </div>
        </>
    );
};

export default FindMoreinfoPage