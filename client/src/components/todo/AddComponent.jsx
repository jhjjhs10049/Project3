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
  // initState를 사용하여 todo 상태를 초기화
  const [todo, setTodo] = useState({ ...initState });

  // 결과 데이터가 있는 경우에는 ResultModal을 보여준다.
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

        setResult(result.TNO); // 등록된 항목 고유 번호(TNO)를 상태에 저장
        setTodo({ ...initState }); // 입력 필드 초기화
      })
      .catch((e) => {
        console.error(e);
      });
  };

  // 모달 닫기 함수
  // ResultModal에서 호출되어 등록 결과를 초기화하고 목록으로 이동
  // moveToList()를 호출하여 목록 페이지로 이동
  const closeModal = () => {
    setResult(null);
    moveToList(); //moveToList() 호출
  };

  return (
    <div className="border-2 border-sky-200 mt-10 m-2 p-4">
      {/* 모달 처리 (삼항 연산자)*/}
      {/* 등록결곽가 있으면 모달을 보여줌 */}
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
