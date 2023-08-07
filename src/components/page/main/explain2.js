/**
 * ./src/components/page/main/explain2.js
 * 메인 페이지 내 실종 반려견 목격 시 대처 방법
 */

// import components
import React from "react";

// import style
import '../../../style/explain2.scss';
import '../../../style/table.scss';

const Explain2 =()=>{
  return(
    <div className="explain2">
      <table className="explain2-table">
        <thead>
          <tr>
            <th>  </th>
            <th> 《 실종 반려견 목격 시 대처 방법 》
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>▶ 신고 ◀</td> 
            <td className="explain2-td">공공장소를 떠돌거나 버려진 동물을 발견한 경우 관할 시, 군, 구청과 해당 유기동물 보호시설에 신고하십시오.</td>
          </tr>
          <tr>
            <td>▶ 7일공고 ◀</td>
            <td className="explain2-td">시장, 군수, 구청장은 관내에서 발견된 유기동물이 보호받을 수 있도록 필요한 조치를 해야 하며, 주인을 찾을 수 있도록 그 사실을 7일 이상 공고해야 합니다.</td>
          </tr>
          <tr>
            <td>▶ 공고후 10일 ◀</td>
            <td className="explain2-td">공고 후 10일이 지나도 주인을 찾지 못한 경우, 해당 시, 군, 구등이 동물의 소유권을 갖게 되어 개인에게 기증하거나 분양할 수 있습니다.</td>
          </tr>
          <tr>
            <td>▶ 주의사항 ◀</td>
            <td className="explain2-td">유기동물을 마음대로 잡아서 팔거나 죽이면 2년 이하의 징역 또는 2천만원 이하의 벌금을 부과합니다.</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Explain2;