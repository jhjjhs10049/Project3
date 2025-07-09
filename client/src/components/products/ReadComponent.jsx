import { useEffect, useState } from "react";
import { getOne } from "../../api/productsApi";
import { API_SERVER_HOST } from "../../api/todoApi";
import useCustomMove from "../../hooks/useCustomMove";
import FetchingModal from "../common/FetchingModal";

const initState = {
  pno: 0,
  pname: "",
  pdesc: "",
  price: 0,
  uploadFileNames: [],
};

const host = API_SERVER_HOST;

const ReadComponent = ({ pno }) => {
  const [product, setProduct] = useState(initState); //화면 이동용 함수
  const { moveToProductList, moveToProductModify } = useCustomMove();

  //FetchingModal 을 보여줄지 여부
  const [fetching, setFetching] = useState(false);

  // products/AddComponent 에 있는 setFetching 과 postAdd() 부분의 주석을 참조하세요.
  useEffect(() => {
    setFetching(true);

    getOne(pno).then((data) => {
      setProduct(data); //product 에 서버에서 읽어온 data 를 저장
      setFetching(false); // FetchingModal 이 사라져야 하니까 false 로 저장
    });
  }, [pno]);

  return (
    <div className="border-2 border-sky-200 mt-10 m-2 p-4">
      {fetching ? <FetchingModal /> : <></>}
      <div className="flex justify-center mt-10">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">PNO</div>
          <div className="w-4/5 p-6 rounded-r border border-solid shadow-md">
            {product.pno}
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">PNAME</div>
          <div className="w-4/5 p-6 rounded-r border border-solid shadow-md">
            {product.pname}
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">PRICE</div>
          <div className="w-4/5 p-6 rounded-r border border-solid shadow-md">
            {product.price}
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-1/5 p-6 text-right font-bold">PDESC</div>
          <div className="w-4/5 p-6 rounded-r border border-solid shadow-md">
            {product.pdesc}
          </div>
        </div>
      </div>
      <div className="w-full justify-center flex flex-col m-auto items-center">
        {/* uploadFileNames는 배열이다. 그래서 i번째 배열의 요소를 imgFile 에 저장하는 배열을 순회하는 코드이다.   */}
        {product.uploadFileNames.map((imgFile, i) => (
          <img
            alt="product" // 이미지가 로드 되지 않았을때 보여줄 텍스트
            key={i} //React에서 리스트를 렌더링할 때 각 항목을 고유하게 식별하기 위한 key 값.
            className="p-4 w-1/2"
            src={`${host}/api/products/view/${imgFile}`}
          />
        ))}
      </div>{" "}
      <div className="flex justify-end p-4">
        <button
          type="button"
          className="inline=block rounded p-4 m-2 text-xl w-32 text-white bg-red-500"
          onClick={() => moveToProductModify(pno)}
        >
          Modify
        </button>

        <button
          type="button"
          className="rounded p-4 m-2 text-xl w-32 text-white bg-blue-500"
          onClick={moveToProductList}
        >
          List
        </button>
      </div>
    </div>
  );
};

export default ReadComponent;
