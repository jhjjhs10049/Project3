// import { useEffect, useState } from "react";
import BasicLayout from "../layouts/BasicLayout";
// import useCustomLogin from "../hooks/useCustomLogin";
// import jwtAxios from "../util/JWTUtil";

const AboutPage = () => {
  // const { exceptionHandle } = useCustomLogin();
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   // API 호출을 통해 토큰 검증
  //   const checkAuth = async () => {
  //     try {
  //       // 간단한 인증 확인 API 호출 (todo list 등을 사용)
  //       await jwtAxios.get("/api/todo/list?page=1&size=1");
  //       setLoading(false);
  //     } catch (err) {
  //       // 토큰이 없거나 유효하지 않으면 exceptionHandle에서 REQUIRE_LOGIN 처리
  //       exceptionHandle(err);
  //     }
  //   };

  //   checkAuth();
  // }, [exceptionHandle]);

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  return (
    <BasicLayout>
      <div className="text-3xl">About Page</div>
    </BasicLayout>
  );
};

export default AboutPage;
