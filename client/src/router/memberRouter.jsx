import { lazy, Suspense } from "react";
const Loading = <div>Loading....</div>
const Login = lazy(() => import("../pages/member/LoginPage"))
const LogoutPage = lazy(() => import("../pages/member/LogoutPage"))


const memberRouter = () => {

    return [
        {
            path : "login",
            element : <Suspense fallback={Loading}><Login/></Suspense>  //로그인 페이지로 이동
        },
        {
            path : "logout",
            element : <Suspense fallback={Loading}><LogoutPage/></Suspense>//로그아웃 페이지로 이동
        }
    ]
}

export default memberRouter;