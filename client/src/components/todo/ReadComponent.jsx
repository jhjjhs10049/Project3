import { useEffect, useState } from "react";
import { getOne } from "../../api/todoApi";
import useCustomMove from "../../hooks/useCustomMove";
// tno에 해당하는 할 일 데이터를 API로 불러와 제목과 값을 분리해 화면에 보여주고,
// 목록 및 수정 페이지로 이동하는 버튼을 제공하는 상세 조회 컴포넌트

// 초기 상태 정의
// title, writer, dueDate, complete를 초기화하는 객체
const initState = {
  tno: 0,
  title: "",
  writer: "",
  dueDate: null,
  complete: false,
};

// ReadComponent는 Todo 항목의 상세 정보를 보여주는 컴포넌트
const ReadComponent = ({ tno }) => {
  // initState를 사용하여 todo 상태를 초기화
  const [todo, setTodo] = useState(initState);

  // 커스텀 훅 useCustomMove에서 목록 페이지로 이동하는 함수 moveToList와 수정 페이지로 이동하는 함수 moveToModify를 받아옴
  const { moveToList, moveToModify } = useCustomMove();

  // 컴포넌트가 마운트되거나 tno가 변경될 때 getOne() API를 호출하여 todo 데이터를 가져옴
  // useEffect 훅을 사용하여 tno가 변경될 때마다 해당 Todo 항목의 데이터를 가져옴
  useEffect(() => {
    console.log("useEffect 실행됨, tno:", tno);

    getOne(tno).then((data) => {
      console.log(data);
      setTodo(data);
    });
  }, [tno]);

  return (
    <div className="border-2 border-sky-200 mt-10 m-2 p-4">
      {/* makeDiv 함수를 이용해 todo 객체의 각 속성을 제목과 값으로 분리해서 렌더링 */}
      {makeDiv("Tno", todo.tno)}
      {makeDiv("Writer", todo.writer)}
      {makeDiv("Title", todo.title)}
      {makeDiv("Due Date", todo.dueDate)}
      {makeDiv("Complete", todo.complete ? "Completed" : "Not Yet")}

      {/* 버튼 */}
      <div className="flex justify-end p-4">
        <button
          type="button"
          className="rounded p-4 m-2 text-xl w-32 text-white bg-blue-500"
          onClick={() => moveToList()}
        >
          List
        </button>
        <button
          type="button"
          className="rounded p-4 m-2 text-xl w-32 text-white bg-red-500"
          onClick={() => moveToModify(tno)}
        >
          Modify
        </button>
      </div>
    </div>
  );
};
// 버튼 윗단 makeDiv 함수정의로 제목과 값으로 분리한 값들을 title과 value로 받아와서 렌더링
const makeDiv = (title, value) => (
  <div className="flex justify-center">
    <div className="relative mb-4 flex w-full flex-wrap items-stretch">
      <div className="w-1/5 p-6 text-right font-bold">{title}</div>
      <div className="w-4/5 p-6 rounded-r border border-solid shadow-md">
        {value}
      </div>
    </div>
  </div>
);

export default ReadComponent;
