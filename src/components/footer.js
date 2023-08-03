/**
 * ./src/components/footer.js
 * 웹페이지 하단 푸터
 */

// import components
import React from "react";

// import style
import "../style/style.css";

const Footer = () => {
    return(
        <div className="Footer">
        <footer>
            <div className="Footer2">
            <nav>
                <a className="footer-github" href="https://github.com/godi00/capstone" targer="_blank">&gt; Github</a>
            </nav>
            <h5>팀원: 김신승, 양수진, 윤서희, 이가은</h5>
            </div>
        </footer>
        </div>
    )

}

export default Footer;