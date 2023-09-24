/**
 * ./src/components/page/miss/UploadPage.js
 * 실종 등록하기
 */
import "../../../style/UploadPage.scss";
import userInputs from "../../../data/formData.js";
import { React, useState, useEffect} from "react";
import { useNavigate, Link } from "react-router-dom";
import DaumPostcode from "react-daum-postcode";
import { addDoc, collection, updateDoc, doc, getDoc } from "@firebase/firestore";
import { db, storage, auth } from "../../../firebase.js";
import { ref, uploadBytesResumable, uploadBytes, getDownloadURL } from "firebase/storage";




const FindUploadPage = () => {

    const [data, setData] = useState({});
    const [files, setFiles] = useState([]);
    const Imgs = Array.from([]);
    const [address, setAddress] = useState("");
    const [popup, setPopup] = useState(false);

    const Navigate = useNavigate();
    var submit = true;



    // useEffect(() => {
	// 	setDateAttr();
	// }, []);

    // function wait(sec) {
    //     let start = Date.now(), now = start;
    //     while (now - start < sec * 1000) {
    //         now = Date.now();
    //     }
    // }


    // useEffect(()=>{
    //     const uploadFile= (file, i) => {
    //         const storageRef = ref(storage, file.name);
    //         uploadBytes(storageRef, file).then((snapshot) => {
    //             getDownloadURL(snapshot.ref).then((url) => {
    //                 Imgs[i] = url;
    //                 console.log(Imgs);
    //                 console.log(url);
    //             });
    //         });
    //     };
    //     files && Array.from(files).map((file, i) => (uploadFile(file, i))); //유사배열객체라서 map함수 쓰기위해 Array.from함수 사용
    // }, [files]);
    




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

        //console.log("Imgs:", Imgs);

        // if(Imgs[files.length-1] == null){
        //     console.log(files.length-1);
        //     while(Imgs[files.length-1] == null)
        //         wait(1);
        // }

        const uploadPromises = Array.from(files).map((file) => {
            return new Promise((resolve) => {
                const storageRef = ref(storage, file.name);
                uploadBytesResumable(storageRef, file)
                    .then((snapshot) => getDownloadURL(snapshot.ref))
                    .then((url) => {
                        resolve(url);
                    });
            });
        });

        try {
            const uploadedUrls = await Promise.all(uploadPromises);
            Imgs.push(...uploadedUrls);
            console.log("Imgs:", Imgs);

            var currUser = auth.currentUser.uid;
            // ... 나머지 코드 ...
            submit = true; // 이제 submit을 허용
        } catch (error) {
            console.error("이미지 업로드 중 오류 발생:", error);
        }


        var currUser = auth.currentUser.uid;

        var time = new Date()
        const docRef = await addDoc(collection(db, "Finding"), {    //해당게시글 정보를 finding컬렉션에 추가
            ...data,
            imgs: Imgs, 
            uploadTime: time,
            visibled: true,
            uid: currUser
        });
        await updateDoc(docRef, {id: docRef.id}); 
        

        let document = await getDoc(doc(db, "Users", currUser));    //user컬렉션에 해당user가 등록한 게시글 추가
        var arr = document.data().finding;
        if(arr != null){
            await updateDoc(doc(db, "Users", currUser), {
                finding: [...arr, docRef.id]
            });
        }else{
            await updateDoc(doc(db, "Users", currUser), {
                finding: [docRef.id]
            });
        }
        
        alert("등록되었습니다");
        Navigate("/find");
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



    //날짜선택 시 오늘 이후날짜 선택못하도록 제한하는 함수
    const setDateAttr = () => {
        // let dateElement = document.getElementById('date');
        // let date = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, -5);
        // //dateElement.value = date;
        // dateElement.setAttribute("max", date);
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
            <h2>목격 등록하기</h2>
            <div className="warning"><h4>※ 최대한 정확하고 자세히 적을수록 좋습니다.</h4></div>
            <div className="upload-page2">
                <form onSubmit = {handler}>

                    <div className="age">
                    <h4>추정 나이</h4>&emsp;
                    <input type="number" id="age" size="2" onChange={handleInput}></input>
                    </div>

                    {userInputs.map((input)=>(
                        <>
                        <div className="specify_farColor">
                            <h4>{input.label}</h4>&emsp;
                            <select id={input.id} onChange={handleInput}>
                                <option disabled selected>-------</option>
                                {input.datas.map((item)=>(
                                    <option value={item} key={item}>{item}</option>
                                ))}
                            </select>
                        </div>
                        </>
                    ))} 

                    <div className="place">
                    <h4>목격장소</h4>&emsp;
                    {popup && <div className="postDiv"><DaumPostcode style={postCodeStyle} theme={postCodeTheme} onComplete={handleComplete}/></div>}
                    <input className="findplacetext" type="text" id="place" onChange={handleInput} value={address}></input>
                    <input type="button" className="findplaceButton" onClick={()=>setPopup(true)} value="주소찾기"></input><br/>
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
                    <h4>목격 사진</h4>&ensp;
                    <label className="input-file-btn" for="input-file">
                        </label>
                    <input type="file" multiple accept='image/*' onChange={(e)=>setFiles(e.target.files)}/>
                    {/* <form action="/target" class="dropzone" id="myDropzone"></form>
                    <script>
                        Dropzone.discover();
                        Dropzone.options.myDropzone = {
                            url: "https://httpbin.org/post",
                            method: 'post',
                        };
                    </script> */}
                    </div>
                <button className="submit-btn" type="submit" disabled={()=>{files.length!=0? true:false}}>등록하기</button>
            </form>
            </div>
            </div>
        </>
    );
};

export default FindUploadPage