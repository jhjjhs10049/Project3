import { Suspense, lazy } from "react";
import { Navigate } from "react-router-dom";

const Loading = <div>Loading...</div>;
// lazy()를 사용하여 컴포넌트를 동적으로 import
// 지연로딩 을 통해 초기 로딩 속도를 개선 필요한 시점에 컴포넌트 로드
const TodoList = lazy(() => import("../pages/todo/ListPage"));
const TodoRead = lazy(() => import("../pages/todo/ReadPage"));
const TodoAdd = lazy(() => import("../pages/todo/AddPage"));
const TodoModify = lazy(() => import("../pages/todo/ModifyPage"));

const todoRouter = () => {
  return [
    {
      // /todo/list 경로에 접속하면, TodoList 컴포넌트가 로드
      path: "list",
      element: (
        <Suspense fallback={Loading}>
          <TodoList />
        </Suspense>
      ),
    },
    {
      // /todo 경로에 접속하면, 기본적으로 /todo/list로 리디렉션
      path: "",
      element: <Navigate replace to="list" />,
    },
    {
      // /todo/read/:tno 경로에 접속하면 tno라는 파라미터를 받아서, 해당 TodoRead 컴포넌트가 로드
      path: "read/:tno",
      element: (
        <Suspense fallback={Loading}>
          <TodoRead />
        </Suspense>
      ),
    },
    {
      // /todo/add 경로로 접속하면 TodoAdd 컴포넌트가 로드됩니다. 새 Todo를 추가하는 페이지
      path: "add",
      element: (
        <Suspense fallback={Loading}>
          <TodoAdd />
        </Suspense>
      ),
    },
    {
      // /todo/modify/:tno 경로는 tno 파라미터를 받아 수정할 Todo의 ID를 나타내며, 해당 Todo 항목을 수정하는 TodoModify 컴포넌트를 로드
      path: "modify/:tno",
      element: (
        <Suspense fallback={Loading}>
          <TodoModify />
        </Suspense>
      ),
    },
  ];
};

export default todoRouter;
