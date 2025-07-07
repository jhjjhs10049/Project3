import { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import todoRouter from "./todoRouter";
import productsRouter from "./productsRouter";

const Loading = <div>Loading....</div>;
// lazy()를 사용하여 컴포넌트를 동적으로 import
// 지연로딩 을 통해 초기 로딩 속도를 개선 필요한 시점에 컴포넌트 로드
const Main = lazy(() => import("../pages/MainPage"));
const About = lazy(() => import("../pages/AboutPage"));
const TodoIndex = lazy(() => import("../pages/todo/IndexPage"));
const TodoList = lazy(() => import("../pages/todo/ListPage"));
const ProductsIndex = lazy(() => import("../pages/products/IndexPage"))

const root = createBrowserRouter([
  {
    // (루트 경로) → MainPage 컴포넌트를 렌더링
    path: "",
    element: (
      <Suspense fallback={Loading}>
        <Main />
      </Suspense>
    ),
  },
  {
    //about → AboutPage 컴포넌트를 렌더링
    path: "about",
    element: (
      <Suspense fallback={Loading}>
        <About />
      </Suspense>
    ),
  },
  {
    //todo → TodoIndex 컴포넌트를 렌더링하고, 그 내부에 todoRouter()로 반환되는 자식 라우트를 추가
    path: "todo",
    element: (
      <Suspense fallback={Loading}>
        <TodoIndex />
      </Suspense>
    ),
    children: todoRouter(),
    // todoRouter() 함수는 /todo/list, /todo/read/:tno, /todo/add, /todo/modify/:tno 등의 경로를 정의
    // todoRouter.jsx 참조
  },
  {
    path: "products",
    element: (
      <Suspense fallback={Loading}>
        <ProductsIndex />
      </Suspense>
    ),
    children: productsRouter(),
  },
]);

export default root;
