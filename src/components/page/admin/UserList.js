/**
 * ./src/components/page/admin/UserList.js
 * 관리자 유저 관리 페이지
 */

import { useState, useEffect } from "react";

const UserList = () => {
    const [userList, setUserList] = useState([]);

    useEffect(() => {
        // firebase의 Forum Collection에서 글 목록 가져오기
        const setUsers = async () => {
            const QuerySnapshot = await getDocs(query(collection(db, "Forum"), orderBy("uploadTime", "desc")));
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
                <h3>UserList Page</h3>
            </div>
        </>
    )
}

export default UserList;