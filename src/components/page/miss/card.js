/**
 * ./src/components/page/miss/card.js
 * 캐러셀에 들어가는 각 카드(실종, 목격 공통)
 */

// import components
import { Link } from 'react-router-dom';
import { Col } from 'reactstrap';
import { useEffect } from "react";

// import style
import styled from 'styled-components';
import '../../../style/carousel.scss';

function Card(props) {
  useEffect(() => {
		mapscript();
	}, []);

  const mapscript = () =>{
    console.log("3: " + props.cg);
  }

  let visible = props.profiles.visibled;

  const onClickListener = () => {
    if(visible == false) {
      alert("가족의 품으로 돌아간 반려견입니다.");
    }
  };

  // cg값에 따라 실종, 목격으로 구분
    return (
      <>
        <ItemStyle visible={visible}>
          <Col>
            <Link to={visible && `/${props.cg}/detail/${props.profiles.id}` || !visible && ``} onClick={onClickListener}>
              <div>
                <img className="carouselImg" src={props.profiles.imgs[0]} />
                <div className="carousel-dogInfo">
                  {props.cg=="Missing" && <p>이름: {props.profiles.name}</p>}
                  <p>실종위치: {props.profiles.address}</p>
                </div>
              </div>
            </Link>
          </Col>
        </ItemStyle>
      </>
    );
};

// 카드 style component
const ItemStyle = styled.div`
  width: 95%;
  max-width: 350px;
  padding-top: 4.7%;
  padding-bottom: 3%;
  margin: 3% auto;
  background-color: #eef5ed;
  border-radius: 8px;
  
  // 비활성화
  ${({ visible }) => {
    return visible ? null: `filter: grayscale(100%); opacity: 80%;`;
  }}
`;

export default Card;