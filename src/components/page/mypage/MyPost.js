/**
 * ./src/components/page/mypage/MyPost.js
 * 유저 자신이 쓴 글 목록
 */

// import components
import { Link, useNavigate } from 'react-router-dom';

// import about firebase
import { db } from '../../../firebase';
import { doc, getDoc } from 'firebase/firestore';

// import style
import '../../../style/style.css';
import '../../../style/mypage.scss';
import { useEffect, useState } from 'react';


export const MyPost = () => {
    const [missPost, setMissPost] = useState([]);
    const [findPost, setFindPost] = useState([]);
    const [selectCategory, setSelectCategory] = useState("miss");

    const navigate = useNavigate();

    // 내 정보로 이동
    const toInformation = () => {
        navigate('/mypage/information');
    }

    // 내 게시글로 이동
    const toPost = () => {
        navigate('/mypage/post');
    }

    // useEffect
    useEffect(() => {
        const fetchData = async () => {
            // 유저가 올린 게시글 목록 가져오기
            const userRef = doc(db, "Users", localStorage.getItem("Uid")); // 현재 로그인 한 유저
            const data = (await getDoc(userRef)).data(); // DB에 저장된 유저 정보

            if (data.missing != null) {
                const missId = data.missing.map((id) => id); // 실종 게시판에서 올린 게시글 id 배열

                // id 배열을 기반으로 유저가 작성한 실종 게시글 배열 설정
                const missMap = missId.map((id) => getDoc(doc(db, "Missing", id)));

                // 프로미스가 완료될 때까지 대기
                const p = await Promise.all(missMap);

                // p 배열을 순회하면서 데이터를 추출하여 새 배열 생성
                const newPost = p.map((p) => (p.data()));

                // set missPost. 이전에 추가된 데이터라면 필터링 거침
                setMissPost((prev) => {
                    const filteredPost = newPost.filter(post => !prev.some(prevPost => prevPost?.id === post?.id));
                    const nullFilteredPost = filteredPost.filter(post => post != null);
                    return [...prev, ...nullFilteredPost];
                });
            }
            
            if(data.finding != null) {
                const findId = data.finding.map((id) => id); // 목격 게시판에서 올린 게시글 id 배열

                // id 배열을 기반으로 유저가 작성한 목격 게시글 배열 설정
                const findMap = findId.map((id) => getDoc(doc(db, "Finding", id)));
                const p = await Promise.all(findMap);
                const newPost = p.map((p) => (p.data()));

                // set findPost. 이전에 추가된 데이터라면 필터링 거침
                setFindPost((prev) => {
                    const filteredPost = newPost.filter(post => !prev.some(prevPost => prevPost?.id === post?.id));
                    const nullFilteredPost = filteredPost.filter(post => post != null);
                    return [...prev, ...nullFilteredPost];
                });
            }
        }

        // fetch
        fetchData();
    }, []);

    // 분류 카테고리를 변경했을 때 해당하는 게 뜨도록 함
    const changeCategory = (e) => {
        setSelectCategory(e.target.value);
    }
    
    // select 에서 선택된 것에 따라 실종, 목격 게시글을 보이도록 함
    // 만약 유저가 올린 게시글이 없다면 없다고 뜸
    return (
        <>
            <div className="my-post">
                <div className='my-post-to-btn'>
                    <button className='myPost-toInfo' onClick={toInformation}>내 정보</button>
                    <button className='myPost-toPost' onClick={toPost}>내 게시글</button>
                </div>
                <hr/>

                <div className='my-post-page2'>
                    <div className="my-post-title">
                        <p>🍏 내가 올린 게시글 🍏</p>
                        <select className="postCategory" onChange={changeCategory}>
                            <option value="miss">실종</option>
                            <option value="find">목격</option>
                        </select>
                    </div>
                    <div className="my-post-page3">
                    <table>
                        <thead>
                            <tr>
                                <th>제목</th>
                                <th>작성일</th>
                                <th>찾음 여부</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                            (selectCategory === "miss")
                                ? (missPost.length === 0
                                    ? (
                                        <tr>
                                            <td className='postNotFoundTd' colSpan={3}>작성한 게시글이 없습니다.</td>
                                        </tr>
                                      )
                                    : (
                                        missPost.map((doc, i) => {
                                            return (
                                                <tr key={i}>
                                                    <td>
                                                        <Link to={`/Missing/detail/${doc.id}`}>
                                                            <p>{doc.name}</p>
                                                        </Link>
                                                    </td>
                                                    <td>
                                                        <p>{doc.uploadTime.toDate().toLocaleDateString()}</p>
                                                    </td>
                                                    <td>
                                                        <p>{!doc.visibled ? "O" : "X"}</p>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )
                                )
                                : (findPost.length === 0
                                    ? (
                                        <tr>
                                            <td className='postNotFoundTd' colSpan={3}>작성한 게시글이 없습니다.</td>
                                        </tr>
                                      )
                                    : (
                                        findPost.map((doc, i) => {
                                            return (
                                                <tr key={i}>
                                                    <td>
                                                        <Link to={`/Finding/detail/${doc.id}`}>
                                                            <p>{doc.address}</p>
                                                        </Link>
                                                    </td>
                                                    <td>
                                                        <p>{doc.uploadTime.toDate().toLocaleDateString()}</p>
                                                    </td>
                                                    <td>
                                                        <p>{!doc.visibled ? "O" : "X"}</p>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )
                                )
                            }
                        </tbody>
                    </table>
                    </div>
                </div>
            </div>
        </>
    );
};