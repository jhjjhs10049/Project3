import { Suspense, lazy } from "react";
import { Navigate } from "react-router-dom";

const productsRouter = () => {
  const Loading = <div>Loading....</div>;
  const ProductList = lazy(() => import("../pages/products/ListPage"));
  const ProductsAdd = lazy(() => import("../pages/products/AddPage"));
  const ProductRead = lazy(() => import("../pages/products/ReadPage"));
  const ProductModify = lazy(() => import("../pages/products/ModifyPage"));

  // 보통 return() 이렇게 사용했는데 여기서는 return[] 으로 사용하고 있다.
  // 리액트 에서 여러 컴포넌트를 배열로 반환할때 자주 사용한다.
  return [
    {
      path: "list",
      element: (
        <Suspense fallback={Loading}>
          <ProductList />
        </Suspense>
      ),
    },
    {
      path: "", // '/products/' 경로를 호출할 때 자동으로 '/products/list'로 이동
      element: <Navigate replace to="/products/list" />,
    },
    {
      path: "add",
      element: (
        <Suspense fallback={Loading}>
          <ProductsAdd />
        </Suspense>
      ),
    },
    {
      path: "read/:pno",
      element: (
        <Suspense fallback={Loading}>
          <ProductRead />
        </Suspense>
      ),
    },
    {
      path: "modify/:pno",
      element: (
        <Suspense fallback={Loading}>
          <ProductModify />
        </Suspense>
      ),
    },
  ];
};

export default productsRouter;
