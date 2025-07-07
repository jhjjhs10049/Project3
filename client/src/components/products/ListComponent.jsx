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
  totoalCount: 0,
  prePage: 0, //이전 페이지 번호, 0 이면 이전 페이지가 없거나 초기 상태 일때 0
  nextPage: 0,
  totalPage: 0,
  current: 0,
};

const ListComponent = () => {
  const { page, size, refresh, moveToList, moveToRead } = useCustomMove();

  //serverData는 나중에 사용
  const [serverData, setServerData] = useState(initState); //for FetchingModal
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
    <div className="border-2 border-blue-100 mt-10 mr-2 ml-2">
      {fetching ? <FetchingModal /> : <></>}{" "}
      {/* fetching 의 값이 true/fasle 일경우 fetchingModal 을 보이게 할지 여부를 설정*/}
      <div className="flex flex-wrap mx-auto p-6">
        {serverData.dtoList.map((product) => (
          //div 의 key 속성 : React가 각 요소를 고유하게 식별하기 위해 필요, key의 값은 고유하고 안정적인 값을 사용하자(예:DB id)
          //변경/추가/삭제 시 리렌더링 최소화  //변경/추가/삭제 시 리렌더링 최소화 (key가 없으면, React는 순서와 인덱스 기반으로 매칭을 시도하는데 key가 있다면 어느 요소를 유지/삭제/이동할지 정확하게 판단할 수 있다)
          // 목록 데이터 출력후 상품 조회 페이지로 이동할수 있도록 moveToRead() 사용
          <div
            key={product.pno}
            className="w-1/2 p-1 rounded shadow-md border-2"
            onClick={() => moveToRead(product.pno)}
          >
            <div className="flex flex-col  h-full">
              <div className="font-extrabold text-2xl p-2 w-full ">
                {product.pno}
              </div>
              <div className="text-1xl m-1 p-2 w-full flex flex-col">
                <div className="w-full overflow-hidden ">
                  <img
                    alt="product"
                    className="m-auto rounded-md w-60" //src= 주소를 보면 원본 이미지 주소를 보여주는게 아니라 썸네일 주소를 보여주고 있다.
                    //서버에서 읽어온건 원본 이미지 이름 인데 화면에서 보여주는건
                    //원본 이미지가 아닌 섬네일 이미지 주소를 보여준다.
                    //실제 저장된 위치가 D:\CodeLearndeReact\server\mallapi\upload 이다.
                    //프로젝트 폴더를 열어보면 upload 폴더가 2개다. 헷갈리지 말자.
                    //가장 안쪽에 있는 upload 폴더에 이미지가 저장된다.(upload 폴더가 2개인 이유가 프로젝트 열때 위치때문같은데..)
                    //그리고 그 경로를 localhost:8080/api/products/view/s_파일이름 으로 인식한다.
                    src={`${host}/api/products/view/s_${product.uploadFileNames[0]}`}
                  />
                </div>

                <div className="bottom-0 font-extrabold bg-white">
                  <div className="text-center p-1">이름: {product.pname}</div>
                  <div className="text-center p-1">가격: {product.price}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <PageComponent
        serverData={serverData}
        movePage={moveToList}
      ></PageComponent>
    </div>
  );
};

export default ListComponent;
