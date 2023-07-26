/**
 * ./src/components/page/Login/Post.js
 * 다음 우편번호 api
 */

// import components
import DaumPostcode from 'react-daum-postcode';

const Post = (props) => {    
    const onCompletePost = (data) => {
        console.log(data.address);
        
        let addr = data.address;
        let extraAddr = '';

        if(data.addressType === 'R') {
            if(data.bname !== '') {
                extraAddr += data.bname;
            }
            if(data.buildingName !== '') {
                extraAddr += extraAddr !== '' ? `, ${data.buildingName}` : data.buildingName;
            }

            addr += extraAddr !== '' ? ` (${extraAddr})` : '';
        }

        props.setcompany({
            ...props.company,
            address:addr,
        })
    };

    // style 정의
    const postCodeStyle = {
        display: "block",
        position: "absolute",
        top: "20%",
        width: "400px",
        height: "470px",
        border: "1px solid #668956",
        zIndex: 100, 
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
          {
            (
                <DaumPostcode
                    theme = {postCodeTheme}
                    style = {postCodeStyle}
                    autoClose
                    onComplete={onCompletePost}
                />
            )
          }   
        </>
    );
}

export default Post;