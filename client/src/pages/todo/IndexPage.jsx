import { Outlet, useNavigate } from "react-router-dom";
import BasicLayout from "../../layouts/BasicLayout";
import { useCallback } from "react";
import useCustomLogin from "../../hooks/useCustomLogin";

const IndexPage = () => {
  // useNavigate 훅을 사용하여 페이지 이동 기능을 구현
  const navigate = useNavigate();

  // 로그인 상태 확인
  const { isLogin } = useCustomLogin();

  // handleClickList 함수는 "list" 경로로 이동
  const handleClickList = useCallback(() => {
    navigate({ pathname: "list" });
  }, [navigate]);

  // handleClickAdd 함수는 "add" 경로로 이동
  const handleClickAdd = useCallback(() => {
    navigate({ pathname: "add" });
  }, [navigate]);

  // use Callback 훅을 사용하여 handleClickList와 handleClickAdd 함수를 메모이제이션

  // IndexPage가 자주 렌더링되면 그 안에 있는 handleClickList, handleClickAdd 함수도 매번 새로 만들어짐

  // 그리고 이 함수들이 props로 어떤 하위 컴포넌트로 전달된다면, 불필요한 렌더링을 일으킬 수 있음

  // 지금과 같은 상황에서는 함수가 매번 새로 만들어지는 것보단 useCallback을 사용하여 함수를 메모이제이션하는 것이 성능에 도움이 될 수 있지만,
  // props로 전달되는 하위 컴포넌트가 없기에 굳이 useCallback을 사용할 필요는 없는 상황

  // props전달의 설명 : 부모 컴포넌트가 어떤 함수나 값을 자식 컴포넌트에 전달하면,그 자식 컴포넌트는 그것을 props로 받아 사용
  // 그렇게 해당 함수의 값을 자식 컴포넌트에 넘겨주고 자식컴포넌트가 useCallback없이 메서드를 요청하면 props가 변경되었다고 생각해 자식컴포넌트가 계속 리렌더링됨
  // 따라서 이와같은 경우에 useCallback을 사용하여 함수를 메모이제이션하면, 자식 컴포넌트가 불필요하게 리렌더링되는 것을 방지할 수 있음

  return (
    // BasicLayout 컴포넌트를 사용하여 페이지 레이아웃을 구성
    // 내부에 두 개의 버튼을 배치하여 각각 "LIST"와 "ADD" 기능을 제공
    // 버튼 클릭 시 해당 경로로 이동
    <BasicLayout>
      {" "}
      <div className="w-full flex m-2 p-2">
        <div
          className="text-x1 m-1 p-2 w-20 font-extrabold text-center underline"
          onClick={handleClickList}
        >
          LIST
        </div>
        {/* 로그인한 사용자에게만 ADD 버튼 표시 */}
        {isLogin && (
          <div
            className="text-x1 m-1 p-2 w-20 font-extrabold text-center underline"
            onClick={handleClickAdd}
          >
            ADD
          </div>
        )}
      </div>
      <div className="flex flex-wrap w-full">
        <Outlet />

        {/* IndexPage (부모) 
            ├── BasicLayout (레이아웃)
            │    ├── header, 메뉴 등 공통 UI
            │    ├── <Outlet />  ← 자식 컴포넌트가 여기에 렌더됨
            │
            ├── ListComponent (자식 컴포넌트, URL이 /list일 때)
            │   자식컴포넌트 read, modify, delete 기능을 가지고 있음
            또는
            ├── AddComponent (자식 컴포넌트, URL이 /add일 때)

        URL에 따라 바뀌는 화면 내용만 <Outlet /> 자리에 자동으로 바뀜
        */}
      </div>
    </BasicLayout>
  );
};

export default IndexPage;
