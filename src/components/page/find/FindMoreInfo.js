/**
 * ./src/components/page/find/FindMoreInfo.js
 * 목격 | 최근 목격 순 더보기란
 */

import React, {useState, useEffect} from "react";
import { getDocs, collection, query, orderBy } from "firebase/firestore";
import { db } from "../../../firebase";

import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import '../../../style/style.css';
import "../../../style/moreInfo.scss";
import '../../../style/table.scss';

const FindMoreinfoPage = () => {
    const [findPost, setFindPost] = useState([]);

    const navigate = useNavigate();

    const toUpload = () => {
        navigate(`/find/upload`); // 등록 페이지로 이동
    };

    const toBack = () => {
        navigate(`/find`); // 목격 게시판으로 이동
    }

    const onClickListener = (visibled) =>{
        if(visibled==false){
            alert("가족의 품으로 돌아간 반려견입니다.");
        }
    }

    useEffect(() => {
        // firebase의 Missing Collection에서 글 목록 가져오기
        const setPost = async () => {
            const QuerySnapshot = await getDocs(query(collection(db, "Finding"), orderBy("uploadTime", "desc")));
            const data = QuerySnapshot.docs.map((doc, i) => ({
                ids: i,
                ...doc.data()
            }));
            // console.log(Array.from(data));
            setFindPost(Array.from(data));
        }

        setPost();
    }, []);

    return (
        <>
            <div className="moreInfo-page">
                <div className="moreInfo-page-upload-btn">
                <h2>목격 게시판</h2>
                <button className="moreInfo-page-Back-btn" type="button" onClick={toBack}>뒤로 가기</button>
                <button className="moreInfo-page-upload-btn2" type="button" onClick={toUpload}>목격 등록하기</button>
                </div>

                <br/>
                <div className="find-moreInfo">
                <h3>최근 목격 순</h3>
                <table className="find-moreInfo-table">
                    <th width="6%">번호</th>
                    <th width="30%">사진</th>
                    <th width="15%">목격 장소</th>
                    <th>목격일</th>
                    <th width="11%">작성자</th>
                    <th width="17%">작성일</th>
                    <tbody>
                    {findPost.map(({ user, address, uploadTime, date, imgs, ids, id, visibled }) => (
                    <ItemStyle className="moreInfo-table-td" key={id} visibled={visibled}>
                        <td>
                            <p className="moreInfo-table-td-number" key={ids}>{ids+1}</p>
                        </td>
                        <td>
                            <img className="moreInfo-table-td-imgs" key={ids} src={imgs[0]} width="30%"/>
                        </td>
                        <td>
                            <Link to={visibled && `/find/moreInfo/detail/${id}` || !visibled && ``} onClick={() => onClickListener(visibled)}>
                                <p className="moreInfo-table-td-adress" key={ids}>{address}</p>
                            </Link>
                        </td>
                        <td>
                            <p className="moreInfo-table-td-date" key={ids}>{(date != null) ? `${date.split("T")[0]} ${date.split("T")[1]}` : ""}</p>
                        </td>
                        <td>
                            <p className="moreInfo-table-td-user" key={ids}>{user != null ? user : "익명"}</p>
                        </td>
                        <td>
                            <p className="moreInfo-table-td-uploadDate" key={ids}>{uploadTime.toDate().toLocaleDateString()}</p>
                        </td>
                    </ItemStyle>       
                    ))}
                    </tbody>
                </table>
                <br/><br/>
                </div>
            </div>
        </>
    );
};

const ItemStyle = styled.tr`
  ${({ visibled }) => {
    return visibled ? null : `filter: grayscale(100%); opacity: 80%;`;
  }}
`;

export default FindMoreinfoPage