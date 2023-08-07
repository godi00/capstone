/**
 * ./src/components/page/mypage/EditMyInfo.js
 * 회원 정보 수정
 */

// import components
import {useState} from 'react';
import { useNavigate } from "react-router-dom";
import { MainMenu } from "../../menu/Menu";
import Post from '../Login/Post';

// import about firebase
import { db, auth } from '../../../firebase';
import { updateDoc, doc } from 'firebase/firestore';

// import style
import '../../../style/style.css';
import '../../../style/mypage.scss';

const EditMyInfo = () => {
    const [email, setEmail] = useState(localStorage.getItem('Email')); // email
    const [name, setName] = useState(localStorage.getItem('Name')); // name
    const [phone, setPhone] = useState(localStorage.getItem('PhoneNumber')); // phone
    const [address, setAddress] = useState({
        address: localStorage.getItem('Address'),
        extraAddress: localStorage.getItem('ExtraAddress'),
    }); // address
    const [openPopup, setOpenPopup] = useState(false); // postcode popup

    const navigate = useNavigate();

    const handleComplete = (data) => { // 우편번호 팝업 상태 관리
        setOpenPopup(!openPopup);
    }

    const handleInput = (e) => { // 주소 상태 관리
        setAddress({
            ...fullAddress,
            [e.target.name]:e.target.value,
        });
    };

    const nameChange = (e) => { // 닉네임 상태 관리
        setName(e.target.value);
    }

    const phoneChange = (e) => { // 전화번호 상태 관리
        setPhone(e.target.value);
    }

    const emailChange = (e) => { // 이메일 상태 관리
        setEmail(e.target.value);
    }
    
    // firebase document & local storage item update
    const changeHandler = async (e) => {
        e.preventDefault();

        // firebase document update
        await updateDoc(doc(db, "Users", auth.currentUser.uid), {
            Email: email,
            Name: name,
            PhoneNumber: phone,
            Address: {
                address: address.address,
                extraAddress: address.extraAddress
            },
            uid: auth.currentUser.uid
        });

        // localStorage item update
        localStorage.setItem('Email', email);
        localStorage.setItem('Name', name);
        localStorage.setItem('PhoneNumber', phone);
        localStorage.setItem('Address', address.address);
        localStorage.setItem('ExtraAddress', address.extraAddress);

        alert('정보 수정이 완료되었습니다.');
        
        navigate('/mypage/information');
    }

    return (
        <>
            <MainMenu />
            <section className="my-info-edit-board">
                <div className="my-info-edit-page">

                    <div className="my-info-edit-page2">
                        <div className="my-info-edit-title">
                            <p>🍏 회원 정보 수정 🍏</p>
                        </div>
                        <form onSubmit={changeHandler}>
                            <div className="my-info-edit-page3">
                            
                            <p>이메일: <input type="email" placeholder="example@domain.com" id="email" name="email" defaultValue={localStorage.getItem('Email')} onChange={emailChange}/></p>
                            <p>닉네임: <input type="text" id="name" name="name" defaultValue={localStorage.getItem('Name')} onChange={nameChange}/></p>
                            <p>전화번호: <input type="text" placeholder="000-0000-0000" id="phoneNumber" name="phoneNumber" defaultValue={(localStorage.getItem('PhoneNumber') != null) && (localStorage.getItem('PhoneNumber') != "null") ? localStorage.getItem('PhoneNumber') : ""} onChange={phoneChange}/></p>
                            
                            주소: <input className="address" placeholder="주소"
                                    type="text" name="address"
                                    onChange={handleInput} value={(((address.address != "null") && (address.address != null))) ? address.address : ""}/>
                                <button className="postcodeBtn" type="button" onClick={handleComplete}>우편번호 찾기</button>
                                <br/>
                                <input className="extraAddress" placeholder="상세주소"
                                    type="text" name="extraAddress"
                                    onChange={handleInput} value={((address.extraAddress != "null") && (address.extraAddress != null)) ? address.extraAddress : ""} />
                                
                                {openPopup &&
                                    <Post company={address} setcompany={setAddress}></Post>}

                            </div>
                            <div className="my-info-edit-btn">
                                <button type="submit" className="my-info-complete">완료</button>
                            </div>
                        </form>
                    </div>

                </div>
            </section>
        </>
    )
};

export default EditMyInfo;