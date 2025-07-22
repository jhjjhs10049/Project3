import { useEffect, useState } from "react";
import { getOne } from "../../api/productsApi";
import { API_SERVER_HOST } from "../../api/todoApi";
import useCustomMove from "../../hooks/useCustomMove";
import FetchingModal from "../common/FetchingModal";
import useCustomLogin from "../../hooks/useCustomLogin";
import useCustomCart from "../../hooks/useCustomCart";
import { useNavigate } from "react-router-dom";

const initState = {
  pno: 0,
  pname: "",
  pdesc: "",
  price: 0,
  uploadFileNames: [],
};

const host = API_SERVER_HOST;

const ReadComponent = ({ pno }) => {
  const [product, setProduct] = useState(initState);

  //화면 이동용 함수
  const { moveToProductList, moveToProductModify } = useCustomMove();
  const navigate = useNavigate();

  //FetchingModal 을 보여줄지 여부
  const [fetching, setFetching] = useState(false); // 로그인 상태 확인
  const { isLogin, loginState, moveToLogin } = useCustomLogin();
  //장바구니 기능
  const { changeCart, cartItems } = useCustomCart();
  const handleClickAddCart = () => {
    // 로그인 체크
    if (!isLogin) {
      alert("로그인이 필요한 서비스입니다.");
      moveToLogin(); // 로그인 페이지로 이동
      return;
    }

    let qty = 1;

    //item 은 cartItems 의 요소(엘리먼트) 입니다.
    //parseInt(pno) 에서 pno 는 ReadComponent = ({pno}) 입니다.
    //filter() 를 사용해서 true 인 요소만 통과 시킨다.(pno가 문자열 일수도 있기 때문에 parseInt 를 사용해서 정수로 변환합니다.)
    //통과한 요소들 중에 0번째 요소를 찾는다.
    const addedItem = cartItems.filter((item) => item.pno === parseInt(pno))[0];

    if (addedItem) {
      //추가된 적이 있는 상품 이라면
      if (
        window.confirm("이미 추가된 상품입니다. 추가 하시겠습니까? ") === false
      ) {
        return; //추가 하지 않으면 return
      }
      qty = addedItem.qty + 1; //추가 한다면 + 1
    }

    // 장바구니에 상품 추가
    changeCart({ email: loginState.email, pno: pno, qty: qty });

    // 추가 완료 후 이동 확인
    if (
      window.confirm("장바구니에 추가되었습니다. 장바구니로 이동하시겠습니까?")
    ) {
      navigate("/shoppingCart");
    }
  };

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
        ))}{" "}
      </div>{" "}
      <div className="flex justify-end p-4">
        <button
          type="button"
          className="inline-block rounded p-4 m-2 text-xl w-32 text-white bg-green-500"
          onClick={handleClickAddCart}
        >
          Add Cart {/* 장바구니에 상품 추가하기 */}
        </button>
        {/* 로그인한 사용자에게만 Modify 버튼 표시 */}
        {isLogin && (
          <button
            type="button"
            className="inline=block rounded p-4 m-2 text-xl w-32 text-white bg-red-500"
            onClick={() => moveToProductModify(pno)}
          >
            Modify
          </button>
        )}

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
