import { useState } from "react";
import { postAdd } from "../../api/todoApi";
import ResultModal from "../common/ResultModal";
import useCustomMove from "../../hooks/useCustomMove";
// 이 컴포넌트는 추가를 위해 사용자가 정보를 입력하면 postadd API를 호출하여
// 서버에 데이터를 등록후, 등록 결과를 모달로 보여주고 닫으면 목록페이지로 이동

// 초기 상태 정의
// title, writer, dueDate를 초기화하는 객체
const initState = {
  title: "",
  writer: "",
  dueDate: "",
};

// AddComponent는 새로운 Todo 항목을 추가하는 컴포넌트
const AddComponent = () => {
  // useState 라는 리엑트 내장훅을 사용하여 상태 관리
  // initState를 사용하여 todo 상태를 초기화
  // ...은 객체를 복사해서 초기값으로 설정
  // 결과적으론 todo는 title, writer, dueDate를 포함하는 객체가 되어 todoApi.js에서 사용되며 todoObj로도 사용해도된다.
  const [todo, setTodo] = useState({ ...initState });

  const [result, setResult] = useState(null); //등록 결과 상태

  const { moveToList } = useCustomMove(); // 페이지 이동 커스텀 훅

  // 입력 필드의 변경을 처리하는 함수
  const handleChangeTodo = (e) => {
    todo[e.target.name] = e.target.value; //입력된 값(title, writer, dueDate)을 상태에 반영
    setTodo({ ...todo });
  };

  // 등록 버튼 클릭 시 호출되는 함수
  const handleClickAdd = () => {
    console.log(todo);

    postAdd(todo)
      .then((result) => {
        console.log(result);

        // callback 함수의 result값에 TNO를 저장 더이상 null이 아니게 됨으로 자동으로 모달창이 열림
        setResult(result.TNO);
        setTodo({ ...initState }); // 입력 필드 초기화
      })
      .catch((e) => {
        console.error(e);
      });
  };

  // 모달 닫기 함수
  // moveToList()를 호출하여 목록 페이지로 이동
  const closeModal = () => {
    moveToList(); //moveToList() 호출
  };

  return (
    <div className="border-2 border-sky-200 mt-10 m-2 p-4">
      {/* 모달 처리 (삼항 연산자)*/}
      {/* result 값이 있으면 ResultModal 컴포넌트 보여줌 */}
      {result ? (
        <ResultModal
          title={"Add Result"}
          content={`New ${result} Added`}
          // 모달이 닫힐 때 호출되는 함수
          callbackFn={closeModal}
        />
      ) : (
        <></>
      )}

      {/* 각 필드(제목, 작성자, 등록일)에 대한 입력창 */}
      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">TITLE</div>
          <input
            className="w-4/5 p-6 rounded-r border border-solid border-neutral-500 shadow-md"
            name="title"
            type={"text"}
            value={todo.title}
            onChange={handleChangeTodo}
          ></input>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">WRITER</div>
          <input
            className="w-4/5 p-6 rounded-r border border-soild border-neutral-500 show-md"
            name="writer"
            type={"text"}
            value={todo.writer}
            onChange={handleChangeTodo}
          ></input>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">DUEDATE</div>
          <input
            className="w-4/5 p-6 rounded-r border border-soild border-neutral-500 show-md"
            name="dueDate"
            type={"date"} // data 타입을 설정하면 달력 버튼과 기능을 자동으로 제공해준다.
            value={todo.dueDate}
            onChange={handleChangeTodo}
          ></input>
        </div>
      </div>

      {/* ADD버튼 */}
      <div className="flex justify-end">
        <div className="relative mb-4 flex p-4 flex-wrap items-stretch">
          <button
            type="button"
            className="rounded p-4 w-36 bg-blue-500 text-xl text-white"
            onClick={handleClickAdd}
          >
            ADD
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddComponent;
