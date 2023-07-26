/**
 * ./src/components/Header.js
 */

// import
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../firebase';    

const auth = getAuth(); // 현재 사용자 인증 정보 가져오기

// Header
const Header = () => {
    const [userState, setUserState] = useState(false); // 로그인, 비로그인
    const [isAdmin, setIsAdmin] = useState(null); // 관리자

    useEffect(() => {
        // 로그인 상태에 변화가 생겼을 때 작동
        onAuthStateChanged(auth, (user) => {
            if(user) {
                setUserState(true);
                if(user.email == "admin@fd.com") {
                    setIsAdmin(true);
                }
            } else {
                setUserState(false);
                setIsAdmin(false);
            }
        });
    }, []);

    return (
            <div className='header'>
                <div className='header-text-div'>
                    <h3>파인드독<br/>빠른 실종 반려견 찾기</h3>
                </div>
    
                <div className='header-logo-div'>
                    <Link to="/">
                        <img className='header-logo' src={process.env.PUBLIC_URL + 'images/logo_web.png'} />
                    </Link>
                </div>
                
                <div className='header-admin-div'>
                    {
                        // 관리자 페이지 들어갈 수 있는 아이콘 삽입
                        // userState에서 admin id 검사?
                        (isAdmin)
                        ? (<Link to="/admin"><img className='header-admin' src={process.env.PUBLIC_URL + 'images/support.png'} /></Link>)
                        : (isAdmin)
                    }
                </div>
    
                <div className='header-profile-div'>
                    {
                        (userState)
                        ? (<Link to="/mypage"><img className='header-profile' src={process.env.PUBLIC_URL + 'images/user.png'} /></Link>)
                        : (<Link to="/login"><img className='header-profile' src={process.env.PUBLIC_URL + 'images/user.png'} /></Link>)
                    }
                </div>
            </div>
        )
}
// export this component
export default Header;