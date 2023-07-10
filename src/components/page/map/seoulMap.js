import "../../../style/map.scss";
import { NavLink } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import { getDocs, collection, query, where } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import { db } from "../../../firebase";
import areas from "../../../data/seoulData.js"
import '../../../style/style.css';


export default function SeoulMapPage(){
	const navigate = useNavigate();

	const [counts, setCounts] = useState([]);
	var plag = true;

	const [missingData, setMissingData] = useState(async ()=> {
		const QuerySnapshot = await getDocs(query(collection(db, "Missing"), where("visibled", "==", true)));
		const data = QuerySnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data()
		}));
		setMissingData(Array.from(data));
	});

	const [findingData, setFindingData] = useState(async ()=> {
		const QuerySnapshot = await getDocs(query(collection(db, "Finding"), where("visibled", "==", true)));
		const data = QuerySnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data()
		}));
		setFindingData(Array.from(Array.from(data)));
	});


	useEffect(() => {
		mapscript();
	}, []);




	const getDatas = () => {
		if (plag == false){return 0;}
		for (var i=0, len = areas.length; i<len; i++){
			counts[i] = {name: areas[i]["name"], missingCounts: 0, findingCounts: 0};

			for(var j=0, len = areas.length; j<len; j++){
				var missingStr, findingStr;
				//console.log(Array.from(missingData).length);
				
				if(Array.from(missingData).length > j){
					missingStr = missingData[j]["address"]?.split(" ", 2)[1];
					if(counts[i]["name"] == missingStr){
						counts[i]["missingCounts"] += 1;
					}
				}
				
				if(Array.from(findingData).length > j){
					findingStr = findingData[j]["address"]?.split(" ", 2)[1];
					if(counts[i]["name"] == findingStr){
						counts[i]["findingCounts"] += 1;
					}
				}
			}
			//console.log(counts);
		}
		plag = false;
	}



	const mapscript = () => {
		var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
		mapOption = { 
			center: new kakao.maps.LatLng(37.566826, 126.9786567), // 지도의 중심좌표
			level: 9 // 지도의 확대 레벨
		};

		var map = new kakao.maps.Map(mapContainer, mapOption),
			customOverlay = new kakao.maps.CustomOverlay({}),
			infowindow = new kakao.maps.InfoWindow({removable: true});

		// 지도에 영역데이터를 폴리곤으로 표시합니다 
		for (var i = 0, len = areas.length; i < len; i++) {
			displayArea(areas[i]);
		}

		// 다각형을 생상하고 이벤트를 등록하는 함수입니다
		function displayArea(area) {
			// 다각형을 생성합니다 
			var polygon = new kakao.maps.Polygon({
				map: map, // 다각형을 표시할 지도 객체
				path: area.path,
				strokeWeight: 2,
				strokeColor: '#769B63',
				strokeOpacity: 0.8,
				fillColor: '#92c465',
				fillOpacity: 0.2
			});
			//polygon.setMap(map);

			// 다각형에 mouseover 이벤트를 등록하고 이벤트가 발생하면 폴리곤의 채움색을 변경합니다 
			// 지역명을 표시하는 커스텀오버레이를 지도위에 표시합니다
			kakao.maps.event.addListener(polygon, 'mouseover', function(mouseEvent) {
				polygon.setOptions({fillOpacity: 0.5});

				//plag && getDatas();

				var missingNum, findingNum;
				for(var i=0; i<counts.length; i++){
					if(counts[i]["name"] == area.name){
						missingNum = counts[i]["missingCounts"];
						findingNum = counts[i]["findingCounts"];
						break;
					}
				}

				var content = '<div class="area"> <strong>' + area.name + '</strong>'
				+			'	<div class="number"> 실종: ' + missingNum + '마리'
				+			'	</br> 목격: ' + findingNum + '마리</div></div>';

				customOverlay.setContent(content);
				customOverlay.setPosition(mouseEvent.latLng); 
				customOverlay.setMap(map);
			});

			// 다각형에 mousemove 이벤트를 등록하고 이벤트가 발생하면 커스텀 오버레이의 위치를 변경합니다 
			kakao.maps.event.addListener(polygon, 'mousemove', function(mouseEvent) {
				
				customOverlay.setPosition(mouseEvent.latLng); 
			});

			// 다각형에 mouseout 이벤트를 등록하고 이벤트가 발생하면 폴리곤의 채움색을 원래색으로 변경합니다
			// 커스텀 오버레이를 지도에서 제거합니다 
			kakao.maps.event.addListener(polygon, 'mouseout', function() {
				polygon.setOptions({fillOpacity: 0.2});
				customOverlay.setMap(null);
			}); 

			// 다각형에 click 이벤트를 등록하고 이벤트가 발생하면 다각형의 이름과 면적을 인포윈도우에 표시합니다 
			// kakao.maps.event.addListener(polygon, 'click', function(mouseEvent) {
			// 	var content = '<div class="info">' + 
			// 				'   <div class="title">' + area.name + '</div>' +
			// 				'   <div class="size">총 면적 : 약 ' + Math.floor(polygon.getArea()) + ' m<sup>2</sup></div>' +
			// 				'</div>';

			// 	infowindow.setContent(content); 
			// 	infowindow.setPosition(mouseEvent.latLng); 
			// 	infowindow.setMap(map);
			// });
		}
	};

	
	// 내 정보로 이동
	const toHostpital = () => {
		console.log("들어옴");
		//navigate(-1);
		navigate('/map/hospital');
	}

	// 내 게시글로 이동
	const toSeoulmap = () => {
		navigate('/map/seoul');
	}



	return <>
		<div className="map-page">
			<div className="map-page2">
        	<h2>주변 실종동물 현황</h2>
			<button  className="toHospital2" onClick={toHostpital}>주변 보호소 및 동물병원</button><br/>
			<button  className="toSeoulmap2" onClick={toSeoulmap}>자치구별 실종 반려견</button><br/>
			</div>
			<br/>
			<div className="map-section">
				<div className="map-box">
					<div id="map" onMouseOver={plag && getDatas()} style={{ width: "100%", height: "600px", backgroundColor: '#c8c8c8' }}></div>
				</div>
				<br></br>
			</div>
		</div>
	</>
}
