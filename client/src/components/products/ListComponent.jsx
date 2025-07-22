import { useEffect, useState } from "react";
import { getList } from "../../api/productsApi";
import useCustomMove from "../../hooks/useCustomMove";
import FetchingModal from "../common/FetchingModal";
import { API_SERVER_HOST } from "../../api/todoApi";
import PageComponent from "../common/PageComponent";

const host = API_SERVER_HOST;

const initState = {
  dtoList: [],
  pageNumList: [],
  pageRequestDTO: null,
  prev: false,
  next: false,
  totalCount: 0,
  prevPage: 0, 
  nextPage: 0,
  totalPage: 0,
  current: 0,
};

const ListComponent = () => {
  const { page, size, refresh, moveToProductList, moveToProductRead } =
    useCustomMove();

  //serverData는 나중에 사용
  const [serverData, setServerData] = useState(initState);

  //for FetchingModal
  const [fetching, setFetching] = useState(false);
  useEffect(() => {
    setFetching(true); //true 이면 FetchingModal 을 보여준다. 서버와의 통신이 시작 되었다.

    getList({ page, size }).then((data) => {
      console.log(data);
      setServerData(data);
      setFetching(false); //false 이면 FetchingModal 을 감춘다. 서버와의 통신이 끝났다.
    });
  }, [page, size, refresh]);

  //이미지 게시판 이다. 그런데 레이아웃이 없는데 레이아웃을 넣은것 처럼 보인다.
  //챗GPT 에게 "레이아웃이 없는데 어떻게 레이아웃 효과가 나는지?" 라고 물었더니
  //브라우저에서 <div className="flex flex-wrap">를 쓰면,
  //명확한 “레이아웃 코드”가 없어 보이더라도 그 자체만으로도 이미 자동으로 줄 바꿈 및 정렬 구조를 형성합니다.
  //라는 답변을 받았습니다.
  return (
    <div className="border-2 border-blue-100 mt-10 mx-2">
      {fetching && <FetchingModal />}{" "}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 justify-items-center mx-auto p-4"
        style={{ maxWidth: "1200px" }}
      >
        {serverData.dtoList.map((product) => (
          <div
            key={product.pno}
            className="w-full max-w-md rounded shadow-md border-2 cursor-pointer hover:shadow-lg transition min-h-[300px] sm:min-h-[auto]"
            onClick={() => moveToProductRead(product.pno)}
          >
            {/* 아래 flex-row로 바꾸고, sm:에서는 세로 정렬 유지 */}
            <div className="flex flex-row sm:flex-col h-full">
              {/* 이미지 영역 - 모바일에서 더 크게 */}
              <div className="w-1/2 sm:w-full flex items-center justify-center p-4">
                <div className="w-full max-w-none sm:max-w-60 aspect-[5/6] rounded-md overflow-hidden flex items-center justify-center bg-gray-50">
                  <img
                    alt="product"
                    className="max-w-full max-h-full object-contain"
                    src={`${host}/api/products/view/s_${product.uploadFileNames[0]}`}
                  />
                </div>
              </div>

              {/* 텍스트 영역 - 모바일에서 더 잘 정렬 */}
              <div className="w-1/2 sm:w-full p-4 bg-white flex flex-col justify-center">
                <div className="text-center p-2 text-lg font-semibold">
                  이름: {product.pname}
                </div>
                <div className="text-center p-2 text-lg font-medium text-blue-600">
                  가격: {product.price}원
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <PageComponent serverData={serverData} movePage={moveToProductList} />
    </div>
  );
};

export default ListComponent;
