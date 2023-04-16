/**
 * ./src/components/menu/Hierarchy.js
 * path 계층 정의
 */

// import Route, Routes, Navigate
import {Route, Routes, Navigate} from 'react-router-dom';
// import components
import {
  MainBoard, MyInfo, MyPersonalInfo, MyUploadingPost,
  MissBoard, FindBoard, HospitalMap, Search, Posting, Notfound, Login, Signup, Upload, MoreInfo, MoreInfo2
  } from "../page/Pages";
import { DetailPage } from '../page/miss/DetailPage';
import data from '../page/miss/data';

// path 정의
const Hierarchy = () => (
    <>
    <Routes>
      <Route exact path='/' element={<MainBoard />} />

      <Route path="/miss/*" element={<MissBoard />} />
      <Route path="/miss/upload*" element={<Upload />} />
      <Route path="/miss/moreInfo*" element={<MoreInfo />} />
      <Route path="/miss/moreInfo/upload*" element={<Upload />} />
      <Route path="/miss/moreInfo2*" element={<MoreInfo2 />} />
      <Route path="/miss/moreInfo2/upload*" element={<Upload />} />

      <Route path="/find/*" element={<FindBoard />} />
      <Route path="/hospital/*" element={<HospitalMap />} />
      <Route path="/search/*" element={<Search />} />
      <Route path="/posting/*" element={<Posting />} />

      <Route path="/login" element={<Login />} />
      <Route path="/login/signup" element={<Signup />} />

      <Route path="/mypage/*" element={<MyInfo />}>
        <Route path='' element={<MyPersonalInfo />} />
        <Route path='information' element={<MyPersonalInfo />} />
        <Route path='post' element={<MyUploadingPost />} />
      </Route>

      <Route path='/information' element={<Navigate replace='true' to='mypage/information' />} />
      <Route path='/post' element={<Navigate replace='true' to='mypage/post' />} />

      {/* 상세페이지 */}
      <Route path='detail/:id' element={<DetailPage data={data} />} />
      {/* <Route path='detail/:id' element={data.map((item, i) => <DetailPage data={item} i={i+1} key={item.id}/>)} /> */}

      <Route path="*" element={<Notfound />} />
    </Routes>
    </>
);

// export this component
export default Hierarchy;