/**
 * ./src/components/page/miss/PieChart.js
 * 파이 차트
 */

// import components
import { useEffect, useState } from 'react';
import { VictoryPie, VictoryLabel } from 'victory';

// import about firebase
import { db } from '../../../firebase';
import { collection, getCountFromServer, query, where } from 'firebase/firestore';

// cg: Missing or Finding
export const PieChart = (props) => {
    const [findRatio, setFindRatio] = useState(0); // 비율 값

    // 차트에 반영될 데이터
    const data = [
        {quarter: 1, earnings:parseFloat(findRatio), label: `발견\n${findRatio}%`},
        {quarter: 2, earnings:100-parseFloat(findRatio), label: `미발견\n${100-findRatio}%`}
    ];

    // useEffect
    useEffect(() => {
        const fetchData = async () => {
            const colRef = collection(db, props.cg);

            // 콜렉션의 총 문서 수
            const allSnapshot = await getCountFromServer(colRef);
            const allofCol = allSnapshot.data().count;
            
            // 콜렉션 내에서 발견된 반려견 수(visibled == false)
            const q = query(colRef, where("visibled", "==", false));
            const findSnapshot = await getCountFromServer(q);
            const findDoc = findSnapshot.data().count;

            // 비율 값 계산
            const ratio = ((findDoc / allofCol) * 100).toFixed(1);

            // set findRatio
            setFindRatio(ratio);
        }

        // fetch
        fetchData();
    }, []);

    return (
        <>
            <svg width={400} height={344.9} >

                {/* #93c58c | #69a65f | #376330 */}

                <circle cx={180} cy={190} r={85} fill="#376330" />

                <VictoryPie
                    data={ data }
                    x="quarter"
                    y="earnings"

                    categories={{
                        quarter: ["발견", "미발견"]
                    }}

                    animate={{ // animation
                        duration: 1000
                    }}
                    
                    colorScale={[ // 색상
                        "#69a65f", "#93c58c"
                    ]}
                    
                    padding={{
                        top: 50, bottom: 70, right: 40
                    }}

                    margin={{
                        bottom: 50
                    }}


                    
                    standalone={false}
                    width={400}
                    height={400}
                    innerRadius={90}
                    labelRadius={({ innerRadius }) => innerRadius + 15 }
                    
                    style={{
                        labels: {
                            fontFamily: 'NanumSquare',
                            fontSize: 15,
                            fontWeight: 600,
                            fill: "#ffffff"
                        }
                    }}
                />
                <VictoryLabel
                    // Missing이면 실종, 아니면 목격으로 출력
                    text={(props.cg == "Missing") ? "실종 반려견 발견 비율(%)" : "목격 반려견 발견 비율(%)"}
                    textAnchor="inherit" // 가운데 정렬
                    verticalAnchor="inherit"  // 가운데 정렬
                    
                    x={104}  // 원의 x 좌표
                    y={187}  // 원의 y 좌표

                    style={{
                        x: 250,
                        fontFamily: 'NanumSquare',
                        fontSize: 15,
                        fontWeight: 400,
                        fill: "#ffffff"
                    }}
                />
            </svg>
        </>
    );
};