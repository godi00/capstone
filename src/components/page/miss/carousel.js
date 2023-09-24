/**
 * ./src/components/page/miss/carousel.js
 * 캐러셀 컴포넌트(실종, 목격 공통)
 */

// import components
import React, { useState } from "react";
import Slider from 'react-slick';
import Card from './card';

// import about firebase
import { db } from "../../../firebase";
import { getDocs, collection, query, orderBy } from "firebase/firestore";

// import style
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../../../style/carouselDots.css';

const Carousel = (category) => {
  // 가져올 게시글 내용
  const [profiles, setProfiles] = useState(async () => {
    // 비동기 작업 수행. 시간 순으로 정렬
    const QuerySnapshot = await getDocs(query(collection(db, category.category), orderBy("uploadTime", "desc")));
    const data = QuerySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));

    // set profiles
    setProfiles(Array.from(data));
  });

  // carousel 설정
  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 4,
    slidesToScroll: 4,
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

  // Card에 주는 cg로 실종, 목격 구분
  return (
    <div className="carousel">
      <Slider {...settings}>
        {Array.from(profiles).slice(0, 12).map((item, i) => <Card profiles={item} i={i+1} key={item.id} cg={category.cg} isDetail={false}/>)}
      </Slider>
    </div>
  );
};

export default Carousel;