import { API_SERVER_HOST } from "./todoApi";
import jwtAxios from "../util/JWTUtil";
import axios from "axios";

// http://localhost:8080/api/products
const host = `${API_SERVER_HOST}/api/products`;

// 1. 단일 항목 조회 (GET) - 로그인 불필요
export const getOne = async (tno) => {
  // http://localhost:8080/api/products/${tno}
  const res = await axios.get(`${host}/${tno}`);
  return res.data;
};

// 2. 리스트 조회 (GET) - 로그인 불필요
export const getList = async (pageParm) => {
  const { page, size } = pageParm;

  const res = await axios.get(`${host}/list`, {
    params: { page: page, size: size },
  });
  return res.data;
};

// 3. 상품 등록 (POST)
// (첨부파일이 존재 하므로 'multipart/form-data' 를 헤더에 설정해서 전송처리 해야 한다.)
export const postAdd = async (product) => {
  // "multipart/form-data" 방식으로 서버를 호출한다.

  //Axios가 기본적으로 'Content-Type'을 'application/json' 을 이용하기 때문에
  //파일 업로드를 같이할 때는 'multipart/form-data'를 헤더 설정에 추가해 주어야 한다.
  const header = { headers: { "Content-Type": "multipart/form-data" } };

  // 경로 뒤 '/' 주의
  const res = await jwtAxios.post(`${host}/`, product, header);

  return res.data;
};

// 4. 상품 수정 (PUT)
// (등록과 마찬가지로 첨부파일이 존재 하므로 'multipart/form-data' 를 헤더에 설정해서 전송처리 해야 한다.)
export const putOne = async (pno, product) => {
  //Axios가 기본적으로 'Content-Type'을 'application/json' 을 이용하기 때문에
  //파일 업로드를 같이할 때는 'multipart/form-data'를 헤더 설정에 추가해 주어야 한다.
  const header = { headers: { "Content-Type": "multipart/form-data" } };

  // 경로 뒤 '/' 주의
  const res = await jwtAxios.put(`${host}/${pno}`, product, header);

  return res.data;
};

// 5-1. 논리 삭제 (SOFT DELETE)
export const softDelete = async (pno) => {
  const res = await jwtAxios.delete(`${host}/soft/${pno}`);
  return res.data;
};

// 5-2. DB 삭제 (HARD DELETE)
export const hardDelete = async (pno) => {
  const res = await jwtAxios.delete(`${host}/hard/${pno}`);
  return res.data;
};
