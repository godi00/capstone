/**
 * ./src/components/page/search/SearchPage.js
 * 검색 게시판
 */

//아예 specify,gender,farcolor을 carousel함수로 보내서 거기서 검색조건 처리하게 하기
import React, { useEffect, useRef } from "react";
import { db, storage } from "../../../firebase";
import { getDoc, getDocs, collection, updateDoc, addDoc, query, where, orderBy, QuerySnapshot, doc, and, or } from "firebase/firestore";
import { useState } from 'react';
import Slider from 'react-slick';
import Card from '../miss/card';

// import style
import "../../../style/SearchPage.scss";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../../../style/carouselDots.css';

const userInputs = [
    {
        id: "specify",
        label: "품종",
        datas: ["말티즈", "푸들", "포메라니안", "슈나우저", "믹스"]
    },
    {
        id: "gender",
        label: "성별",
        datas: ["수컷", "암컷"]
    },
    {
        id: "farColor",
        label: "모색",
        datas: ["검은색", "갈색", "하얀색", "회색"]
    }
]



export function SearchPage() {
    const [postdata, setpost] = useState(new Map());
    const [slideLength, setslideLength] = useState(1);
    var division = useRef("");

    const find = async (con, farCol) => {
        console.log("2: " + division.current);
        var q;
        let coll = collection(db, division.current);
        
        switch(con.length){
            case 0:
                if(farCol){
                    q = query(coll, and(where("visibled", "==", true), and(or(where("farColor1", "==", farCol), where("farColor2", "==", farCol)))));
                } else{
                    q = query(coll, where("visibled", "==", true));
                }
                break;
            case 1:
                if(farCol){
                    q = query(coll, and(where("visibled", "==", true), where(con[0].label, "==", con[0].data), and(or(where("farColor1", "==", farCol), where("farColor2", "==", farCol)))));  
                } else{
                    q = query(coll, where("visibled", "==", true), where(con[0].label, "==", con[0].data));  
                }
                break;
                
            case 2:
                if(farCol){
                    q = query(coll, and(where("visibled", "==", true), where(con[0].label, "==", con[0].data), where(con[1].label, "==", con[1].data), and(or(where("farColor1", "==", farCol), where("farColor2", "==", farCol))))); 
                } else{
                    q = query(coll, where("visibled", "==", true), where(con[0].label, "==", con[0].data), where(con[1].label, "==", con[1].data)); 
                }
                break;
        }
        Show(q);
    }

    //게시물들 데이터값들 보내줌
    const Show = async (q) => { 
        const QuerySnapshot = await getDocs(q);
        
        const data = QuerySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        
        setpost(data); //postdata값을 세팅시켜줌.
        setslideLength(Math.min(4, data.length));
    }

    const Search = () => {
        
        division.current = document.querySelector("#Division").value;
        console.log("1: " + division.current);
        if(division.current == "ㅡㅡㅡㅡㅡ"){
            alert("실종 | 목격 검색조건을 선택해주세요");
            return 0;
        }

        var constraints = [];   //조건을 지정한 필드들만 배열에 넣어서 전달해줌
        var index = 0;
        var farCol;

        let element = document.querySelector("#specify").value;
        if(element != "ㅡㅡㅡㅡㅡ")
            constraints[index++] = {label:"specify", data:element}; //배열에 조건 이름과 값을 객체로 만들어서 추가
        
        element = document.querySelector("#gender").value;
        if(element != "ㅡㅡㅡㅡㅡ")
            constraints[index++] = {label:"gender", data:element};
        
        element = document.querySelector("#farColor").value;
        if(element != "ㅡㅡㅡㅡㅡ")
            farCol = element;
        
        find(constraints, farCol);
    };

      // carousel 설정
    const settings = {
        dots: true,
        infinite: true,
        speed: 1000,
        slidesToShow: slideLength,
        slidesToScroll: slideLength,
        autoplay: true,
        autoplaySpeed: 3200,
        arrows: false,
        pauseOnHover: true,
        dotsClass: 'dots',
        responsive: [
            {
            breakpoint: 1024,
            settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            infinite: true,
            dots: true
            }
        },
        {
        breakpoint: 600,
            settings: {
            slidesToShow: 2,
            slidesToScroll: 2
        }
        },
        {
            breakpoint: 480,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1
            }
        }
        ]
    };



    return <>
        <div className="search-page">
            <h2>검색 게시판</h2>
            <div className='selectBox'>
                <div className='division2'>
                <h4>분류</h4>
                <select id="Division">
                    <option disabled selected>ㅡㅡㅡㅡㅡ</option>
                    <option value="Missing">실종</option>
                    <option value="Finding">목격</option>
                </select>
                </div>

                {userInputs.map((input)=>(
                    <div className={input.id + "2"}>
                        <h4>{input.label}</h4>
                        <select id={input.id}>
                            <option selected>ㅡㅡㅡㅡㅡ</option>
                            {input.datas.map((item)=>(
                                <option value={item} key={item}>{item}</option>
                            ))}
                        </select>
                    </div>
                ))} 

            </div>

            <button className="searchButton" style={{cursor: "pointer"}} onClick={() => { Search() }}>
                검색
            </button>

            <hr/>
            <h2>검색 결과</h2>
            <div className="postObj">
                <Slider {...settings}>
                    {Array.from(postdata).map((item, i) => <Card profiles={item} i={i+1} key={item.id} cg={division.current} isDetail={false}/>)}
                </Slider>
            </div>
            <br/><br/>
        </div>
    </>

}