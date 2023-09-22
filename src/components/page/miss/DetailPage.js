/**
 * ./src/components/page/miss/DetailPage.js
 * 상세 페이지(실종, 목격 공통)
 */

// import components
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Slider from 'react-slick';
import Card from './card';

// import about firebase
import { db, auth } from '../../../firebase';
import { getDocs, collection, query, orderBy, updateDoc, doc, where } from 'firebase/firestore';

// import style
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../../../style/DetailPage.scss';
import '../../../style/carouselDots.css';

export const DetailPage = (props) => {
    const [profiles, setProfiles] = useState([]); // 가져올 게시글 내용
    const [uploader, setUploader] = useState([]); // 가져온 게시글의 게시자 정보
    const [isOpen, setIsOpen] = useState(false); // toggle 조절

    const currUser = auth.currentUser; // 현재 로그인한 유저 정보

    let { id } = useParams();
    const no = id;

    const navigate = useNavigate();
    const location = useLocation();

    // 바로 이전 페이지로 이동
    const back = () => {
        navigate(-1);
    };

    // 찾음 버튼 구현
    const handleVisible = async (event) => {
        // event.preventDefault();
        
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

    // Carousel 설정
    const settings = {
        dots: true,
        autoplay: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
        arrows: false,
        lazyLoad: true,
        dotsClass: 'dots'
    };

    // 상세 페이지 내 사진 carousel
    const DetailCarousel = () => {
        // window.scrollTo({ top: 0 });

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

    // 글 올린 사용자 정보
    const UploaderInfo = () => {
        return (
            <>
                <br />
                <div>
                    <button className='ul-btn' type="button" onClick={() => {
                        setIsOpen((e) => !e);
                    }}>{isOpen ? "▼  게시자 연락처 정보 닫기" : "▲  게시자 연락처 정보 열기"}</button>
                    <br /><br />
                    {isOpen && ((uploader.length > 0) ? (
                        <>
                            <p>email: {uploader[0].Email}</p>
                            <p>연락처: {uploader[0].PhoneNumber}</p>
                        </>
                    ) : (
                        <>
                            <p>카카오톡 아이디: {profiles[0].kakaoId}</p>
                        </>
                    ))}
                </div>
            </>
        )
    }

    const FindSimilarContent = async () => {
        // 비교하려는 카테고리의 게시글 배열 가져오기
        const QuerySnapshot = await getDocs(query(collection(db, props.cg), orderBy("uploadTime", "desc")));
        const data = QuerySnapshot.docs.map((doc, i) => ({
            ...doc.data()
        }
        ));

        // 게시글 개수 크기의 배열 생성 및 초기화
        const numArr = Array.from({length: data.length}, () => 0);

        // 게시글 순서대로 각 조건들 비교
        // 비교해서 같으면 count 증가
        // farColor1, farColor2, address, age, date, gender, specify
        data.map(function(d, i) {
            // console.log(profiles[0]);
            if(profiles[0].farColor1 === d.farColor1) numArr[i] += 1; // 모색1
            if(profiles[0].farColor2 === d.address) numArr[i] += 1; // 모색2
            if(profiles[0].address === d.farColor1) numArr[i] += 1; // 주소
            if(profiles[0].age === d.age) numArr[i] += 1; // 나이
            if(profiles[0].date === d.date) numArr[i] += 1; // 날짜
            if(profiles[0].gender === d.gender) numArr[i] += 1; // 성별
            if(profiles[0].specify === d.specify) numArr[i] += 1; // 품종
        })
        // console.log(numArr);

        // count가 3 이상인 게시글만 인덱스 도출
        // 문제: 처음 찾은 하나만 리턴함 다른 방법 찾기
        const resultArr = numArr.findIndex(n => n > 2);
        console.log(resultArr);

        // 해당 게시글로만 배열 생성

        // 배열 return
    }

    // 유사한 게시글
    // cg == Missing : 실종 게시글에서 목격 게시글 비교
    // cg == Finding : 목격 게시글에서 실종 게시글 비교
    const SimilarContent = (cg) => {
        // 조건 7개 중 3개 이상 일치하는 게시물 도출
        // Missing
        FindSimilarContent();
        // Slider에 띄우기

        // Finding

        return (
            <>
            <div className="sc-div">
                <Slider {...settings}>
                    {/* {Array.from(postdata).map((item, i) => <Card profiles={item} i={i+1} key={item.id} cg={division.current}/>)} */}
                </Slider>
            </div>
            </>
        )
    }

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

    useEffect(() => {
        const fetchData2 = async () => {
            // console.log(profiles[0].uid);

            // 게시글의 게시자 정보 가져오기
            const q = query(collection(db, "Users"), where("uid", "==", profiles[0].uid));
            const getData = await getDocs(q);
            const data = getData.docs.map((doc, i) => ({
                ...doc.data()
            }));

            // console.log(data);
            setUploader(data);
        };

        // fetch
        fetchData2();
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
                    <p>실종 시간: {(profiles[0].date != null) ? `${profiles[0].date.split("T")[0]} ${profiles[0].date.split("T")[1]}` : ""} </p>
                    <p>종: {profiles[0].specify}</p>
                    <p>나이: {profiles[0].age}</p>
                    <p>성별: {profiles[0].gender}</p>
                    <p>중성화 여부: {profiles[0].neutering}</p>
                    <p>털색: {profiles[0].farColor1}, {profiles[0].farColor2} </p>
                    <p>특징: {profiles[0].feature}</p>
                    <div className="upload-date">
                        <p>업로드 날짜: {profiles[0].uploadTime.toDate().toLocaleDateString()} / {profiles[0].uploadTime.toDate().toLocaleTimeString()}</p>
                    </div>
                    <UploaderInfo />
                    {(currUser != null) && (currUser.uid == profiles[0].uid) && <button className="found-btn" onClick={handleVisible}>찾았어요</button>}
                </div>

                <SimilarContent className="similar-content" cg="Missing" />
            </div>
            </>
        )}

        {profiles.length > 0 && props.cg === "Finding" && (
            <div className="detail-page2">
                <div className="imgs">
                    <DetailCarousel />
                </div>
                <div className="detailContent">
                <div className="detailText">
                    <h3>🐶{profiles[0].address}</h3><p>&ensp;에서 목격했어요</p><h3>🐶</h3></div>
                <p>품종: {profiles[0].specify}</p>
                <p>성별: {profiles[0].gender}</p>
                <p>추정 나이: {profiles[0].age}</p>
                <p>모색: {profiles[0].farColor1}, {profiles[0].farColor2} </p>
                <p>목격 시간: {profiles[0].date ? profiles[0].date.split("T")[0] : ""} {profiles[0].date ? profiles[0].date.split("T")[1] : ""}</p>
                <p>특징: {profiles[0].feature}</p>
                <div className="upload-date">
                    <p>업로드 날짜: {profiles[0].uploadTime.toDate().toLocaleDateString()} / {profiles[0].uploadTime.toDate().toLocaleTimeString()}</p>
                </div>
                <UploaderInfo />
                {(currUser != null) && (currUser.uid == profiles[0].uid) && <button className="found-btn" onClick={handleVisible}>찾았어요</button>}
                </div>

                <SimilarContent className="similar-content" cg="Finding" />
            </div>
        )}
        <br/><br/><br/>
        </div>
        </>
    );
}