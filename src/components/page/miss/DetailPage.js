/**
 * ./src/components/page/miss/DetailPage.js
 * 상세 페이지(실종, 목격 공통)
 */

// import components
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Slider from 'react-slick';

// import about firebase
import { db } from '../../../firebase';
import { getAuth } from 'firebase/auth';
import { getDocs, collection, query, orderBy, updateDoc, doc } from 'firebase/firestore';

// import style
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './DetailPage.scss';

export const DetailPage = (props) => {
    const [profiles, setProfiles] = useState([]); // 가져올 게시글 내용

    const currUser = getAuth().currentUser; // 현재 로그인한 유저 정보

    let { id } = useParams();
    const no = id;

    const navigate = useNavigate();
    const location = useLocation();

    // 바로 이전 페이지로 이동
    const back = () => {
        navigate(-1);
    };

    // 찾음 버튼 구현
    const handleVisible = async () => {
        await handleFind();
        alert("찾음 처리되었습니다");
        navigate(-1);
    }

    // 게시글 문서 내에 visibled 필드를 false로 바꿈
    const handleFind = async () => {
        const idRef = Array.from(profiles)[0].id;
        const docRef = doc(db, props.cg, idRef.trim());

        await updateDoc(docRef, {
            visibled: false
        });
    };

    // 상세 페이지 내 사진 carousel 설정
    const DetailCarousel = () => {
        const settings = {
            dots: true,
            autoplay: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite: true,
            arrows: false,
            lazyLoad: true,
        };
    
        return (
            <>
            <Slider {...settings}>
                {profiles[0].imgs.map((url, i) =>
                <img src={url} width={500} height={500} key={i}/>
                )}
            </Slider>
            </>
        );
    };

    // useEffect
    useEffect(() => {

        const fetchData = async () => {
            // 여기서 비동기 작업 수행
            const QuerySnapshot = await getDocs(query(collection(db, props.cg), orderBy("uploadTime", "desc")));
            const data = QuerySnapshot.docs.map((doc, i) => ({
                    // ids: i,
                    ...doc.data()
                }
            ));

            // data의 ids+1 과 파라미터를 가져와 비교해서 같은 수면 return
            const detail = data.filter((d) => {
                if(d.id === no) {
                    return d;
                }
            });

            // profiles useState() set
            setProfiles(detail);
        };

        // fetch
        fetchData();
    }, [location]);

    // profiles가 비어있지 않은 상태에서 cg 값에 따라 실종, 목격 구분
    return (
        <>
        <div className="detail-page">
            <div className="title-btn">
            <h2>상세 페이지</h2>
            <button className="goBack-btn" onClick={back}>뒤로가기</button>
            </div>
        
        {profiles.length > 0 && props.cg === "Missing" && (
            <>
            <div className="detail-page2">
            
                <div className="imgs">
                    <DetailCarousel />
                </div>

                <div className="detailContent">
                    <h3>🐶{profiles[0].name}🐶</h3>
                    <p>실종 위치: {profiles[0].address}</p>
                    <p>실종 시간: {profiles[0].date} </p>
                    <p>종: {profiles[0].specify}</p>
                    <p>나이: {profiles[0].age}</p>
                    <p>성별: {profiles[0].gender}</p>
                    <p>중성화 여부: {profiles[0].neutering}</p>
                    <p>카카오톡 아이디: {profiles[0].kakaoId}</p>
                    <p>털색: {profiles[0].farColor1}, {profiles[0].farColor2} </p>
                    <p>특징: {profiles[0].feature}</p>
                    <div className="upload-date">
                        <p>업로드 날짜: {profiles[0].uploadTime.toDate().toLocaleDateString()} / {profiles[0].uploadTime.toDate().toLocaleTimeString()}</p>
                    </div>
                    {(currUser != null) && (currUser.uid == profiles[0].uid) && <button className="found-btn" onClick={handleVisible}>찾았어요</button>}
                </div>
            </div>
            </>
        )}

        {profiles.length > 0 && props.cg === "Finding" && (
            <div className="detail-page2">
                <div className="imgs">
                    {profiles[0].imgs.map((url, i) => <img src={url} width={300} height={300}/>)}
                </div>
                <div className="detailContent">
                <div className="detailText">
                    <h3>🐶{profiles[0].address}</h3><p>&ensp;에서 목격했어요</p><h3>🐶</h3></div>
                <p>품종: {profiles[0].specify}</p>
                <p>성별: {profiles[0].gender}</p>
                <p>추정 나이: {profiles[0].age}</p>
                <p>모색: {profiles[0].farColor1}, {profiles[0].farColor2} </p>
                <p>중성화 여부: {profiles[0].neutering}</p>
                <p>목격 시간: {profiles[0].date ? profiles[0].date.split("T")[0] : ""} {profiles[0].date ? profiles[0].date.split("T")[1] : ""}</p>
                <p>특징: {profiles[0].feature}</p>
                <p>카카오톡 아이디: {profiles[0].kakaoId}</p>
                <div className="upload-date">
                    <p>업로드 날짜: {profiles[0].uploadTime.toDate().toLocaleDateString()} / {profiles[0].uploadTime.toDate().toLocaleTimeString()}</p>
                </div>
                {(currUser != null) && (currUser.uid == profiles[0].uid) && <button className="found-btn" onClick={handleVisible}>찾았어요</button>}
                </div>
            </div>
        )}
        <br/><br/><br/>
        </div>
        </>
    );
}