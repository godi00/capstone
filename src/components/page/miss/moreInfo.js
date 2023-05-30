/**
 * ./src/components/page/miss/MissPage.js
 * 실종 | 최근 실종 순 더보기란
 */

import React, {useState, useEffect} from "react";
import { getAuth } from "firebase/auth";
import { getDocs, collection, query, orderBy } from "firebase/firestore";
import { db } from "../../../firebase";

import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import '../../../style/style.css';
import "./moreInfo.scss";

const MoreinfoPage = () => {
    const [missPost, setMissPost] = useState([]);

    const navigate = useNavigate();
    const auth = getAuth();
    
    const toUpload = () => {
        if(auth.currentUser == null) {
            alert("로그인이 필요합니다");
        }
        else {
            navigate(`/miss/upload`); // 업로드 페이지로 이동
        } 
    };

    const toBack = () => {
        navigate(`/miss`); // 실종 게시판으로 이동
    }

    const onClickListener = (visibled) =>{
        if(visibled==false) {
            alert("가족의 품으로 돌아간 반려견입니다.");
        }
    }

    useEffect(() => {
        // firebase의 Missing Collection에서 글 목록 가져오기
        const setPost = async () => {
            const QuerySnapshot = await getDocs(query(collection(db, "Missing"), orderBy("uploadTime", "desc")));
            const data = QuerySnapshot.docs.map((doc, i) => ({
                ids: i,
                ...doc.data()
            }));
            // console.log(Array.from(data));
            setMissPost(Array.from(data));
        }

        setPost();
    }, []);

    return (
        <>
            <div className="moreInfo-page">
                <div className="moreInfo-page-upload-btn">
                <h2>실종 게시판</h2>
                <button className="moreInfo-page-Back-btn" type="button" onClick={toBack}>뒤로 가기</button>
                <button className="moreInfo-page-upload-btn2" type="button" onClick={toUpload}>실종 등록하기</button>
                </div>

                <br/>
                <div className="moreInfo-table">
                <h3>최근 실종 순</h3> 
                <table className="moreInfo-table2">
                    <th width="6%">번호</th>
                    <th width="35%">사진</th>
                    <th width="10%">이름</th>
                    <th widht="15%">실종일</th>
                    <th width="11%">작성자</th>
                    <th width="17%">작성일</th>
                    {missPost.map(({ user, name, uploadTime, date, imgs, ids, id, visibled }) => (
                    <ItemStyle className="moreInfo-table-td" key={id} visibled={visibled}>
                        <td>
                            <p className="moreInfo-table-td-number" key={ids}>{ids+1}</p>
                        </td>
                        <td>
                            <img className="moreInfo-table-td-imgs" key={ids} src={imgs[0]} width="30%"/>
                        </td>
                        <td>
                            <Link to={visibled && `/miss/moreInfo/detail/${id}` || !visibled && ``} onClick={() => onClickListener(visibled)}>
                                <p className="moreInfo-table-td-name" key={ids}>{name}</p>
                            </Link>
                        </td>
                        <td>
                            <p className="moreInfo-table-td-date" key={ids}>{(date != null) ? date : ""}</p>
                        </td>
                        <td>
                            <p className="moreInfo-table-td-user" key={ids}>{user != null ? user : "익명"}</p>
                        </td>
                        <td>
                            <p className="moreInfo-table-td-uploadDate" key={ids}>{uploadTime.toDate().toLocaleDateString()}</p>
                        </td>
                    </ItemStyle>       
                    ))}
                </table>
                <br/><br/>
                </div> 
            </div>
        </>
    );
};

const ItemStyle = styled.tr`
  ${({ visibled }) => {
    return visibled ? null: `filter: grayscale(100%); opacity: 80%;`;
  }}
`;

export default MoreinfoPage