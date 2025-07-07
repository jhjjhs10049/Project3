import axios from "axios";
// Todo 항목의 등록, 조회, 수정, 삭제, 목록 불러오기 등의 기능을 수행하기 위해
// axios를 사용한 API 요청 함수들을 정의한 유틸 모듈

export const API_SERVER_HOST = "http://localhost:8080"; //API 서버의 기본 URL을 설정.

const prefix = `${API_SERVER_HOST}/api/todo`; //prefix는 모든 요청 URL의 공통 접두사(/api/todo)를 미리 정의.

// 비동기함수란 쉽게 일을할때 일이 끝날때까지 기다리지않고 다음 일을 할 수 있는 함수
// 비동기 함수는 일반적으로 Promise를 반환하며, 이를 통해 작업의 완료 여부를 확인가능
// async 비동기 함수 정의 (항상 promise를 반환함 (pending, fulfilled, rejected 상태등))
// pending	대기 중. 아직 결과가 없음
// fulfilled	작업 성공. resolve() 호출됨
// rejected	작업 실패. reject() 호출됨

// await
// await 키워드는 Promise가 처리될 때까지 기다리는 역할을 함
// await는 async 함수 내에서만 사용할 수 있으며, Promise가 처리될 때까지 코드 실행을 일시 중지함
// 이때, Promise가 성공적으로 처리되면 결과값을 반환하고, 실패하면 에러를 발생시킴

// axios
// axios는 HTTP 요청을 보내고 응답을 받기 위한 라이브러리로, Promise 기반으로 동작함
// axios를 사용하면 GET, POST, PUT, DELETE 등의 HTTP 메서드를 쉽게 사용할 수 있음

// 1. 단일 항목 조회 (GET)
// tno는 ListComponent.jsx의 onClick={() => moveToRead(todo.tno)} 실행시 만들어지며, 클릭한 해당 Todo 항목의 tno를 전달받음
export const getOne = async (tno) => {
  // "http://localhost:8080/api/todo/1" 형태의 URL로 요청을 보내고,
  const res = await axios.get(`${prefix}/${tno}`); // ← get으로 TodoController 호출
  // 응답으로 받은 데이터를 반환
  return res.data;
};

// 2. 리스트 조회 (GET)
// pageParam은 페이지 번호와 페이지 크기를 포함하는 객체로, 예: { page: 1, size: 10 }
// ListComponent.jsx 에서 getList({ page, size })와 같이 getList() API를 호출하여 데이터를 받아올때
// 언어상에서 getList(pageParam) 형태로 저장되는걸 이용해 사용하는것 따로 지정해주지 않아도 됨

// pageParam 으로 쿼리스트링 즉, 페이지 정보(페이지 번호와 페이지 크기)를 받음
export const getList = async (pageParam) => {
  // 받은 쿼리스트링을 page, size로 분리
  const { page, size } = pageParam;
  // axios는 이 params 객체를 자동으로 ?page=...&size=... 쿼리스트링으로 변환해줌
  const res = await axios.get(`${prefix}/list`, {
    // ← get으로 TodoController 호출
    params: { page: page, size: size },
  });
  return res.data;
};

// 3. 항목 추가 (POST)
// todo는 AddComponent.jsx 에서 const [todo, setTodo] = useState({ ...initState }) 와 같이
// initState로 초기화된 상태를 가지고 있으며, title, writer, dueDate 등의 속성을 포함
export const postAdd = async (todo) => {
  const res = await axios.post(`${prefix}/`, todo); // ← post로 TodoController 호출
  return res.data;
};

// 4. 항목 수정 (PUT)
// 기본값은 3번과 같이 초기화된 상태이지만, ModifyComponent.jsx 에서 getOne(tno)로 이미 해당되는 값을 가져왔기에
// 수정상태에는 해당되는 todo 객체가 존재함
export const putOne = async (todo) => {
  const res = await axios.put(`${prefix}/${todo.tno}`, todo); // ← put으로 TodoController 호출
  return res.data;
};

// 5. 항목 삭제 (DELETE)
// 4번과 같이 ModifyComponent.jsx 에서 getOne(tno)로 이미 해당되는 값을 가져옴   
export const deleteOne = async (tno) => {
  const res = await axios.delete(`${prefix}/${tno}`); // ← delete으로 TodoController 호출
  return res.data;
};
