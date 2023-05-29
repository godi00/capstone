/**
 * ./src/components/page/mypage/EditMyInfo.js
 * 회원 정보 수정
 */

import { useNavigate } from "react-router-dom";

export const EditMyInfo = () => {
    const navigate = useNavigate();
    
    const changeHandler = () => {
        navigate('/mypage');
    }

    return (
        <>
            <div className=''>
                <div className=""><p>🍏 회원 정보 수정 🍏</p></div>
                <div className="">
                    {/* <p>email: {localStorage.getItem('Email')}</p>
                    <p>name: {localStorage.getItem('Name')}</p>
                    <p>phone Number: {(localStorage.getItem('PhoneNumber') != null) ? localStorage.getItem('PhoneNumber') : ""}</p>
                    <p>Address: {`${((localStorage.getItem('Address') != "undefined") && (localStorage.getItem('Address') != null)) ? localStorage.getItem('Address') : ""} 
                    ${((localStorage.getItem('ExtraAddress') != "undefined") && (localStorage.getItem('Address') != null)) ? localStorage.getItem('ExtraAddress') : ""}`}</p> */}
                </div>
                <div className="">
                    <button className="" onClick={changeHandler}>완료</button>
                </div>
            </div>
        </>
    )
}