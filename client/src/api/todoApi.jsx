import axios from "axios";
// Todo 항목의 등록, 조회, 수정, 삭제, 목록 불러오기 등의 기능을 수행하기 위해
// axios를 사용한 API 요청 함수들을 정의한 유틸 모듈

export const API_SERVER_HOST = "http://localhost:8080"; //API 서버의 기본 URL을 설정.

const prefix = `${API_SERVER_HOST}/api/todo`; //prefix는 모든 요청 URL의 공통 접두사(/api/todo)를 미리 정의.

// 단일 항목 조회 (GET)
export const getOne = async (tno) => {
  const res = await axios.get(`${prefix}/${tno}`);
  return res.data;
};

// 리스트 조회 (GET with params)
export const getList = async (pageParam) => {
  const { page, size } = pageParam;
  const res = await axios.get(`${prefix}/list`, {
    params: { page: page, size: size },
  });
  return res.data;
};

// 항목 추가 (POST)
export const postAdd = async (todoObj) => {
  const res = await axios.post(`${prefix}/`, todoObj);
  return res.data;
};

// 항목 삭제 (DELETE)
export const deleteOne = async (tno) => {
  const res = await axios.delete(`${prefix}/${tno}`);
  return res.data;
};

// 항목 수정 (PUT)
export const putOne = async (todo) => {
  const res = await axios.put(`${prefix}/${todo.tno}`, todo);
  return res.data;
};
