import { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import todoRouter from "./todoRouter";

const Loading = <div>Loading....</div>;
const Main = lazy(() => import("../pages/MainPage"));
const About = lazy(() => import("../pages/AboutPage"));
const TodoIndex = lazy(() => import("../pages/todo/IndexPage"));
const TodoList = lazy(() => import("../pages/todo/ListPage"));

const root = createBrowserRouter([
  {
    // (루트 경로) → MainPage 컴포넌트를 렌더링합니다.
    path: "",
    element: (
      <Suspense fallback={Loading}>
        <Main />
      </Suspense>
    ),
  },
  {
    //about → AboutPage 컴포넌트를 렌더링합니다.
    path: "about",
    element: (
      <Suspense fallback={Loading}>
        <About />
      </Suspense>
    ),
  },
  {
    //todo → TodoIndex 컴포넌트를 렌더링하고, 그 내부에 todoRouter()로 반환되는 자식 라우트를 추가합니다.
    path: "todo",
    element: (
      <Suspense fallback={Loading}>
        <TodoIndex />
      </Suspense>
    ),
    children: todoRouter(),
    // todoRouter() 함수는 /todo/list, /todo/read/:tno, /todo/add, /todo/modify/:tno 등의 경로를 정의합니다.
    // todoRouter.jsx 참조
  },
]);

export default root;
