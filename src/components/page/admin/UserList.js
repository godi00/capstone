/**
 * ./src/components/page/admin/UserList.js
 * 관리자 유저 관리 페이지
 */

import { useState, useEffect } from "react";

import { db } from '../../../firebase';
import { getDocs, query, collection } from "firebase/firestore";

// import style
import '../../../style/AdminPage.scss';
import '../../../style/table.scss';

const UserList = () => {
    const [userList, setUserList] = useState([]);

    useEffect(() => {
        // firebase의 Forum Collection에서 글 목록 가져오기
        const setUsers = async () => {
            const QuerySnapshot = await getDocs(query(collection(db, "Users")));
            const data = QuerySnapshot.docs.map((doc, i) => ({
                id: i,
                ...doc.data()
            }));
            // console.log(Array.from(data));
            setUserList(Array.from(data));
        }

        setUsers();
    }, []);

    return (
        <>
            <div className="admin-page">
                <h3>회원관리</h3>
                <table className="userList-table">
                    <thead>
                        <tr>
                            <th width="25%">고유ID</th>
                            <th>유저명</th>
                            <th>이메일</th>
                            <th>전화번호</th>
                            <th width="10%">신고 누적 횟수</th>
                            <th width="5%">탈퇴</th>
                        </tr>
                    </thead>
                    <tbody>
                    {console.log(userList)}
                        {
                            userList.map((doc, i) => {
                                // 고유ID, 유저명, 이메일, 전화번호, 신고 누적 횟수, 탈퇴 버튼
                                return (<tr key={i}>
                                    <td>{doc.uid ? doc.uid : ""}</td>
                                    <td>{doc.Name ? doc.Name : ""}</td>
                                    <td>{doc.Email ? doc.Email : ""}</td>
                                    <td>{doc.PhoneNumber ? doc.PhoneNumber : ""}</td>
                                    <td>0</td>
                                    <td>
                                        <button>탈퇴</button>
                                    </td>
                                </tr>)
                            }
                            )
                        }
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default UserList;