import { useState } from "react";
import { joinPost } from "../../api/memberApi";
import useCustomLogin from "../../hooks/useCustomLogin";
import ResultModal from "../common/ResultModal";

const initState = {
  email: "",
  pw: "",
  nickname: "",
};

const JoinComponent = () => {
  const [joinParam, setJoinParam] = useState({ ...initState });
  const [result, setResult] = useState(null);
  const { moveToPath } = useCustomLogin();

  const handleChange = (e) => {
    joinParam[e.target.name] = e.target.value;
    setJoinParam({ ...joinParam });
  };

  const handleClickJoin = async () => {
    try {
      // 입력 값 검증
      if (!joinParam.email || !joinParam.pw || !joinParam.nickname) {
        alert("모든 필드를 입력해주세요.");
        return;
      }

      if (joinParam.pw.length < 6) {
        alert("비밀번호는 6자리 이상 입력해주세요.");
        return;
      }
      const response = await joinPost(joinParam);
      console.log("Join success:", response);
      setResult("회원가입이 완료되었습니다!");
    } catch (error) {
      console.error("Join error:", error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    }
  };

  const closeModal = () => {
    setResult(null);
    setJoinParam({ ...initState }); // 폼 초기화
    moveToPath("/member/login"); // 로그인 페이지로 이동
  };

  return (
    <div className="border-2 border-sky-200 mt-10 m-2 p-4">
      {result ? (
        <ResultModal
          title={"회원가입 결과"}
          content={result}
          callbackFn={closeModal}
        />
      ) : (
        <></>
      )}

      <div className="flex justify-center">
        <div className="text-4xl m-4 p-4 font-extrabold text-blue-500">
          Join Component
        </div>
      </div>

      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-full p-3 text-left font-bold">Email</div>
          <input
            className="w-full p-3 rounded-r border border-solid border-neutral-500 shadow-md"
            name="email"
            type="email"
            placeholder="이메일을 입력하세요"
            value={joinParam.email}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-full p-3 text-left font-bold">Password</div>
          <input
            className="w-full p-3 rounded-r border border-solid border-neutral-500 shadow-md"
            name="pw"
            type="password"
            placeholder="비밀번호를 입력하세요 (6자리 이상)"
            value={joinParam.pw}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-full p-3 text-left font-bold">Nickname</div>
          <input
            className="w-full p-3 rounded-r border border-solid border-neutral-500 shadow-md"
            name="nickname"
            type="text"
            placeholder="닉네임을 입력하세요"
            value={joinParam.nickname}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full justify-center">
          <div className="w-2/5 p-6 flex justify-center font-bold">
            <button
              className="rounded p-4 w-36 bg-green-500 text-xl text-white hover:bg-green-600 transition-colors"
              onClick={handleClickJoin}
            >
              Join
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full justify-center">
          <div className=" flex justify-center">
            이미 계정이 있으신가요?
            <button
              className="text-blue-500 hover:text-blue-700 underline"
              onClick={() => moveToPath("/member/login")}
            >
              로그인하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinComponent;
