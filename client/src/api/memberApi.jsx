import axios from "axios";
import { API_SERVER_HOST } from "./todoApi";
import jwtAxios from "../util/JWTUtil";

const host = `${API_SERVER_HOST}/api/member`;

export const loginPost = async (loginParam) => {
  //x-www-form-urlencoded : 주로 HTML 폼 데이터를 서버에 전송할 때 사용되는 MIME 타입.
  //post 또는 put 방식에서 사용. HTML 폼의 기본 인코딩 방식
  //다른 콘텐츠 타입과 비교
  //multipart/form-data: 파일 업로드 시 사용됨
  //application/json: 데이터를 JSON 형식 문자열로 전송 (주로 REST API에서 사용됨)
  const header = { headers: { "Content-Type": "x-www-form-urlencoded" } };

  const form = new FormData();
  form.append("username", loginParam.email);
  form.append("password", loginParam.pw);

  const res = await axios.post(`${host}/login`, form, header);

  return res.data;
};

export const modifyMember = async (member) => {
  const res = await jwtAxios.put(`${host}/modify`, member);
  return res.data;
};
