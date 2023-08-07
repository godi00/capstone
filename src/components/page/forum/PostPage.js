/**
 * ./src/components/page/forum/PostPage.js
 * 자유 게시판
 */

import React, {useState, useEffect} from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getDocs, collection, query, orderBy } from "firebase/firestore";
import { db } from "../../../firebase.js";

// import style
import "../../../style/ForumPage.scss";
import '../../../style/table.scss';

export const PostPage = () => {
    const [posting, setPosting] = useState([]); // 가져올 게시글 내용
    const [postNum, setPostNum] = useState(0); // 총 게시글 개수

    let { id } = useParams();
    const no = id;

    const navigate = useNavigate();
    const location = useLocation();

    const handleBack = () => {
        navigate(`/forum/posting`); // 자유게시판 목록으로 이동
    };

    const handleNext = () => {
        navigate(`/forum/posting/${(parseInt(no, 10) - 1)}`); // 다음 게시글로 이동(최신)
    }

    const handlePrevious = () => {
        navigate(`/forum/posting/${(parseInt(no, 10) + 1)}`); // 이전 게시글로 이동(과거)
    }

    // useEffect
    useEffect(() => {

        const fetchData = async () => {
            // 여기서 비동기 작업 수행
            const QuerySnapshot = await getDocs(query(collection(db, "Forum"), orderBy("uploadTime", "desc")));
            const data = QuerySnapshot.docs.map((doc, i) => ({
                    ids: i,
                    ...doc.data()
                }
            ));

            setPostNum(data.length);

            // data의 ids+1 과 파라미터를 가져와 비교해서 같은 수면 return
            const detail = data.filter((d) => {
                if((d.ids + 1) === parseInt(no, 10)) {
                    return d;
                }
            });

            // posting useState() set
            setPosting(detail);
        };

        // fetch
        fetchData();

        // console.log(Array.from(posting));
    }, [location]);

    return (
        <>
            <div className='post-detail-page'>
            <h2>자유게시판</h2>
            <br/>
                <div className='post-detail-page2'>
                    <button className='next-button' onClick={handleNext} disabled={parseInt(no) === 1 ? true : false}>다음 게시글</button>
                    <button className='pre-button' onClick={handlePrevious} disabled={parseInt(no) === postNum ? true : false}>이전 게시글</button>
                    <br/><br/>

                    {posting.length > 0 && (
                        <table className='post-detail-table'>
                        <tr>
                            <th>번호</th>
                            <td>
                                <p>{parseInt(posting[0].ids, 10) + 1}</p>
                            </td>
                            <th>제목</th>
                            <td>
                                <p>{posting[0].title}</p>
                            </td>
                        </tr>

                        <tr>
                            <th>작성일</th>
                            <td>
                                <p>{posting[0].uploadTime.toDate().toLocaleDateString()} {posting[0].uploadTime.toDate().toLocaleTimeString()}</p>
                            </td>
                            <th>작성자</th>
                            <td>
                                <p>{posting[0].user}</p>
                            </td>
                        </tr>
                        
                        <tr>
                            <th>내용</th>
                            <td className='content-td' colSpan={3}>
                                <p style={{ whiteSpace: 'pre-line' }}>{posting[0].content.join('\n')}</p>
                            </td>
                        </tr>
                    </table>
                    )}

                    <button className='Post-back-btn' onClick={handleBack}>목록</button>
                </div>
            </div>
        </>
    )
}