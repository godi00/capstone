/**
 * ./src/components/page/miss/UploadPage.js
 * 실종 등록하기
 */
import "./UploadPage.scss";
import userInputs from "./formData.js";
import { React, useState, useEffect} from "react";
import { useNavigate, Link } from "react-router-dom";
import DaumPostcode from "react-daum-postcode";
import { addDoc, collection, doc, updateDoc, getDoc } from "@firebase/firestore";
import { getAuth } from "firebase/auth";
import { db, storage } from "../../../firebase.js";
import { ref, uploadBytesResumable, uploadBytes, getDownloadURL } from "firebase/storage";
//import Dropzone from 'react-dropzone'



const UploadPage = () => {
    const [data, setData] = useState({});
    const [files, setFiles] = useState([]);
    const Imgs = Array.from([]);
    const [address, setAddress] = useState("");
    const [popup, setPopup] = useState(false);

    const auth = getAuth();
    const Navigate = useNavigate();
    var submit = true;
    //var img = 1;

    function wait(sec) {
        let start = Date.now(), now = start;
        while (now - start < sec * 1000) {
            now = Date.now();
        }
    }


    useEffect(()=>{
    const uploadFile= async(file, i) => {
            const storageRef = ref(storage, file.name);
            await uploadBytes(storageRef, file).then(async(snapshot) => {
                await getDownloadURL(snapshot.ref).then((url) => {
                    Imgs[i] = url;
                    console.log(url);
                });
            });
        };
        files && Array.from(files).map((file, i) => (uploadFile(file, i))); //유사배열객체라서 map함수 쓰기위해 Array.from함수 사용
    }, [files]);
        


    const handleInput = (e) => {
        const id = e.target.id;
        const value = e.target.value;
        setData({ ...data, [id]: value });
    };

    const handler = async(e) =>{
        e.preventDefault();

        if(!submit) return 0;
        
        if(files[0]==null){
            alert("사진을 등록해주세요");
            return 0;
        }
        submit = false;

        if(Imgs[files.length-1] == null){
            while(Imgs[files.length-1] == null)
                wait(1);
        }
        
        const currUser = auth.currentUser.uid;
        
        var time = new Date();
        const docRef = await addDoc(collection(db, "Missing"), {
            ...data,
            imgs: Imgs, 
            uploadTime: time,
            visibled: true,
            uid: currUser
        });
        await updateDoc(docRef, {id: docRef.id});   //현재 문서의 id를 필드에 다시 추가
        
        
        let document = await getDoc(doc(db, "Users", currUser));
        var arr = document.data().missing;

        if(arr != null){
            await updateDoc(doc(db, "Users", currUser), {
                missing: [...arr, docRef.id]
            });
        }
        else{
            await updateDoc(doc(db, "Users", currUser), {
                missing: [docRef.id]
            });
        }
        
        alert("등록되었습니다.");
        Navigate("/miss");
        //location.reload();
    }


    const handleComplete = (data) => {
        let fullAddress = data.address;
        let extraAddress = '';
        if (data.addressType === 'R') {
            if (data.bname !== '') {
                extraAddress += data.bname;
            }
            if (data.buildingName !== '') {
                extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
            }
            fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
        }
        //fullAddress -> 전체 주소반환
        setPopup(false);
        setAddress(data.address);
        setData((prev)=>({...prev, address:data.address}));
    }

    const postCodeStyle = {
        display: "block",
        position: "absolute",
        top: "-650%",
        right: "7%",
        zIndex: 100, 
        
        width: "400px",
        height: "470px",
        border: "1px solid #668956",
    };

    // theme 정의
    const postCodeTheme = {
        bgColor: "#ECECEC", // 바탕 배경색
        searchBgColor: "#668956", //검색창 배경색
        contentBgColor: "#FBFBFB", //본문 배경색(검색결과,결과없음,첫화면,검색서제스트)
        pageBgColor: "#FAFAFA", //페이지 배경색
        textColor: "#333333", //기본 글자색
        queryTextColor: "#FFFFFF", //검색창 글자색
        postcodeTextColor: "#FA4256", //우편번호 글자색
        emphTextColor: "#668956", //강조 글자색
        outlineColor: "#668956" //테두리
    };

    return (
        <>
            <script src="https://unpkg.com/dropzone@5/dist/min/dropzone.min.js"></script>
            <link rel="stylesheet" href="https://unpkg.com/dropzone@5/dist/min/dropzone.min.css" type="text/css" />
            
            <div className="upload-page">
            <h2>실종 등록하기</h2>
            <div className="warning"><h4>※ 최대한 정확하고 자세히 적을수록 좋습니다.</h4></div>
            <div className="upload-page2">
                <form onSubmit = {handler}>

                    <div className="name">
                    <h4>이름</h4>&emsp;
                    <input type="text" id="name" size="20" onChange={handleInput}></input>
                    </div>

                    <div className="age">
                    <h4>나이</h4>&emsp;
                    <input type="number" id="age" size="2" onChange={handleInput}></input>
                    </div>

                    {userInputs.map((input)=>(
                        <>
                        <div className="specify_farColor">
                            <h4>{input.label}</h4>&emsp;
                            <select id={input.id} onChange={handleInput}>
                                <option disabled selected></option>
                                {input.datas.map((item)=>(
                                    <option value={item} key={item}>{item}</option>
                                ))}
                            </select>
                        </div>
                        </>
                    ))} 

                    <div className="neutering">
                    <h4>중성화 여부 |</h4>&ensp;
                    <label><input type="radio" id="neutering" name="neutering" value="yes" onChange={handleInput}/>예</label> &nbsp;
                    <label><input type="radio" id="neutering" name="neutering" value="no" onChange={handleInput}/>아니오</label>
                    </div>

                    <div className="place">
                    <h4>실종장소</h4>&emsp;
                    {popup && <div className="postDiv"><DaumPostcode className="postModal" style={postCodeStyle} theme={postCodeTheme} onComplete={handleComplete}/></div>}
                    <input className="missplacetext" type="text" id="place" onChange={handleInput} value={address}></input>
                    <input type="button" className="missplaceButton" onClick={()=>setPopup(true)} value="주소찾기"></input><br/>
                    </div>

                    <div className="kakaoId">
                    <h4>카카오톡ID</h4>&emsp;
                    <input id="kakaoId" maxLength="11" onChange={handleInput} />
                    </div>

                    <div className="date">
                    <h4>날짜 및 시간</h4>&ensp;
                    <input type="datetime-local" id="date" onChange={handleInput}/>
                    </div>

                    <div className="feature">
                    <h4>성격 및 특징</h4>&ensp;
                    <textarea cols="25" id="feature" onChange={handleInput}></textarea>
                    </div>

                    <div className="photo">
                        <h4>실종전 사진</h4>&ensp;
                        <label className="input-file-btn" for="input-file">
                        </label>
                        <input type="file" id="input-file"  multiple accept='image/*' onChange={(e)=>setFiles(e.target.files)}/>
                    </div>    
                    <button className="submit-btn" type="submit">등록하기</button>
                </form>
                </div>
            </div>
            
        </>
    );
};

export default UploadPage