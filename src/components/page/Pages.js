/**
 * ./src/components/page/Pages.js
 * 
 * 각 메뉴가 담당하는 페이지
 */

// import components
import { useLocation } from "react-router-dom";
import { AdminMenu, MainMenu } from "../menu/Menu";
import {FindPage} from './find/FindPage';
import {MissPage} from './miss/MissPage';
import {SearchPage} from './search/SearchPage';
import {ForumPage} from './forum/ForumPage';
import {MainPage} from './main/MainPage';
import { MyInformation } from "./mypage/MyInformation";
import { MyPost } from "./mypage/MyPost";
import LoginPage  from "./Login/LoginPage";
import SignupPage from "./Login/SignupPage";
import UploadPage from "./miss/UploadPage";
import MoreinfoPage from "./miss/moreInfo";
import FindUploadPage from "./find/FindUploadPage";
import FindMoreinfoPage from "./find/FindMoreInfo";
import {DetailPage} from "./miss/DetailPage";
import HospitalMapPage from "./map/hospitals";
import SeoulMapPage from "./map/seoulMap";
import { UploadPost } from "./forum/UploadPost";
import {PostPage} from "./forum/PostPage";
import UserList from "./admin/UserList";
import Stats from "./admin/Stats";

// import style
import '../../style/style.css';

// Page Template
const PageTemplate = ({ children }) => (
  <div className="page">
    <MainMenu />
    {children}
  </div>
);

const SubTemplate = ({ children }) => (
  <div className="sub-page">
    <AdminMenu />
    {children}
  </div>
)

/**
 * Admin
 * 관리자 페이지
 */
export const AdminUserBoard = () => (
  <PageTemplate>
    <SubTemplate>
      <section className="admin-board">
        <UserList />
      </section>
    </SubTemplate>
  </PageTemplate>
)

export const AdminStatsBoard = () => (
  <PageTemplate>
    <SubTemplate>
      <section className="admin-board">
        <Stats />
      </section>
    </SubTemplate>
  </PageTemplate>
)

/**
 * Detail
 * 상세 페이지
 */
export const MissTimeDetailBoard = () => (
  <PageTemplate>
    <section className="detail-board">
      <DetailPage cg="Missing" />
    </section>
  </PageTemplate>
)

export const FindTimeDetailBoard = () => (
  <PageTemplate>
    <section className="detail-board">
      <DetailPage cg="Finding" />
    </section>
  </PageTemplate>
)

/**
 * MainBoard
 * 메인 페이지
 */
export const MainBoard = () => (
  <PageTemplate>
    <section className="main-board">
      <MainPage />
    </section>
  </PageTemplate>
)

/**
 * MissBoard
 * 실종 게시판
 * 하위 메뉴 없음
 * 사용자의 실종 반려견을 올릴 수 있는 게시판 페이지
 */
export const MissBoard = () => (
  <PageTemplate>
    <section className="miss-board">
      <MissPage />
    </section>
  </PageTemplate>
);

export const Upload = () => (
  <PageTemplate>
    <section className="upload-board">
      <UploadPage />
    </section>
  </PageTemplate>
)

export const MoreInfo = () => (
  <PageTemplate>
    <section className="moreinfo-board">
      <MoreinfoPage />
    </section>
  </PageTemplate>
)

/**
 * FindBoard
 * 목격 게시판
 * 하위 메뉴 없음
 * 사용자가 목격담을 올릴 수 있는 게시판 페이지
 */
export const FindBoard = () => (
  <PageTemplate>
    <section className="find-board">
      <FindPage />
    </section>
  </PageTemplate>
);

export const FindUpload = () => (
  <PageTemplate>
    <section className="find-upload-page">
      <FindUploadPage />
    </section>
  </PageTemplate>
)

export const FindMoreInfo = () => (
  <PageTemplate>
    <section className="moreinfo-board">
      <FindMoreinfoPage />
    </section>
  </PageTemplate>
)

/**
 * HospitalMap
 * 보호소 및 동물병원
 * 하위 메뉴 없음
 * 사용자의 위치 근처에 있는 보호소와 동물병원을 표시해주는 지도 페이지
 */
export const Map = () => (
  <PageTemplate>
    <section className="hospital-map">
      <HospitalMap />
    </section>
  </PageTemplate>
);

export const HospitalMap = () => (
  <PageTemplate>
    <section className="hospital-map">
      <HospitalMapPage />
    </section>
  </PageTemplate>
)

export const SeoulMap = () => (
  <PageTemplate>
    <section className="seoul-map-board">
      <SeoulMapPage />
    </section>
  </PageTemplate>
)

/**
 * MyInfo
 * 마이 페이지
 */
export const MyInfo = () => (
  <PageTemplate>
    <section className="my-info">
      <MyInformation />
    </section>
  </PageTemplate>
)

export const MyPersonalInfo = () => (
  <PageTemplate>
    <section className="my-info-board">
      <MyInformation />
    </section>
  </PageTemplate>
)

export const MyUploadingPost = () => (
  <PageTemplate>
    <section className="my-post-board">
      <MyPost />
    </section>
  </PageTemplate>
)

// 검색 메뉴
export const Search = () => (
  <PageTemplate>
    <section className="search-board">
      <SearchPage />
    </section>
  </PageTemplate>
);

// 자유게시판
export const Forum = () => (
  <PageTemplate>
    <section className="forum-board">
      <ForumPage />
    </section>
  </PageTemplate>
);

export const UploadPostPage = () => (
  <PageTemplate>
    <section className="UploadPost-page">
      <UploadPost />
    </section>
  </PageTemplate>
)

export const Post = () => (
  <PageTemplate>
    <section className="post-page">
      <PostPage />
    </section>
  </PageTemplate>
)

// 로그인 페이지
export const Login = () => (
  <div className="login-page">
    <LoginPage/>
  </div>
);

// 회원가입 페이지
export const Signup = () => (
  <div className="signup-page">
    <SignupPage/>
  </div>
);

// 오류 페이지(404 NOT FOUND)
// 설정되지 않은 경로로 갈 경우 나타남
export const Notfound = () => {
  const locations = useLocation();
  return (
  <div>
    <h1>404 NOT FOUND in {locations.pathname}</h1>
    <hr/>
    <p>경로가 잘못되었습니다. 주소를 다시 확인해주세요.</p>
  </div>
  );
};