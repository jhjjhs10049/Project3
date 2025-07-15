import { useEffect, useState } from "react";
import { getList } from "../../api/todoApi";
import useCustomMove from "../../hooks/useCustomMove";
import PageComponent from "../common/PageComponent";
import useCustomLogin from "../../hooks/useCustomLogin";
//서버에서 목록을 받아와 리스트 형태로 보여주고, 각 항목 클릭 시 상세 페이지로 이동하며,
// 하단의 페이지네이션을 통해 페이지 전환 가능

// 초기 상태 정의
// 이하 객체들을 초기화하는 객체
const initState = {
  dtoList: [],
  pageNumList: [],
  pageRequestDTO: null,
  prev: false,
  next: false,
  totalCount: 0,
  prevPage: 0,
  nextPage: 0,
  totalPage: 0,
  current: 0,
};

// ListComponent는 Todo 목록을 보여주는 컴포넌트
const ListComponent = () => {
  // 커스텀 훅을 사용하여 {} 안의 함수들을 가져옴
  const { page, size, refresh, moveToList, moveToRead } = useCustomMove();

  //상태 정의 및 목록 가져오기
  const [serverData, setServerData] = useState(initState);

  // 예외 처리
  const { exceptionHandle } = useCustomLogin();
  // page, size, refresh가 변경될 때마다 getList() API를 호출하여 데이터를 받아옴
  useEffect(() => {
    getList({ page, size })
      .then((data) => {
        console.log(data);
        setServerData(data);
      })
      .catch((err) => {
        console.error("Todo list error:", err);
        exceptionHandle(err);
      }); //page, size, refresh 의 값이 바뀔때 마다 getList()가 호출 된다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, size, refresh]); // exceptionHandle 의존성 제거로 무한 루프 방지

  // refresh는 강제로 목록을 새로고침할 때 사용됨 EX : 등록(Add) 후 이동할 때.
  return (
    <div className="border-2 border-blue-100 mt-10 mr-2 ml-2">
      {/* Todo List Component */}
      <div className="flex flex-wrap mx-auto justify-center p-6">
        {serverData?.dtoList?.map((todo) => (
          // 각 todo 항목을 클릭하면 moveToRead() 함수가 호출되어 상세 페이지로 이동
          <div
            key={todo.tno}
            className="w-full min-w-[400px] p-2 rounded shadow-md"
            onClick={() => moveToRead(todo.tno)}
          >
            {/* 각 todo 항목의 정보 표시 */}
            <div className="flex ">
              <div className="font-extrabold text-2xl p-2 w-1/12">
                {todo.tno}
              </div>
              <div className="text-1xl m-1 p-2 w-8/12 font-extrabold">
                {todo.title}
              </div>
              <div className="text-1xl m-1 p-2 w-2/10 font-medium">
                {todo.dueDate}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 페이지 컴포넌트 */}
      {/* 서버에서 받아온 데이터를 PageComponent에 전달 */}
      <PageComponent
        serverData={serverData}
        movePage={moveToList}
      ></PageComponent>
    </div>
  );
};

export default ListComponent;
