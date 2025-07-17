import { lazy, Suspense } from "react";
const Loading = <div>Loading....</div>
const Login = lazy(() => import("../pages/member/LoginPage"))
const KakaoRedirect = lazy(() => import("../pages/member/KakaoRedirectPage"))
const MemberModify = lazy(() => import("../pages/member/ModifyPage"))

const memberRouter = () => {

    return [
        {
            path : "login",
            element : <Suspense fallback={Loading}><Login/></Suspense>  //로그인 페이지로 이동
        },
        {
            path : "kakao",
            element : <Suspense fallback={Loading}><KakaoRedirect/></Suspense>
        },
        {
            path : "modify",
            element : <Suspense fallback={Loading}><MemberModify/></Suspense>
        }
    ]
}

export default memberRouter;