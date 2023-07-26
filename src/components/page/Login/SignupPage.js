/**
 * ./src/components/page/Login/SignupPage.js
 * 회원가입 페이지
 */

import "../../../style/LoginPage.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from 'firebase/firestore';
import Post from './Post';

const SingupPage = () => {
    const [error, setError] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [fullAddress, setFullAddress] = useState({
        address:'',
        extraAddress: '',
    });

    const [openPopup, setOpenPopup] = useState(false);

    const handleInput = (e) => {
        setFullAddress({
            ...fullAddress,
            [e.target.name]:e.target.value,
        })
    }

    const handleComplete = (data) => {
        setOpenPopup(!openPopup);
    }

    const navigate = useNavigate();

    const LoginHandler = e => {
        e.preventDefault();

        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log(userCredential.user.uid);
            signUp(userCredential.user.uid);
        })
        .then(()=>{
            alert("회원가입이 완료되었습니다.");
            navigate("/");
        })
        .catch((error) => {
            setError(true);
        });
    };

    const signUp = (uid) => {
        setDoc(doc(db, "Users", uid), {
            Email: email,
            Password: password,
            Name: name,
            PhoneNumber: phoneNumber,
            Address: fullAddress,
            uid: uid
        });

        localStorage.clear();
        localStorage.setItem('Email', email);
        // localStorage.setItem('Password', password);
        localStorage.setItem('Name', name);
        localStorage.setItem('PhoneNumber', phoneNumber);
        localStorage.setItem('Address', fullAddress.address);
        localStorage.setItem('ExtraAddress', fullAddress.extraAddress);
        localStorage.setItem('Uid', uid);
    };

    return(
        <div className="signup">
            <form onSubmit = {LoginHandler}>                
                이메일
                <input type="email" placeholder="email" onChange={(e=>setEmail(e.target.value))} /><br/>
                비밀번호
                <input type="password" placeholder="password" onChange={(e=>setPassword(e.target.value))}/><br/>
                이름
                <input type="text" placeholder="이름" onChange={(e=>setName(e.target.value))}/><br/>
                전화번호
                <input type="text" placeholder="전화번호" onChange={(e=>setPhoneNumber(e.target.value))}/><br/>
                주소
                <div>
                    <input className="address" placeholder="주소"
                        type="text" required={true} name="address"
                        onChange={handleInput} value={fullAddress.address}/>
                    <button type="button" onClick={handleComplete}>우편번호 찾기</button>
                    <br/>
                    <input className="address" placeholder="상세주소"
                        type="text" required={true} name="extraAddress"
                        onChange={handleInput} value={fullAddress.extraAddress} />
                    
                    {openPopup &&
                        <Post company={fullAddress} setcompany={setFullAddress}></Post>}
                </div>
                
                <br/><br/><br/>
                <button type="submit" >회원가입</button>
            </form>
        </div>
    )
}

export default SingupPage