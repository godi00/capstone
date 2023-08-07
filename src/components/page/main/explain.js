/**
 * ./src/components/page/main/explain.js
 * 메인 페이지 내 대처 방법
 */

// import components
import React from "react";
import { Link } from "react-router-dom";

// import style
import '../../../style/explain.scss';
import '../../../style/table.scss';

const Explain =()=>{
  return(
    <div className="explain">
      <table className="explain-table">
        <thead>
          <tr>
            <th> 순서 </th>
            <th> 《 반려견 실종 시 대처 방법 》
              <Link target="_blank" to="http://www.angel.or.kr/missing.php" className='customBtn'>click! 더 많은 정보 확인하기 </Link>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1. 현장 확인</td> 
            <td className="explain-td">실종 현장 확인, 현장 및 부근을 신속히 이동하면서 탐문한다.</td>
          </tr>
          <tr>
            <td>2. 전단지 배포</td>
            <td className="explain-td">실종 지역에 전단지를 집중 배포하며, 가능한 반경 1km까지 배포한다.</td>
          </tr>
          <tr>
            <td>3. 방문 확인</td>
            <td className="explain-td">실종 장소 주변의 관공서, 경찰서, 동물병원, 보호소 등을 방문하여 확인 후 전단지를 전달한다.</td>
          </tr>
          <tr>
            <td>4. 인터넷 활용</td>
            <td className="explain-td">동물보호센터, 파인드독과 같은 웹사이트에 실종 신고를 하고, 구조 및 보호 신고를 확인한다. 유기동물 공고를 매일 확인한다.</td>
          </tr>
          <tr>
            <td>5. 원점에서 재점검 </td>
            <td className="explain-td">주변을 겉돌거나 같은 지역만 계속 반복하지 말고 원점에서 다시 점검한다. 이때, 점차 점검 지역을 확대한다.</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Explain;