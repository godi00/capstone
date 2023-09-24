/**
 * ./src/components/page/miss/BarChart.js
 * 바 차트(실종, 목격 공통)
 */

// import components
import { useEffect, useState } from 'react';
import { VictoryChart, VictoryBar, VictoryAxis } from 'victory';

// import about firebase
import { db } from '../../../firebase';
import { collection, query, getDocs } from 'firebase/firestore';
import locationData from "../../../data/seoulData.js";

export const BarChart = (props) => {
    const [district, setDistrict] = useState([]);
    const [region, setRegion] = useState("서울");

    useEffect(() => {
        const fetchData = async () => {
            var initialData;
            if (region === "서울") initialData = locationData.filter((location) => location.name.endsWith("구"));
            else if (region === "경기") initialData = locationData.filter((location) => location.name.endsWith("시"));
            
            const initialDistrictData = initialData.map((location) => ({ quarter: location.name, earnings: 0 }));
            //setDistrict(initialDistrictData);

            // 카테고리의 전체 문서를 가져옴
            const QuerySnapshot = await getDocs(query(collection(db, props.cg)));
            const data = QuerySnapshot.docs.map((doc) => ({
                ...doc.data()
            }));

            // 데이터를 가공하여 업데이트된 district를 생성
            const updatedDistrict = initialDistrictData.reduce((updatedDistrict, d2) => {
                const matchingDataCount = data.filter((d) => d.address != null && d.address.split(' ')[1] === d2.quarter).length;
                if (matchingDataCount > 0) {
                    updatedDistrict.push({ ...d2, earnings: d2.earnings + matchingDataCount });
                } else {
                    updatedDistrict.push(d2);
                }
                return updatedDistrict;
            }, []);

            // 업데이트된 district로 상태 업데이트
            setDistrict(updatedDistrict);
            // console.log(region);
            // console.log(district);
        };

        // fetch
        fetchData();
    }, [region]);

    useEffect(() => {
        console.log(region);
        console.log(district);
    }, [region, district]);

    return (
        <>
            
            <select onChange={(e) => { setRegion(e.target.value) }} style={{ float: "right", marginRight: 10 + 'em' }}>
                <option selected value="서울">서울</option>
                <option value="경기">경기</option>
            </select>
            {district.length > 0 ? (
                <VictoryChart
                    domain={{ x: [1, 25], y: [0, 16] }}
                    padding={33}
                    domainPadding={{ x: 10 }}
                    width={800}
                    height={300}
                    style={{
                        background: { fill: '#eef5ed' }
                    }}
                >
                <VictoryAxis // x축
                    style={{
                        width: '150px',
                        tickLabels: {
                        fontFamily: 'NanumSquare',
                        fontSize: 7,
                        fontWeight: 500,
                        fill: '#376330',
                        },
                    }}
                />
                <VictoryAxis // y축
                    dependentAxis
                    style={{
                        tickLabels: {
                        fontFamily: 'NanumSquare',
                        fontSize: 10,
                        fontWeight: 400,
                        fill: '#376330',
                        },
                    }}
                />
                <VictoryBar
                    data={district}
                    x="quarter"
                    y="earnings"

                    animate={{ duration: 500 }}

                    style={{
                        data: { fill:"#376330" }
                    }}
                />
            </VictoryChart>
            ) : (
                <p>Loading...</p>
            )}
        </>
    )
}