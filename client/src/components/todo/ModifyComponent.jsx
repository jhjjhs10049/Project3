import { useEffect, useState } from "react";
import { deleteOne, getOne, putOne } from "../../api/todoApi";
import useCustomMove from "../../hooks/useCustomMove";
import ResultModal from "../common/ResultModal";
// 상세 정보를 조회, 사용자가 수정하거나 삭제할 수 있도록 입력 필드를 제공하며,
// 처리 결과에 따라 모달을 표시하고 적절한 화면으로 이동하는 수정/삭제 전용 화면

// 초기 상태 정의
// title, writer, dueDate, complete를 초기화하는 객체
const initState = {
  tno: 0,
  title: "",
  writer: "",
  dueDate: "null",
  complete: false,
};

// ModifyComponent는 Todo 항목을 수정하는 컴포넌트
const ModifyComponent = ({ tno }) => {
  // initState를 사용하여 todo 상태를 초기화
  const [todo, setTodo] = useState({ ...initState });

  // 결과 메세지 즉, 모달 창을 위한 상태
  const [result, setResult] = useState(null);

  // 작업완료 후 이동경로 제어를 위한 기능
  const { moveToList, moveToRead } = useCustomMove();

  // 컴포넌트가 마운트되거나 tno가 변경될 때 getOne() API를 호출하여 todo 데이터를 가져옴
  // getOne() API를 호출하여 tno에 해당하는 todo 항목을 가져와 todo 상태에 저장
  useEffect(() => {
    getOne(tno).then((data) => setTodo(data));
  }, [tno]);

  // 수정 버튼 클릭시 호출되는 함수
  // putOne() API를 호출하여 todo 항목을 수정하고, 결과를 상태에 저장
  const handleClickedModify = () => {
    putOne(todo).then((data) => {
      console.log("modify result: " + data);
      // callback 함수의 result값에 Modified를 저장 더이상 null이 아니게 됨으로 자동으로 모달창이 열림
      setResult("Modified");
    });
  };

  // 삭제 버튼 클릭시 호출되는 함수
  // deleteOne() API를 호출하여 todo 항목을 삭제하고, 결과를 상태에 저장
  const handleClickDelete = () => {
    deleteOne(tno).then((data) => {
      console.log("delete result: " + data);
      // callback 함수의 result값에 Deleted를 저장 더이상 null이 아니게 됨으로 자동으로 모달창이 열림
      setResult("Deleted");
    });
  };

  //모달 창이 close될때
  const closeModal = () => {
    if (result === "Deleted") {
      // 삭제시 목록으로 이동
      moveToList();
    } else {
      // 수정시 해당 tno페이지의 상세보기로 이동
      moveToRead(tno);
    }
  };

  // 입력 필드(title, dueDate 등) 변경 시 해당 값을 todo 상태에 반영합니다.
  const handleChangeTodo = (e) => {
    setTodo({ ...todo, [e.target.name]: e.target.value });
  };
  // 완료 여부(select box에서 Y/N 선택) 변경 시 boolean으로 변환해 complete에 저장
  const handleChangeTodoComplete = (e) => {
    const value = e.target.value;
    todo.complete = value === "Y";
    setTodo({ ...todo });
  };

  return (
    <div className="border-2 border-sky-200 mt-10 m- p-4">
      {/* 모달 처리 (삼항 연산자)*/}
      {/* result 값이 있으면 ResultModal 컴포넌트 보여줌 */}
      {result ? (
        <ResultModal
          title={"처리결과"}
          content={result}
          callbackFn={closeModal}
        ></ResultModal>
      ) : (
        <></>
      )}

      {/* 수정불가항목들 TNO, WRITER */}
      <div className="flex justify-center mt-10">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">TNO</div>
          <div className="w-4/5 p-6 rounded-r border border-solid shadow-md bg-gray-100">
            {todo.tno}
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">WRITER</div>
          <div className="w-4/5 p-6 rounded-r border border-solid shadow-md bg-gray-100">
            {todo.writer}
          </div>
        </div>
      </div>

      {/* 수정가능항목 TITLE, DUEDATE */}
      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">TITLE</div>
          <input
            className="w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md"
            name="title"
            type="{'text'}"
            value={todo.title}
            onChange={handleChangeTodo}
          ></input>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">DUEDATE</div>
          <input
            className="w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md"
            name="dueDate"
            type="{'date'}"
            value={todo.dueDate}
            onChange={handleChangeTodo}
          ></input>
        </div>
      </div>

      {/* 완료 여부 표시기능 (실제로는 안쓸것 같음...) */}
      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">COMPLETE</div>
          <select
            name="status"
            className="border-solid border-2 rounded m-1 p-2"
            onChange={handleChangeTodoComplete}
            value={todo.complete ? "Y" : "N"}
          >
            <option value={"Y"}>Completed</option>
            <option value={"N"}>Not Yet</option>
          </select>
        </div>
      </div>

      {/* 버튼 */}
      <div className="flex justify-end p-4">
        <button
          type="button"
          className="rounded p-4 m-2 text-x1 w-32 text-white bg-red-500"
          onClick={handleClickDelete}
        >
          Delete
        </button>
        <button
          type="button"
          className="rounded p-4 m-2 text-x1 w-32 text-white bg-blue-500"
          onClick={handleClickedModify}
        >
          Modify
        </button>
      </div>
    </div>
  );
};

export default ModifyComponent;
