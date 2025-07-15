import { Outlet, useNavigate } from "react-router-dom";
import BasicLayout from "../../layouts/BasicLayout";
import { useCallback } from "react";
import useCustomLogin from "../../hooks/useCustomLogin";

const IndexPage = () => {
  //useNavigate() : 상황에 따라 동적으로 데이터를 처리해서 이동하는 경우에 사용 (<Native>나 <Link> 대신에 사용하자)
  const navigate = useNavigate();

  // 로그인 상태 확인
  const { isLogin } = useCustomLogin();

  const handleClickList = useCallback(() => {
    navigate({ pathname: "list" });
  }, [navigate]);

  const handleClickAdd = useCallback(() => {
    navigate({ pathname: "add" });
  }, [navigate]);

  return (
    //<></>
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
      </div>
    </BasicLayout>
  );
};

export default IndexPage;
