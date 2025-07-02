import { useState } from "react";
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
// 이 훅은 페이지 이동과 URL 쿼리 파라미터 관리를 위한 커스텀 훅입니다.

//URL 쿼리에서 가져온 값을 정수로 변환하고, 값이 없으면 기본값을 반환
const getNum = (param, defaultValue) => {
  if (!param) {
    return defaultValue;
  }

  return parseInt(param);
};

const useCustomMove = () => {
  const navigate = useNavigate(); // 페이지 이동을 위한 훅
  const [refresh, setRefresh] = useState(); // 새로고침 상태 트리거
  const [queryParams] = useSearchParams(); // 현재 URL 쿼리 파라미터 가져오기

  const page = getNum(queryParams.get("page"), 1); // 쿼리에서 'page' 파라미터 추출, 없으면 1
  const size = getNum(queryParams.get("size"), 10); // 쿼리에서 'size' 파라미터 추출, 없으면 10

  // 기본 쿼리 문자열 생성
  const queryDefault = createSearchParams({ page, size }).toString();

  // 리스트 페이지로 이동합니다.
  // 전달된 pageParam이 있으면 해당 값으로 쿼리 문자열을 만들고,
  // 없으면 기존 쿼리(queryDefault)를 사용
  const moveToList = (pageParam) => {
    let queryStr = "";

    if (pageParam) {
      const pageNum = getNum(pageParam.page, 1);
      const sizeNum = getNum(pageParam.size, 10);

      queryStr = createSearchParams({
        page: pageNum,
        size: sizeNum,
      }).toString();
    } else {
      queryStr = queryDefault;
    }

    setRefresh(!refresh);

    navigate({ pathname: `../list`, search: queryStr });
  };

  //특정 게시글 번호(num)에 해당하는 수정 페이지로 이동합니다.
  const moveToModify = (num) => {
    console.log(queryDefault);

    navigate({
      pathname: `../modify/${num}`,
      search: queryDefault,
    });
  };

  //특정 게시글 번호(num)에 해당하는 읽기 페이지로 이동합니다.
  const moveToRead = (num) => {
    console.log(queryDefault);

    navigate({
      pathname: `../read/${num}`,
      search: queryDefault,
    });
  };

  // 페이지 이동과 새로고침을 위한 함수들을 반환합니다.
  return { moveToList, moveToModify, moveToRead, page, size, refresh };
};

export default useCustomMove;
