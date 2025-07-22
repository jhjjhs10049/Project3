import { useState } from "react";
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
  useLocation,
} from "react-router-dom";
import { PAGE_CONSTANTS } from "../constants/pageConstants.jsx";
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
  const location = useLocation(); // 현재 경로 확인을 위한 훅
  const [refresh, setRefresh] = useState(); // 새로고침 상태 트리거
  const [queryParams] = useSearchParams(); // 현재 URL 쿼리 파라미터 가져오기

  // 현재 경로가 products 관련인지 확인
  const isProductPage = location.pathname.includes("/products");

  const page = getNum(queryParams.get("page"), PAGE_CONSTANTS.DEFAULT_PAGE); // 쿼리에서 'page' 파라미터 추출, 없으면 1
  const size = getNum(
    queryParams.get("size"),
    isProductPage ? PAGE_CONSTANTS.PRODUCT_SIZE : PAGE_CONSTANTS.DEFAULT_SIZE
  ); // Product 페이지면 16, 아니면 10을 기본값으로 사용

  // num 은 todo.tno와 같음

  // 기본 쿼리 문자열 생성
  const queryDefault = createSearchParams({ page, size }).toString();

  //특정 게시글 번호(num)에 해당하는 읽기 페이지로 이동합니다.
  const moveToRead = (num) => {
    console.log(queryDefault);

    // navigate({
    // pathname: `../read/7`,
    // search: `?page=1&size=10`,});

    // 즉 /read/7?page=1&size=10 이런주소로 이동

    navigate({
      //<- 해당 주소로 이동시켜주는 React Router의 내장함수임
      pathname: `../read/${num}`,
      search: queryDefault, // <- ?page=1&size=10 과 같은 쿼리스트링
    });
  };

  //특정 게시글 번호(num)에 해당하는 수정 페이지로 이동합니다.
  const moveToModify = (num) => {
    console.log(queryDefault);

    navigate({
      pathname: `../modify/${num}`,
      search: queryDefault,
    });
  };

  // 리스트 페이지로 이동합니다.
  // 전달된 pageParam이 있으면 해당 값으로 쿼리 문자열을 만들고,
  // 없으면 기존 쿼리(queryDefault)를 사용
  const moveToList = (pageParam) => {
    let queryStr = "";
    if (pageParam) {
      const pageNum = getNum(pageParam.page, PAGE_CONSTANTS.DEFAULT_PAGE);
      const sizeNum = getNum(pageParam.size, PAGE_CONSTANTS.DEFAULT_SIZE);

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

  // Product 전용 리스트 페이지로 이동
  const moveToProductList = (pageParam) => {
    let queryStr = "";

    if (pageParam) {
      const pageNum = getNum(pageParam.page, PAGE_CONSTANTS.DEFAULT_PAGE);
      const sizeNum = getNum(pageParam.size, PAGE_CONSTANTS.PRODUCT_SIZE);

      queryStr = createSearchParams({
        page: pageNum,
        size: sizeNum,
      }).toString();
    } else {
      // Product용 기본 쿼리
      queryStr = createSearchParams({
        page: PAGE_CONSTANTS.DEFAULT_PAGE,
        size: PAGE_CONSTANTS.PRODUCT_SIZE,
      }).toString();
    }

    setRefresh(!refresh);

    navigate({ pathname: `../list`, search: queryStr });
  };

  // Product 전용 읽기 페이지로 이동 (현재 페이지 정보 유지하되 size는 16 사용)
  const moveToProductRead = (num) => {
    const currentSize = getNum(
      queryParams.get("size"),
      PAGE_CONSTANTS.PRODUCT_SIZE
    );
    const productQueryStr = createSearchParams({
      page,
      size:
        currentSize === PAGE_CONSTANTS.DEFAULT_SIZE
          ? PAGE_CONSTANTS.PRODUCT_SIZE
          : currentSize,
    }).toString();

    navigate({
      pathname: `../read/${num}`,
      search: productQueryStr,
    });
  };

  // Product 전용 수정 페이지로 이동 (현재 페이지 정보 유지하되 size는 16 사용)
  const moveToProductModify = (num) => {
    const currentSize = getNum(
      queryParams.get("size"),
      PAGE_CONSTANTS.PRODUCT_SIZE
    );
    const productQueryStr = createSearchParams({
      page,
      size:
        currentSize === PAGE_CONSTANTS.DEFAULT_SIZE
          ? PAGE_CONSTANTS.PRODUCT_SIZE
          : currentSize,
    }).toString();

    navigate({
      pathname: `../modify/${num}`,
      search: productQueryStr,
    });
  };

  // 페이지 이동과 새로고침을 위한 함수들을 반환합니다.
  return {
    moveToList,
    moveToModify,
    moveToRead,
    moveToProductList,
    moveToProductRead,
    moveToProductModify,
    page,
    size,
    refresh,
  };
};

export default useCustomMove;
