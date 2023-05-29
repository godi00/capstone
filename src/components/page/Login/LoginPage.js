/**
 * ./src/components/page/Login/LoginPage.js
 * 로그인 페이지
 */

import "./LoginPage.scss";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { db } from '../../../firebase';
import { getAuth, signInWithEmailAndPassword, setPersistence, browserSessionPersistence, GoogleAuthProvider } from "firebase/auth";
import { getDocs, collection, query, where, setDoc, doc } from 'firebase/firestore';
import { GoogleLogin } from "./GoogleLogin";

const LoginPage = () => {
    const [error, setError] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    const auth = getAuth();
    const navigate = useNavigate();

    const LoginHandler = e => {
        e.preventDefault();        

        setPersistence(auth, browserSessionPersistence).then(() => {
            return signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
                //const user = userCredential.user;
                navigate("/");
            })
            .catch((error) => {
                setError(true);
            })
        })
        .catch((error) => {
            setError(true);
        });
    };

    const GoogleLoginHandler = e => {
        e.preventDefault();
        GoogleLogin()
        .then(res => {
            const credential = GoogleAuthProvider.credentialFromResult(res);
            const token = credential.accessToken;
            const userName = res.user.displayName;
            const userEmail = res.user.email;

            // local storage에 token, username 저장해주기 
            setToken(token);
            setUserName(userName);
            setUserEmail(userEmail);

            // useState
            setEmail(userEmail);
            setName(res.user.name);

            setDoc(doc(db, "Users", res.user.email), {
                Email: res.user.email,
                Password: null,
                Name: res.user.displayName,
                PhoneNumber: null,
                Address: null
            });
        })
        .then(res => {
            navigate("/");            
        })
        .catch(error => {
            console.error(error);
        });
    }

    const setToken = (t) => {
        localStorage.setItem('Token', t);
    }

    const setUserName = (n) => {
        localStorage.setItem('Name', n);
    }

    const setUserEmail = (e) => {
        localStorage.setItem('Email', e);
    }

    async function setInfo() {
        console.log("setInfo() 실행");

        const infoQuery = query(collection(db, "Users"), where("Email", "==", email || ''));
        const QuerySnapshot = await getDocs(infoQuery);
        QuerySnapshot.forEach((doc) => {
            let docs = doc.data();
            console.log("docs: ", docs);

            localStorage.clear();
            localStorage.setItem('Email', email);
            localStorage.setItem('Password', password);
            localStorage.setItem('Name', docs.Name);
            localStorage.setItem('PhoneNumber', docs.PhoneNumber);
            localStorage.setItem('Address', docs.Address.address);
            localStorage.setItem('ExtraAddress', docs.Address.extraAddress);
        })
        alert('로그인 성공!');
    }

    return(
        <>
        <div className="login-page">
        <h2>로그인</h2>
            <div className="login">
                <h4>Login</h4>
            <form onSubmit = {LoginHandler}>
                <input type="email" placeholder="email" onChange={(e=>setEmail(e.target.value))} />
                <input type="password" placeholder="password" onChange={(e=>setPassword(e.target.value))}/>
                <button type="submit" onClick={setInfo}>Login</button>
                { error && <span>잘못된 이메일 혹은 비밀번호입니다.</span> }
            </form>
            <div>
                <button className="googleLogin-btn" onClick={GoogleLoginHandler}>Google 로그인</button>
            </div>
            <div><Link className="signup-btn" to="signup">회원가입</Link></div>
            </div>
        </div>
        </>
    )
}

export default LoginPage;